// pages/admin/dashboard/page.tsx
"use client"
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  FiUsers, FiDollarSign, FiShoppingBag, FiUserPlus, FiSearch
} from 'react-icons/fi';
import PageWrapper from '@/components/PageWrapper';
import { adminService } from '@/services/admin';


const AdminDashboard = () => {
  const [stats, setStats] = useState<{
    totalDoctors: number;
    totalUsers: number;
    totalRevenue: number;
    totalProducts: number;
    doctorsGrowth: number;
    usersGrowth: number;
    revenueGrowth: number;
    productsGrowth: number;
  } | null>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [schedules, setSchedules] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState('date');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [statsData, ordersData, usersData, schedulesData] = await Promise.all([
          adminService.getDashboardStats(),
          adminService.getRecentOrders(currentPage),
          adminService.getRecentUsers(),
          adminService.getDoctorSchedules()
        ]);

        setStats(statsData);
        setOrders(ordersData);
        setUsers(usersData);
        setSchedules(schedulesData);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      }
    };

    fetchDashboardData();
  }, [currentPage]);

  // Helper function for formatting currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID').format(amount);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PAID':
        return 'bg-green-100 text-green-800';
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800';
      case 'EXPIRED':
        return 'bg-red-100 text-red-800';
      case 'FAILED':
        return 'bg-red-100 text-red-800';
      case 'CANCELLED':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getAvatarUrl = (avatar: string | null) => {
    if (!avatar) return '/default-avatar.jpg';
    return `${process.env.NEXT_PUBLIC_API_URL}/uploads/profiles/${avatar}`;
  };

  const statsCards = [
    {
      title: 'Total Doctors',
      value: stats?.totalDoctors ?? '0',
      change: stats?.doctorsGrowth ? `${stats.doctorsGrowth.toFixed(1)}%` : '0%',
      isPositive: (stats?.doctorsGrowth ?? 0) > 0,
      icon: <FiUsers className="w-6 h-6" />,
      color: 'bg-blue-500'
    },
    {
      title: 'Total Users',
      value: stats?.totalUsers ?? '0',
      change: stats?.usersGrowth ? `${stats.usersGrowth.toFixed(1)}%` : '0%',
      isPositive: (stats?.usersGrowth ?? 0) > 0,
      icon: <FiUserPlus className="w-6 h-6" />,
      color: 'bg-purple-500'
    },
    {
      title: 'Total Revenue',
      value: `Rp ${formatCurrency(stats?.totalRevenue ?? 0)}`,
      change: stats?.revenueGrowth ? `${stats.revenueGrowth.toFixed(1)}%` : '0%',
      isPositive: (stats?.revenueGrowth ?? 0) > 0,
      icon: <FiDollarSign className="w-6 h-6" />,
      color: 'bg-green-500'
    },
    {
      title: 'Total Products',
      value: stats?.totalProducts ?? '0',
      change: stats?.productsGrowth ? `${stats.productsGrowth.toFixed(1)}%` : '0%',
      isPositive: (stats?.productsGrowth ?? 0) > 0,
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
                  {orders.map((order) => (
                    <tr key={order.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{order.id}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{order.customer}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{order.product}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(order.status)}`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        Rp {formatCurrency(order.amount)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{order.date}</td>
                    </tr>
                  ))}
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

          {/* Recent Users */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">Recent Users</h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {users.map((user) => (
                  <div key={user.id} className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0">
                      <img
                      className="h-10 w-10 rounded-full object-cover"
                      src={getAvatarUrl(user.avatar)}
                      alt={user.name}
                      onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
                        e.currentTarget.src = '/default-avatar.jpg';
                      }}
                    />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{user.name}</p>
                        <p className="text-sm text-gray-500">
                          Joined {new Date(user.joinDate).toLocaleDateString('id-ID')}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        {user.status}
                      </span>
                      <button className="p-1 rounded-full hover:bg-gray-100">
                        <FiSearch className="w-4 h-4 text-gray-400" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </PageWrapper>
  );
};

export default AdminDashboard;