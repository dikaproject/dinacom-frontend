/* eslint-disable @typescript-eslint/no-explicit-any */
// pages/admin/analytics/page.tsx
"use client"
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Line, Bar } from 'react-chartjs-2';
import { adminService } from '@/services/admin';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { FiDownload} from 'react-icons/fi';
import PageWrapper from '@/components/PageWrapper';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface AnalyticsOverview {
  totalUsers: number;
  totalDoctors: number;
  totalRevenue: number;
  totalProductsSold: number;
}

interface AnalyticsData {
  overview?: AnalyticsOverview;
  doctorsGrowth?: Array<{ createdAt: string; _count: { id: number } }>;
  userAcquisition?: Array<{ createdAt: string; _count: { id: number } }>;
  revenueAnalytics?: Array<{ createdAt: string; revenue: number; subtotal: number }>;
  productSales?: Array<{
    productName: string;
    totalQuantity: number;
    totalRevenue: number;
  }>;
}

const Analytics = () => {
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'quarter' | 'year'>('month');
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      setLoading(true);
      try {
        const data = await adminService.getAnalytics(timeRange);
        setAnalyticsData(data);
      } catch (error) {
        console.error('Failed to fetch analytics:', error);
      }
      setLoading(false);
    };

    fetchAnalytics();
  }, [timeRange]);

  const formatChartData = (data: any[], dateKey: string, valueKey: string, label?: string) => {
    if (!data || data.length === 0) return {
      labels: [],
      datasets: [{
        label: label || 'No Data',
        data: [],
        borderColor: 'rgb(99, 102, 241)',
        backgroundColor: 'rgba(99, 102, 241, 0.5)',
      }]
    };

    // Sort data by date
    const sortedData = [...data].sort((a, b) => 
      new Date(a[dateKey]).getTime() - new Date(b[dateKey]).getTime()
    );

    const groupedData = sortedData.reduce((acc: any, item: any) => {
      const date = new Date(item[dateKey]).toLocaleDateString();
      const value = valueKey.includes('.') 
        ? item[valueKey.split('.')[0]][valueKey.split('.')[1]] 
        : item[valueKey];
      acc[date] = (acc[date] || 0) + Number(value);
      return acc;
    }, {});

    return {
      labels: Object.keys(groupedData),
      datasets: [{
        label: label || 'Current Period',
        data: Object.values(groupedData),
        borderColor: 'rgb(99, 102, 241)',
        backgroundColor: 'rgba(99, 102, 241, 0.5)',
      }]
    };
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
      },
      tooltip: {
        mode: 'index' as const,
        intersect: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  const formatCurrency = (value: number) => 
    `Rp ${value.toLocaleString('id-ID')}`;

  // Add this new function for product sales chart options
  const getProductSalesChartOptions = () => ({
    ...chartOptions,
    scales: {
      y: {
        type: 'linear',
        display: true,
        position: 'left',
        title: {
          display: true,
          text: 'Quantity'
        }
      },
      y1: {
        type: 'linear',
        display: true,
        position: 'right',
        title: {
          display: true,
          text: 'Revenue'
        },
        grid: {
          drawOnChartArea: false
        }
      }
    },
    plugins: {
      ...chartOptions.plugins,
      tooltip: {
        callbacks: {
          label: function(context: any) {
            const value = context.raw;
            return context.dataset.label === 'Revenue'
              ? `Revenue: ${formatCurrency(value)}`
              : `Quantity: ${value} units`;
          }
        }
      }
    }
  });

  return (
    <PageWrapper>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>
                <p className="mt-2 text-gray-600">Track your business performance</p>
              </div>
              <div className="flex items-center space-x-4">
                <select
                  value={timeRange}
                  onChange={(e) => setTimeRange(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                >
                  <option value="week">Last Week</option>
                  <option value="month">Last Month</option>
                  <option value="quarter">Last Quarter</option>
                  <option value="year">Last Year</option>
                </select>
                <button className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">
                  <FiDownload className="mr-2" />
                  Download Report
                </button>
              </div>
            </div>
          </div>

          {/* Overview Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {analyticsData?.overview && (
              <>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white p-6 rounded-xl shadow-sm"
                >
                  <h3 className="text-gray-500 text-sm">Total Users</h3>
                  <p className="text-2xl font-semibold">{analyticsData.overview.totalUsers}</p>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="bg-white p-6 rounded-xl shadow-sm"
                >
                  <h3 className="text-gray-500 text-sm">Total Doctors</h3>
                  <p className="text-2xl font-semibold">{analyticsData.overview.totalDoctors}</p>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="bg-white p-6 rounded-xl shadow-sm"
                >
                  <h3 className="text-gray-500 text-sm">Total Revenue</h3>
                  <p className="text-2xl font-semibold">{formatCurrency(analyticsData.overview.totalRevenue)}</p>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="bg-white p-6 rounded-xl shadow-sm"
                >
                  <h3 className="text-gray-500 text-sm">Products Sold</h3>
                  <p className="text-2xl font-semibold">{analyticsData.overview.totalProductsSold}</p>
                </motion.div>
              </>
            )}
          </div>

          {/* Charts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Doctors Growth */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white p-6 rounded-xl shadow-md"
            >
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Doctors Growth</h2>
                <p className="text-gray-600">Monthly registration trends</p>
              </div>
              <div className="h-80">
                {loading ? (
                  <div>Loading...</div>
                ) : (
                  <Line 
                    options={chartOptions} 
                    data={formatChartData(analyticsData?.doctorsGrowth || [], 'createdAt', '_count.id')} 
                  />
                )}
              </div>
            </motion.div>

            {/* User Acquisition */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white p-6 rounded-xl shadow-md"
            >
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-gray-900">User Acquisition</h2>
                <p className="text-gray-600">New user registrations</p>
              </div>
              <div className="h-80">
                {loading ? (
                  <div>Loading...</div>
                ) : (
                  <Bar 
                    options={chartOptions} 
                    data={formatChartData(analyticsData?.userAcquisition || [], 'createdAt', '_count.id', 'New Users')} 
                  />
                )}
              </div>
            </motion.div>

            {/* Revenue Analysis */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white p-6 rounded-xl shadow-md"
            >
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Revenue Analysis</h2>
                <p className="text-gray-600">Monthly revenue breakdown</p>
              </div>
              <div className="h-80">
                {loading ? (
                  <div>Loading...</div>
                ) : (
                  <Line
                    options={{
                      ...chartOptions,
                      plugins: {
                        ...chartOptions.plugins,
                        tooltip: {
                          callbacks: {
                            label: function(context: any) {
                              const label = context.dataset.label || '';
                              const value = context.parsed.y;
                              return `${label}: ${formatCurrency(value)}`;
                            }
                          }
                        }
                      }
                    }}
                    data={{
                      labels: analyticsData?.revenueAnalytics?.map((item: any) => 
                        new Date(item.createdAt).toLocaleDateString()
                      ) || [],
                      datasets: [
                        {
                          label: 'Total Revenue',
                          data: analyticsData?.revenueAnalytics?.map((item: any) => item.revenue) || [],
                          borderColor: 'rgb(99, 102, 241)',
                          backgroundColor: 'rgba(99, 102, 241, 0.5)',
                        },
                        {
                          label: 'Net Revenue',
                          data: analyticsData?.revenueAnalytics?.map((item: any) => item.subtotal) || [],
                          borderColor: 'rgb(34, 197, 94)',
                          backgroundColor: 'rgba(34, 197, 94, 0.5)',
                        }
                      ]
                    }}
                  />
                )}
              </div>
            </motion.div>

            {/* Replace the Product Sales chart section with this updated version */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white p-6 rounded-xl shadow-md"
            >
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Product Sales</h2>
                <p className="text-gray-600">Top selling products</p>
              </div>
              <div className="h-80">
                {loading ? (
                  <div>Loading...</div>
                ) : (
                  <Bar
                    options={getProductSalesChartOptions()}
                    data={{
                      labels: analyticsData?.productSales?.map((item: any) => 
                        item.productName.length > 15 
                          ? item.productName.substring(0, 15) + '...' 
                          : item.productName
                      ) || [],
                      datasets: [
                        {
                          label: 'Quantity',
                          data: analyticsData?.productSales?.map((item: any) => item.totalQuantity) || [],
                          backgroundColor: 'rgba(99, 102, 241, 0.5)',
                          borderColor: 'rgb(99, 102, 241)',
                          yAxisID: 'y'
                        },
                        {
                          label: 'Revenue',
                          data: analyticsData?.productSales?.map((item: any) => item.totalRevenue) || [],
                          backgroundColor: 'rgba(34, 197, 94, 0.5)',
                          borderColor: 'rgb(34, 197, 94)',
                          yAxisID: 'y1'
                        }
                      ]
                    }}
                  />
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
};

export default Analytics;