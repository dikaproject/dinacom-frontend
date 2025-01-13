"use client"

import { useState, useEffect, useRef } from 'react';
import { use } from 'react';
import { useRouter } from 'next/navigation';
import { FiSave, FiArrowLeft, FiUpload } from 'react-icons/fi';
import Link from 'next/link';
import Image from 'next/image';
import PageWrapper from '@/components/PageWrapper';
import { patientService } from '@/services/patient';
import { Patient, PatientFormData } from '@/types/patient';
import { toast } from 'react-hot-toast';

const EditPatient = ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = use(params);
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState<PatientFormData>({
    email: '',
    password: '', // Optional for edit
    profile: {
      fullName: '',
      dateOfBirth: '',
      phoneNumber: '',
      reminderTime: '',
      address: '',
      bloodType: '',
      height: '',
      pregnancyStartDate: '',
    },
    photoProfile: null
  });

  useEffect(() => {
    const fetchPatient = async () => {
      try {
        const patient = await patientService.getById(id);
        setFormData({
          email: patient.email,
          password: '', // Don't show existing password
          profile: {
            fullName: patient.profile.fullName,
            dateOfBirth: new Date(patient.profile.dateOfBirth).toISOString().split('T')[0],
            phoneNumber: patient.profile.phoneNumber,
            reminderTime: patient.profile.reminderTime,
            address: patient.profile.address,
            bloodType: patient.profile.bloodType,
            height: patient.profile.height?.toString() || '',
            pregnancyStartDate: new Date(patient.profile.pregnancyStartDate).toISOString().split('T')[0],
          },
          photoProfile: null
        });

        if (patient.profile.photoProfile) {
          setPhotoPreview(`${process.env.NEXT_PUBLIC_API_URL}/uploads/profiles/${patient.profile.photoProfile}`);
        }
      } catch (error) {
        toast.error('Failed to fetch patient data');
        setError('Failed to fetch patient data');
      }
    };

    fetchPatient();
  }, [id]);

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size should not exceed 5MB');
        return;
      }

      setFormData(prev => ({
        ...prev,
        photoProfile: file
      }));

      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      await patientService.update(id, formData);
      toast.success('Patient updated successfully');
      router.push('/admin/patients');
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || 'Failed to update patient';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <PageWrapper>
      <div className="min-h-screen bg-gray-50 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            {/* Header */}
            <div className="mb-8">
              <Link
                href="/admin/patients"
                className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-4"
              >
                <FiArrowLeft className="mr-2" /> Back to Patients
              </Link>
              <h1 className="text-2xl font-bold text-gray-900">Edit Patient</h1>
            </div>

            {/* Form */}
            <div className="bg-white rounded-lg shadow-md">
              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                {error && (
                  <div className="p-4 bg-red-50 text-red-600 rounded-lg">
                    {error}
                  </div>
                )}

                {/* Photo Upload */}
                <div className="flex justify-center">
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
                      Change Photo
                    </button>
                  </div>
                </div>

                {/* Account Information */}
                <div className="grid grid-cols-1 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-400"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      New Password (leave blank to keep current)
                    </label>
                    <input
                      type="password"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-400"
                    />
                  </div>
                </div>

                {/* Profile Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={formData.profile.fullName}
                      onChange={(e) => setFormData({
                        ...formData,
                        profile: { ...formData.profile, fullName: e.target.value }
                      })}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-400"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Date of Birth
                    </label>
                    <input
                      type="date"
                      value={formData.profile.dateOfBirth}
                      onChange={(e) => setFormData({
                        ...formData,
                        profile: { ...formData.profile, dateOfBirth: e.target.value }
                      })}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-400"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      value={formData.profile.phoneNumber}
                      onChange={(e) => setFormData({
                        ...formData,
                        profile: { ...formData.profile, phoneNumber: e.target.value }
                      })}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-400"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Reminder Time
                    </label>
                    <input
                      type="time"
                      value={formData.profile.reminderTime}
                      onChange={(e) => setFormData({
                        ...formData,
                        profile: { ...formData.profile, reminderTime: e.target.value }
                      })}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-400"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Address
                    </label>
                    <textarea
                      value={formData.profile.address}
                      onChange={(e) => setFormData({
                        ...formData,
                        profile: { ...formData.profile, address: e.target.value }
                      })}
                      rows={3}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-400"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Blood Type
                    </label>
                    <select
                      value={formData.profile.bloodType}
                      onChange={(e) => setFormData({
                        ...formData,
                        profile: { ...formData.profile, bloodType: e.target.value }
                      })}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-400"
                    >
                      <option value="">Select Blood Type</option>
                      <option value="A">A</option>
                      <option value="B">B</option>
                      <option value="AB">AB</option>
                      <option value="O">O</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Height (cm)
                    </label>
                    <input
                      type="number"
                      value={formData.profile.height}
                      onChange={(e) => setFormData({
                        ...formData,
                        profile: { ...formData.profile, height: e.target.value }
                      })}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-400"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Pregnancy Start Date
                    </label>
                    <input
                      type="date"
                      value={formData.profile.pregnancyStartDate}
                      onChange={(e) => setFormData({
                        ...formData,
                        profile: { ...formData.profile, pregnancyStartDate: e.target.value }
                      })}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-400"
                    />
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end space-x-4 pt-6">
                  <Link
                    href="/admin/patients"
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                  >
                    Cancel
                  </Link>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center disabled:opacity-50"
                  >
                    <FiSave className="mr-2" />
                    {isLoading ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
};

export default EditPatient;