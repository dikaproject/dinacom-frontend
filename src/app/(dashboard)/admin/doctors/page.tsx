"use client"
import { useState, useEffect } from 'react';
import { FiPlus, FiEdit2, FiTrash2, FiSearch, FiX, FiCheck } from 'react-icons/fi';
import Link from 'next/link';
import PageWrapper from '@/components/PageWrapper';
import { adminService } from '@/services/admin';
import { Doctor } from '@/types/admin';
import { toast } from 'react-hot-toast';

const DoctorsList = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    try {
      const data = await adminService.getDoctors();
      setDoctors(data);
    } catch (error) {
      toast.error('Failed to fetch doctors');
    } finally {
      setLoading(false);
    }
  };

  const filteredDoctors = doctors.filter(doctor => 
    doctor.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    doctor.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleVerify = async (doctorId: string, status: 'APPROVED' | 'REJECTED') => {
    try {
      await adminService.verifyDoctor(doctorId, status);
      toast.success(`Doctor ${status.toLowerCase()} successfully`);
      fetchDoctors(); // Refresh list
    } catch (error) {
      toast.error(`Failed to ${status.toLowerCase()} doctor`);
    }
  };

  const getStatusBadge = (status: string) => {
    const colors = {
      PENDING: 'bg-yellow-100 text-yellow-800',
      APPROVED: 'bg-green-100 text-green-800',
      REJECTED: 'bg-red-100 text-red-800'
    };

    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${colors[status]}`}>
        {status}
      </span>
    );
  };

  if (loading) {
    return (
      <PageWrapper>
        <div className="min-h-screen flex justify-center items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600"></div>
        </div>
      </PageWrapper>
    );
  }
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
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Status
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                  Actions
                </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
              {filteredDoctors.map((doctor) => (
                <tr key={doctor.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{doctor.fullName}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-600">{doctor.user.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-600">{doctor.strNumber}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-600">{doctor.sipNumber}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-600">{doctor.layananKesehatan?.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(doctor.verificationStatus)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center justify-end gap-2">
                      {doctor.verificationStatus === 'PENDING' && (
                        <>
                          <button
                            onClick={() => handleVerify(doctor.id, 'APPROVED')}
                            className="p-1.5 rounded-lg hover:bg-green-50 text-green-600 hover:text-green-900 transition-colors"
                            title="Approve"
                          >
                            <FiCheck className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleVerify(doctor.id, 'REJECTED')}
                            className="p-1.5 rounded-lg hover:bg-red-50 text-red-600 hover:text-red-900 transition-colors"
                            title="Reject"
                          >
                            <FiX className="h-4 w-4" />
                          </button>
                        </>
                      )}
                      <Link
                        href={`/admin/doctors/edit/${doctor.id}`}
                        className="p-1.5 rounded-lg hover:bg-indigo-50 text-indigo-600 hover:text-indigo-900 transition-colors"
                        title="Edit"
                      >
                        <FiEdit2 className="h-4 w-4" />
                      </Link>
                      <button
                        className="p-1.5 rounded-lg hover:bg-red-50 text-red-600 hover:text-red-900 transition-colors"
                        title="Delete"
                      >
                        <FiTrash2 className="h-4 w-4" />
                      </button>
                    </div>
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