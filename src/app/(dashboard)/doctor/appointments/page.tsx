"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { toast } from "react-hot-toast";
import { FiCalendar, FiClock, FiUser } from "react-icons/fi";
import { format } from "date-fns";
import { doctorService } from "@/services/doctor";

interface Appointment {
  id: string;
  schedule: string;
  status: string;
  type: string;
  user: {
    profile: {
      fullName: string;
      pregnancyWeek: number;
    };
  };
}

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ALL');

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const data = await doctorService.getDoctorAppointments();
      setAppointments(data);
    } catch (error) {
      console.error('Failed to fetch appointments:', error);
      toast.error('Failed to load appointments');
    } finally {
      setLoading(false);
    }
  };

  const filteredAppointments = appointments.filter(apt => {
    if (filter === 'ALL') return true;
    return apt.status === filter;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'CONFIRMED': return 'bg-green-100 text-green-800';
      case 'PENDING': return 'bg-yellow-100 text-yellow-800';
      case 'CANCELLED': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-purple-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Today&apos;s Appointments</h1>
          <div className="flex gap-2">
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="ALL">All Appointments</option>
              <option value="CONFIRMED">Confirmed</option>
              <option value="PENDING">Pending</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600"></div>
          </div>
        ) : filteredAppointments.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-purple-100 p-8 text-center">
            <p className="text-gray-500">No appointments found</p>
          </div>
        ) : (
          <div className="grid gap-6">
            {filteredAppointments.map((appointment) => (
              <motion.div
                key={appointment.id}
                whileHover={{ y: -2 }}
                className="bg-white rounded-xl shadow-sm border border-purple-100 p-6"
              >
                <div className="flex justify-between items-start">
                  <div className="flex items-start space-x-4">
                    <div className="p-3 bg-purple-100 rounded-lg">
                      <FiUser className="w-6 h-6 text-purple-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {appointment.user.profile.fullName}
                      </h3>
                      <p className="text-sm text-gray-500">
                        Pregnancy Week: {appointment.user.profile.pregnancyWeek}
                      </p>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(appointment.status)}`}>
                    {appointment.status}
                  </span>
                </div>

                <div className="mt-4 flex items-center space-x-6">
                  <div className="flex items-center text-sm text-gray-500">
                    <FiCalendar className="w-4 h-4 mr-2" />
                    {format(new Date(appointment.schedule), 'MMMM d, yyyy')}
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <FiClock className="w-4 h-4 mr-2" />
                    {format(new Date(appointment.schedule), 'HH:mm')}
                  </div>
                  <div className="text-sm text-gray-500">
                    Type: {appointment.type}
                  </div>
                </div>

                {appointment.status === 'CONFIRMED' && (
                  <div className="mt-4 flex justify-end">
                    <button
                      onClick={() => {
                        window.location.href = `/doctor/consultations/${appointment.id}/chat`;
                      }}
                      className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                    >
                      Start Consultation
                    </button>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}