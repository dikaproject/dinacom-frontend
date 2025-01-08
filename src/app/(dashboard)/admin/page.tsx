// pages/admin/dashboard/page.tsx
"use client"
import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  FiUsers, FiDollarSign, FiShoppingBag, FiUserPlus,
  FiArrowUp, FiArrowDown, FiCalendar, FiSearch
} from 'react-icons/fi';
import PageWrapper from '@/components/PageWrapper';

const AdminDashboard = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState('date');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  const statsCards = [
    {
      title: 'Total Doctors',
      value: '24',
      change: '+12%',
      isPositive: true,
      icon: <FiUsers className="w-6 h-6" />,
      color: 'bg-blue-500'
    },
    {
      title: 'Total Users',
      value: '1,234',
      change: '+25%',
      isPositive: true,
      icon: <FiUserPlus className="w-6 h-6" />,
      color: 'bg-purple-500'
    },
    {
      title: 'Total Revenue',
      value: 'Rp 45.6M',
      change: '+18%',
      isPositive: true,
      icon: <FiDollarSign className="w-6 h-6" />,
      color: 'bg-green-500'
    },
    {
      title: 'Total Products',
      value: '156',
      change: '-3%',
      isPositive: false,
      icon: <FiShoppingBag className="w-6 h-6" />,
      color: 'bg-orange-500'
    }
  ];

  return (
    <PageWrapper>
      <main className="min-h-screen bg-gray-50 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-gray-600">Welcome back, Admin</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {statsCards.map((card, index) => (
              <motion.div
                key={index}
                whileHover={{ y: -4 }}
                className="bg-white rounded-lg shadow p-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-lg ${card.color}`}>
                    <div className="text-white">{card.icon}</div>
                  </div>
                  <div className={`text-sm font-medium ${
                    card.isPositive ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {card.change}
                  </div>
                </div>
                <h3 className="text-gray-600 text-sm">{card.title}</h3>
                <p className="text-2xl font-bold text-gray-900">{card.value}</p>
              </motion.div>
            ))}
          </div>

          {/* Recent Orders */}
          <div className="bg-white rounded-lg shadow mb-8">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">Recent Orders</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    {['Order ID', 'Customer', 'Product', 'Status', 'Amount', 'Date'].map((header) => (
                      <th
                        key={header}
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:text-gray-700"
                        onClick={() => {
                          setSortField(header.toLowerCase());
                          setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
                        }}
                      >
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {/* Sample order data */}
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">#12345</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">John Doe</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Prenatal Vitamins</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        Completed
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Rp 299.000</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">2024-03-15</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="px-6 py-4 border-t border-gray-200">
              {/* Pagination */}
              <div className="flex items-center justify-between">
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Previous
                </button>
                <span className="text-sm text-gray-700">Page {currentPage}</span>
                <button
                  onClick={() => setCurrentPage(currentPage + 1)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Next
                </button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Doctor Schedule */}
            <div className="bg-white rounded-lg shadow">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-lg font-medium text-gray-900">Doctor Schedule</h2>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {/* Sample schedule */}
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0">
                        <img
                          className="h-10 w-10 rounded-full"
                          src="/images/doctor-avatar.jpg"
                          alt="Doctor"
                        />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">Dr. Sarah Johnson</p>
                        <p className="text-sm text-gray-500">09:00 AM - Consultation</p>
                      </div>
                    </div>
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                      Upcoming
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Users */}
            <div className="bg-white rounded-lg shadow">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-lg font-medium text-gray-900">Recent Users</h2>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {/* Sample user */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0">
                        <img
                          className="h-10 w-10 rounded-full"
                          src="/images/user-avatar.jpg"
                          alt="User"
                        />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">Jane Smith</p>
                        <p className="text-sm text-gray-500">Joined March 15, 2024</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        Active
                      </span>
                      <button className="p-1 rounded-full hover:bg-gray-100">
                        <FiSearch className="w-4 h-4 text-gray-400" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </PageWrapper>
  );
};

export default AdminDashboard;  