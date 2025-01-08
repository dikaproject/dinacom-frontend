// pages/admin/doctors/page.tsx
"use client"
import { useState } from 'react';
import { FiPlus, FiEdit2, FiTrash2, FiSearch } from 'react-icons/fi';
import Link from 'next/link';
import PageWrapper from '@/components/PageWrapper';

const DoctorsList = () => {
  const [searchQuery, setSearchQuery] = useState('');

  // Mock data
  const mockDoctors = [
    {
      id: 1,
      fullName: 'Dr. Sarah Johnson',
      email: 'sarah.j@example.com',
      strNumber: 'STR123456',
      sipNumber: 'SIP789012',
      phoneNumber: '6281234567890',
      province: 'DKI Jakarta',
      healthcareProvider: 'RS Premier Bintaro'
    }
  ];

  return (
    <PageWrapper>
      <main className="min-h-screen bg-gray-50 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900">Doctors</h1>
            <p className="text-gray-600">Manage registered doctors</p>
          </div>

          {/* Search & Add Button */}
          <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
            <div className="w-full sm:w-auto relative">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search doctors..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full sm:w-96 pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-transparent"
              />
            </div>
            <Link
              href="/admin/doctors/add"
              className="w-full sm:w-auto px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center justify-center"
            >
              <FiPlus className="mr-2" /> Add Doctor
            </Link>
          </div>

          {/* Doctors Table */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">STR Number</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">SIP Number</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Healthcare Provider</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {mockDoctors.map((doctor) => (
                    <tr key={doctor.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{doctor.fullName}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-600">{doctor.email}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-600">{doctor.strNumber}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-600">{doctor.sipNumber}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-600">{doctor.healthcareProvider}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <Link
                          href={`/admin/doctors/edit/${doctor.id}`}
                          className="text-purple-600 hover:text-purple-900 mr-4"
                        >
                          <FiEdit2 className="inline-block w-5 h-5" />
                        </Link>
                        <button className="text-red-600 hover:text-red-900">
                          <FiTrash2 className="inline-block w-5 h-5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </PageWrapper>
  );
};

export default DoctorsList;