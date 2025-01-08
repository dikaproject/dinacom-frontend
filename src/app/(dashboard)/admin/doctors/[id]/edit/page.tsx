// pages/admin/doctors/edit/[id]/page.tsx
"use client"
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FiArrowLeft, FiSave } from 'react-icons/fi';
import Link from 'next/link';
import PageWrapper from '@/components/PageWrapper';

const EditDoctor = ({ params }: { params: { id: string } }) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    email: '',
    fullName: '',
    strNumber: '',
    sipNumber: '',
    phoneNumber: '',
    province: '',
    district: '',
    subdistrict: '',
    address: '',
    postalCode: '',
    healthcareProviderId: '',
    educationBackground: '',
    profileImage: null as File | null,
    approvalDocument: null as File | null
  });

  // Mock healthcare providers for dropdown
  const healthcareProviders = [
    { id: '1', name: 'RS Premier Bintaro' },
    { id: '2', name: 'RSCM Jakarta' },
  ];

  // Update the common input/textarea classes
  const inputClasses = "mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-gray-900 focus:ring-purple-500 focus:border-purple-500";

  // Fetch doctor data
  useEffect(() => {
    const fetchDoctor = async () => {
      setIsLoading(true);
      try {
        // Mock API call - replace with actual API
        await new Promise(resolve => setTimeout(resolve, 1000));
        // Simulate fetched data
        setFormData({
          email: 'sarah.j@example.com',
          fullName: 'Dr. Sarah Johnson',
          strNumber: 'STR123456',
          sipNumber: 'SIP789012',
          phoneNumber: '6281234567890',
          province: 'DKI Jakarta',
          district: 'Jakarta Selatan',
          subdistrict: 'Pondok Indah',
          address: 'Jl. RS No. 1',
          postalCode: '12310',
          healthcareProviderId: '1',
          educationBackground: 'Medical School - University of Indonesia',
          profileImage: null,
          approvalDocument: null
        });
      } catch {
        setError('Failed to fetch doctor data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchDoctor();
  }, [params.id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Validation
    if (!formData.strNumber.startsWith('STR')) {
      setError('STR Number must start with STR');
      setIsLoading(false);
      return;
    }

    if (!formData.sipNumber.startsWith('SIP')) {
      setError('SIP Number must start with SIP');
      setIsLoading(false);
      return;
    }

    if (!formData.phoneNumber.startsWith('62')) {
      setError('Phone number must start with country code 62');
      setIsLoading(false);
      return;
    }

    try {
      // Add update API call here
      await new Promise(resolve => setTimeout(resolve, 1000));
      router.push('/admin/doctors');
    } catch {
      setError('Failed to update doctor');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading && !formData.email) {
    return (
      <PageWrapper>
        <main className="min-h-screen bg-gray-50 py-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
              <div className="bg-white rounded-lg shadow-md p-6">
                Loading...
              </div>
            </div>
          </div>
        </main>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper>
      <main className="min-h-screen bg-gray-50 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            {/* Header */}
            <div className="mb-8">
              <Link
                href="/admin/doctors"
                className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-4"
              >
                <FiArrowLeft className="mr-2" /> Back to Doctors
              </Link>
              <h1 className="text-2xl font-bold text-gray-900">Edit Doctor</h1>
              <p className="text-gray-600">Update doctor information</p>
            </div>

            {/* Form */}
            <div className="bg-white rounded-lg shadow-md">
              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                {error && (
                  <div className="p-4 bg-red-50 text-red-600 rounded-lg">
                    {error}
                  </div>
                )}

                {/* Basic Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Email</label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className={inputClasses}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Full Name</label>
                    <input
                      type="text"
                      required
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      className={inputClasses}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">STR Number</label>
                    <input
                      type="text"
                      required
                      value={formData.strNumber}
                      onChange={(e) => setFormData({ ...formData, strNumber: e.target.value })}
                      className={inputClasses}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">SIP Number</label>
                    <input
                      type="text"
                      required
                      value={formData.sipNumber}
                      onChange={(e) => setFormData({ ...formData, sipNumber: e.target.value })}
                      className={inputClasses}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Phone Number</label>
                    <input
                      type="text"
                      required
                      value={formData.phoneNumber}
                      onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                      className={inputClasses}
                    />
                  </div>
                </div>

                {/* Address Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Province</label>
                    <input
                      type="text"
                      required
                      value={formData.province}
                      onChange={(e) => setFormData({ ...formData, province: e.target.value })}
                      className={inputClasses}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">District</label>
                    <input
                      type="text"
                      required
                      value={formData.district}
                      onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                      className={inputClasses}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Sub-district</label>
                    <input
                      type="text"
                      required
                      value={formData.subdistrict}
                      onChange={(e) => setFormData({ ...formData, subdistrict: e.target.value })}
                      className={inputClasses}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Postal Code</label>
                    <input
                      type="text"
                      required
                      value={formData.postalCode}
                      onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                      className={inputClasses}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Address</label>
                  <textarea
                    required
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    rows={3}
                    className={inputClasses}
                  />
                </div>

                {/* Professional Information */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">Healthcare Provider</label>
                  <select
                    required
                    value={formData.healthcareProviderId}
                    onChange={(e) => setFormData({ ...formData, healthcareProviderId: e.target.value })}
                    className={inputClasses}
                  >
                    <option value="" className="text-gray-900">Select Healthcare Provider</option>
                    {healthcareProviders.map(provider => (
                      <option key={provider.id} value={provider.id} className="text-gray-900">
                        {provider.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Education Background</label>
                  <textarea
                    required
                    value={formData.educationBackground}
                    onChange={(e) => setFormData({ ...formData, educationBackground: e.target.value })}
                    rows={3}
                    className={inputClasses}
                  />
                </div>

                {/* File Uploads */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Update Profile Image</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) setFormData({ ...formData, profileImage: file });
                      }}
                      className="mt-1 block w-full"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Update Approval Document</label>
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) setFormData({ ...formData, approvalDocument: file });
                      }}
                      className="mt-1 block w-full"
                    />
                  </div>
                </div>

                {/* Form Actions */}
                <div className="flex justify-end space-x-4 pt-6">
                  <Link
                    href="/admin/doctors"
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </Link>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 flex items-center"
                  >
                    <FiSave className="mr-2" />
                    {isLoading ? 'Saving...' : 'Save Changes'}
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

export default EditDoctor;