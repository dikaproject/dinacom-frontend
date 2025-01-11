"use client";

import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ChartData
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface ActivityData {
  date: string;
  total: number;
  completed: number;
  pending: number;
}

interface ActivityChartProps {
  data: ActivityData[];
}

export const ActivityChart = ({ data }: ActivityChartProps) => {
  const chartData: ChartData<'line'> = {
    labels: data.map(d => new Date(d.date).toLocaleDateString('en-US', { weekday: 'short' })),
    datasets: [
      {
        label: 'Total Consultations',
        data: data.map(d => d.total),
        borderColor: 'rgb(99, 102, 241)',
        backgroundColor: 'rgba(99, 102, 241, 0.5)',
        tension: 0.4
      },
      {
        label: 'Completed',
        data: data.map(d => d.completed),
        borderColor: 'rgb(34, 197, 94)',
        backgroundColor: 'rgba(34, 197, 94, 0.5)',
        tension: 0.4
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1
        }
      }
    }
  };

  return (
    <div className="h-full w-full">
      <Line data={chartData} options={options} />
    </div>
  );
};