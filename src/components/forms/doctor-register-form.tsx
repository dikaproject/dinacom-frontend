"use client"

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { FiUpload } from 'react-icons/fi';
import { authService } from '@/services/auth';
import { toast } from 'react-hot-toast';
import { layananKesehatanService } from '@/services/layananKesehatan';
import { LayananKesehatan } from '@/types/layananKesehatan';

const DoctorRegisterForm = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const docInputRef = useRef<HTMLInputElement>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [docName, setDocName] = useState<string | null>(null);
  const [healthcareProviders, setHealthcareProviders] = useState<LayananKesehatan[]>([]);

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
    strNumber: '',
    sipNumber: '',
    phoneNumber: '',
    provinsi: '',
    kabupaten: '',
    kecamatan: '',
    address: '',
    codePos: '',
    layananKesehatanId: '',
    educationBackground: '',
    photoProfile: null as File | null,
    documentsProof: null as File | null
  });

  useEffect(() => {
    const fetchProviders = async () => {
      try {
        const providers = await layananKesehatanService.getAll();
        setHealthcareProviders(providers);
      } catch (error) {
        console.error('Error fetching healthcare providers:', error);
        toast.error('Failed to fetch healthcare providers');
      }
    };

    fetchProviders();
  }, []);

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('File size should not exceed 5MB');
        return;
      }
      setFormData(prev => ({ ...prev, photoProfile: file }));
      const reader = new FileReader();
      reader.onloadend = () => setPhotoPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleDocChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('File size should not exceed 5MB');
        return;
      }
      setFormData(prev => ({ ...prev, documentsProof: file }));
      setDocName(file.name);
    }
  };

    const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
  
    try {
      const formDataToSend = new FormData();
      
      // Add basic fields
      formDataToSend.append('email', formData.email);
      formDataToSend.append('password', formData.password);
      formDataToSend.append('fullName', formData.fullName);
      formDataToSend.append('strNumber', formData.strNumber);
      formDataToSend.append('sipNumber', formData.sipNumber);
      formDataToSend.append('phoneNumber', formData.phoneNumber);
      formDataToSend.append('provinsi', formData.provinsi);
      formDataToSend.append('kabupaten', formData.kabupaten);
      formDataToSend.append('kecamatan', formData.kecamatan);
      formDataToSend.append('address', formData.address);
      formDataToSend.append('codePos', formData.codePos);
      formDataToSend.append('layananKesehatanId', formData.layananKesehatanId);
      formDataToSend.append('educationBackground', formData.educationBackground);
  
      // Add files with correct field names
      if (formData.photoProfile) {
        formDataToSend.append('photoProfile', formData.photoProfile);
      }
      if (formData.documentsProof) {
        formDataToSend.append('documentsProof', formData.documentsProof);
      }
  
      // Debug log
      console.log('FormData contents before submission:');
      for (const [key, value] of formDataToSend.entries()) {
        console.log(`${key}:`, value);
      }
  
      const response = await authService.registerDoctor(formDataToSend);
      
      if (response.token) {
        toast.success('Registration successful!');
        router.push('/login');
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Registration failed';
      setError(message);
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="min-h-screen bg-gradient-to-b from-white to-purple-50 py-20">
      <motion.div
        className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Doctor Registration</h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-3 text-sm text-red-600 bg-red-50 rounded-lg">
                {error}
              </div>
            )}

            {/* Photo Upload Section */}
            <div className="flex justify-center mb-8">
              <div className="space-y-4">
                <div className="relative w-32 h-32 rounded-full overflow-hidden border-2 border-purple-100 mx-auto">
                  {photoPreview ? (
                    <Image
                      src={photoPreview}
                      alt="Profile preview"
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-purple-50">
                      <FiUpload className="w-8 h-8 text-purple-300" />
                    </div>
                  )}
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoChange}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-4 py-2 text-sm text-purple-600 border border-purple-200 rounded-lg hover:bg-purple-50"
                >
                  Upload Photo
                </button>
              </div>
            </div>

            {/* Document Upload */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Documentation Proof (STR/SIP)
              </label>
              <div className="flex items-center space-x-4">
                <input
                  ref={docInputRef}
                  type="file"
                  accept=".pdf,image/*"
                  onChange={handleDocChange}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => docInputRef.current?.click()}
                  className="px-4 py-2 text-sm text-purple-600 border border-purple-200 rounded-lg hover:bg-purple-50"
                >
                  Upload Document
                </button>
                {docName && (
                  <span className="text-sm text-gray-600">{docName}</span>
                )}
              </div>
            </div>

            {/* Form Fields in Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Account Information */}
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-700">Account Information</h3>
                
                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">Email</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="mt-1 w-full px-4 py-3 rounded-lg border border-purple-100 focus:outline-none focus:ring-2 focus:ring-purple-400"
                    required
                  />
                </div>

                {/* Password */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">Password</label>
                  <input
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="mt-1 w-full px-4 py-3 rounded-lg border border-purple-100 focus:outline-none focus:ring-2 focus:ring-purple-400"
                    required
                  />
                </div>

                {/* Confirm Password */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">Confirm Password</label>
                  <input
                    type="password"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    className="mt-1 w-full px-4 py-3 rounded-lg border border-purple-100 focus:outline-none focus:ring-2 focus:ring-purple-400"
                    required
                  />
                </div>
              </div>

              {/* Personal Information */}
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-700">Personal Information</h3>
                
                {/* Full Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">Full Name</label>
                  <input
                    type="text"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className="mt-1 w-full px-4 py-3 rounded-lg border border-purple-100 focus:outline-none focus:ring-2 focus:ring-purple-400"
                    required
                  />
                </div>

                {/* STR Number */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">STR Number</label>
                  <input
                    type="text"
                    value={formData.strNumber}
                    onChange={(e) => setFormData({ ...formData, strNumber: e.target.value })}
                    className="mt-1 w-full px-4 py-3 rounded-lg border border-purple-100 focus:outline-none focus:ring-2 focus:ring-purple-400"
                    required
                  />
                </div>

                {/* SIP Number */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">SIP Number</label>
                  <input
                    type="text"
                    value={formData.sipNumber}
                    onChange={(e) => setFormData({ ...formData, sipNumber: e.target.value })}
                    className="mt-1 w-full px-4 py-3 rounded-lg border border-purple-100 focus:outline-none focus:ring-2 focus:ring-purple-400"
                    required
                  />
                </div>

                {/* Phone Number */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">Phone Number</label>
                  <input
                    type="tel"
                    value={formData.phoneNumber}
                    onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                    className="mt-1 w-full px-4 py-3 rounded-lg border border-purple-100 focus:outline-none focus:ring-2 focus:ring-purple-400"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Address Information */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-700">Address Information</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Province</label>
                  <input
                    type="text"
                    value={formData.provinsi}
                    onChange={(e) => setFormData({ ...formData, provinsi: e.target.value })}
                    className="mt-1 w-full px-4 py-3 rounded-lg border border-purple-100 focus:outline-none focus:ring-2 focus:ring-purple-400"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">City/Regency</label>
                  <input
                    type="text"
                    value={formData.kabupaten}
                    onChange={(e) => setFormData({ ...formData, kabupaten: e.target.value })}
                    className="mt-1 w-full px-4 py-3 rounded-lg border border-purple-100 focus:outline-none focus:ring-2 focus:ring-purple-400"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">District</label>
                  <input
                    type="text"
                    value={formData.kecamatan}
                    onChange={(e) => setFormData({ ...formData, kecamatan: e.target.value })}
                    className="mt-1 w-full px-4 py-3 rounded-lg border border-purple-100 focus:outline-none focus:ring-2 focus:ring-purple-400"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Address</label>
                  <textarea
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    rows={3}
                    className="mt-1 w-full px-4 py-3 rounded-lg border border-purple-100 focus:outline-none focus:ring-2 focus:ring-purple-400"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Postal Code</label>
                  <input
                    type="text"
                    value={formData.codePos}
                    onChange={(e) => setFormData({ ...formData, codePos: e.target.value })}
                    className="mt-1 w-full px-4 py-3 rounded-lg border border-purple-100 focus:outline-none focus:ring-2 focus:ring-purple-400"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Professional Information */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-700">Professional Information</h3>
              
              <div>
      <label className="block text-sm font-medium text-gray-700">Healthcare Provider</label>
      <select
        value={formData.layananKesehatanId}
        onChange={(e) => setFormData({ ...formData, layananKesehatanId: e.target.value })}
        className="mt-1 w-full px-4 py-3 rounded-lg border border-purple-100 focus:outline-none focus:ring-2 focus:ring-purple-400"
        required
      >
        <option value="">Select Healthcare Provider</option>
        {healthcareProviders.map((provider) => (
          <option key={provider.id} value={provider.id}>
            {provider.name}
          </option>
        ))}
      </select>
    </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Education Background</label>
                <textarea
                  value={formData.educationBackground}
                  onChange={(e) => setFormData({ ...formData, educationBackground: e.target.value })}
                  rows={4}
                  className="mt-1 w-full px-4 py-3 rounded-lg border border-purple-100 focus:outline-none focus:ring-2 focus:ring-purple-400"
                  required
                />
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={isLoading}
              className={`w-full py-4 bg-gradient-to-r from-purple-600 to-purple-500 text-white rounded-lg font-medium shadow-lg hover:shadow-xl transition-all ${
                isLoading ? "opacity-70 cursor-not-allowed" : ""
              }`}
            >
              {isLoading ? "Registering..." : "Register as Doctor"}
            </motion.button>

            <p className="text-center text-sm text-gray-600">
              Already have an account?{" "}
              <Link href="/login" className="text-purple-600 hover:text-purple-700">
                Login here
              </Link>
            </p>
          </form>
        </div>
      </motion.div>
    </section>
  );
};

export default DoctorRegisterForm;