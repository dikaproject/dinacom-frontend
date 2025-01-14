"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FiSave, FiArrowLeft, FiUpload } from 'react-icons/fi';
import Link from 'next/link';
import PageWrapper from '@/components/PageWrapper';
import { patientService } from '@/services/patient';
import { PatientFormData } from '@/types/patient';

const AddPatient = () => {
  const router = useRouter();
  const [formData, setFormData] = useState<PatientFormData>({
    email: '',
    password: '',
    profile: {
      fullName: '',
      dateOfBirth: '',
      phoneNumber: '',
      reminderTime: '',
      address: '',
      bloodType: '',
      height: 0,
      pregnancyStartDate: '',
    }
  });
  const [photoPreview, setPhotoPreview] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData({ ...formData, photoProfile: file });
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
      await patientService.create(formData);
      router.push('/admin/users');
    } catch (error: any) {
      setError(error?.response?.data?.message || 'Failed to create patient');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <PageWrapper>
      <main className="min-h-screen bg-gray-50 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            {/* Header */}
            <div className="mb-8">
              <Link href="/admin/users" className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-4">
                <FiArrowLeft className="mr-2" /> Back to Patients
              </Link>
              <h1 className="text-2xl font-bold text-gray-900">Add Patient</h1>
              <p className="text-gray-600">Create a new patient account</p>
            </div>

            {/* Form */}
            <div className="bg-white rounded-lg shadow-md">
              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                {error && (
                  <div className="p-4 bg-red-50 text-red-600 rounded-lg">
                    {error}
                  </div>
                )}

                {/* Account Information */}
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-2 border rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Password <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="password"
                      required
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      className="w-full px-4 py-2 border rounded-lg"
                    />
                  </div>
                </div>

                {/* Profile Photo */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Profile Photo
                  </label>
                  <div className="mt-1 flex items-center space-x-4">
                    <div className="w-20 h-20 rounded-full overflow-hidden bg-gray-100">
                      {photoPreview ? (
                        <img src={photoPreview} alt="Preview" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <FiUpload className="text-gray-400" />
                        </div>
                      )}
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoChange}
                      className="hidden"
                      id="photo-upload"
                    />
                    <label
                      htmlFor="photo-upload"
                      className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 cursor-pointer"
                    >
                      Change photo
                    </label>
                  </div>
                </div>

                {/* Personal Information */}
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.profile.fullName}
                      onChange={(e) => setFormData({
                        ...formData,
                        profile: { ...formData.profile, fullName: e.target.value }
                      })}
                      className="w-full px-4 py-2 border rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Date of Birth <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      required
                      value={formData.profile.dateOfBirth}
                      onChange={(e) => setFormData({
                        ...formData,
                        profile: { ...formData.profile, dateOfBirth: e.target.value }
                      })}
                      className="w-full px-4 py-2 border rounded-lg"
                    />
                  </div>
                  <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Phone Number <span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              required
              value={formData.profile.phoneNumber}
              onChange={(e) => setFormData({
                ...formData,
                profile: { ...formData.profile, phoneNumber: e.target.value }
              })}
              className="w-full px-4 py-2 border rounded-lg"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Reminder Time <span className="text-red-500">*</span>
            </label>
            <input
              type="time"
              required
              value={formData.profile.reminderTime}
              onChange={(e) => setFormData({
                ...formData,
                profile: { ...formData.profile, reminderTime: e.target.value }
              })}
              className="w-full px-4 py-2 border rounded-lg"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Address <span className="text-red-500">*</span>
            </label>
            <textarea
              required
              value={formData.profile.address}
              onChange={(e) => setFormData({
                ...formData,
                profile: { ...formData.profile, address: e.target.value }
              })}
              rows={3}
              className="w-full px-4 py-2 border rounded-lg"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Blood Type
            </label>
            <select
              value={formData.profile.bloodType || ''}
              onChange={(e) => setFormData({
                ...formData,
                profile: { ...formData.profile, bloodType: e.target.value }
              })}
              className="w-full px-4 py-2 border rounded-lg text-gray-700"
            >
              <option value="">Select Blood Type</option>
              <option value="A+">A+</option>
              <option value="A-">A-</option>
              <option value="B+">B+</option>
              <option value="B-">B-</option>
              <option value="O+">O+</option>
              <option value="O-">O-</option>
              <option value="AB+">AB+</option>
              <option value="AB-">AB-</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Height (cm)
            </label>
            <input
              type="number"
              value={formData.profile.height || ''}
              onChange={(e) => setFormData({
                ...formData,
                profile: { ...formData.profile, height: parseFloat(e.target.value) }
              })}
              min="0"
              step="0.1"
              className="w-full px-4 py-2 border rounded-lg"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Pregnancy Start Date <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              required
              value={formData.profile.pregnancyStartDate}
              onChange={(e) => setFormData({
                ...formData,
                profile: { ...formData.profile, pregnancyStartDate: e.target.value }
              })}
              className="w-full px-4 py-2 border rounded-lg"
            />
          </div>
        </div>

                {/* Submit Button */}
                <div className="flex justify-end space-x-4 pt-6">
                  <Link
                    href="/admin/users"
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-gray-700"
                  >
                    Cancel
                  </Link>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center disabled:opacity-50"
                  >
                    <FiSave className="mr-2" />
                    {isLoading ? 'Creating...' : 'Create Patient'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </main>
    </PageWrapper>
  );
};

export default AddPatient;