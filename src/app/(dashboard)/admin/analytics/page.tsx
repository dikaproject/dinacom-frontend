// pages/admin/analytics/page.tsx
"use client"
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Line, Bar } from 'react-chartjs-2';
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

const Analytics = () => {
  const [timeRange, setTimeRange] = useState('month');

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

  const mockData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Current Period',
        data: [65, 78, 90, 85, 95, 110],
        borderColor: 'rgb(99, 102, 241)',
        backgroundColor: 'rgba(99, 102, 241, 0.5)',
      },
      {
        label: 'Previous Period',
        data: [55, 65, 75, 70, 80, 95],
        borderColor: 'rgb(156, 163, 175)',
        backgroundColor: 'rgba(156, 163, 175, 0.5)',
      },
    ],
  };

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
                <Line options={chartOptions} data={mockData} />
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
                <Bar options={chartOptions} data={mockData} />
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
                <Line
                  options={{
                    ...chartOptions,
                    plugins: {
                      ...chartOptions.plugins,
                      tooltip: {
                        ...chartOptions.plugins.tooltip,
                        callbacks: {
                          label: (context: { parsed: { y: number } }) => `Rp ${context.parsed.y.toLocaleString()}`,
                        },
                      },
                    },
                  }}
                  data={{
                    ...mockData,
                    datasets: mockData.datasets.map(dataset => ({
                      ...dataset,
                      data: dataset.data.map(value => value * 1000000),
                    })),
                  }}
                />
              </div>
            </motion.div>

            {/* Product Sales */}
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
                <Bar
                  options={chartOptions}
                  data={{
                    ...mockData,
                    labels: ['Product A', 'Product B', 'Product C', 'Product D', 'Product E', 'Product F'],
                  }}
                />
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
};

export default Analytics;