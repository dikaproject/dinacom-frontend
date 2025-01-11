"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  FiEdit2,
  FiClock,
  FiDollarSign,
  FiUsers,
  FiCalendar,
  FiMessageCircle,
  FiActivity,
} from "react-icons/fi";
import { doctorService } from "@/services/doctor";
import { DoctorProfile, DoctorStatistics } from "@/types/doctor";
import { toast } from "react-hot-toast";
import { ActivityChart } from "@/components/ActivityChart";

const days = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

export default function DoctorDashboard() {
  const [profile, setProfile] = useState<DoctorProfile | null>(null);
  const [stats, setStats] = useState<DoctorStatistics | null>(null);
  const [editingFee, setEditingFee] = useState(false);
  const [newFee, setNewFee] = useState<number>(0);
  const [editingSchedule, setEditingSchedule] = useState<
    Record<number, boolean>
  >({});
  const [scheduleInputs, setScheduleInputs] = useState<
    Record<number, { startTime: string; endTime: string }>
  >({});

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [profileData, statsData] = await Promise.all([
        doctorService.getProfile(),
        doctorService.getStatistics(),
      ]);
      setProfile(profileData);
      setStats({
        todayAppointments: statsData.todayAppointments,
        activePatients: statsData.activePatients,
        pendingConsultations: statsData.pendingConsultations,
        monthlyEarnings: statsData.monthlyEarnings,
        activityData: statsData.activityData || [] 
      });
      setNewFee(profileData.consultationFee);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load dashboard data");
    }
  };

  const handleUpdateFee = async () => {
    try {
      await doctorService.updateConsultationFee(newFee);
      toast.success("Consultation fee updated successfully");
      fetchData();
      setEditingFee(false);
    } catch (err) {
      console.error(err);
      toast.error("Failed to update consultation fee");
    }
  };

  const handleUpdateSchedule = async (dayIndex: number) => {
    try {
      const inputs = scheduleInputs[dayIndex];
      if (!inputs?.startTime || !inputs?.endTime) {
        toast.error("Please set both start and end time");
        return;
      }

      await doctorService.updateOrCreateSchedule({
        dayOfWeek: dayIndex,
        startTime: inputs.startTime,
        endTime: inputs.endTime,
      });

      toast.success("Schedule updated successfully");
      fetchData();
      setEditingSchedule((prev) => ({ ...prev, [dayIndex]: false }));
    } catch (err) {
      console.error(err);
      toast.error("Failed to update schedule");
    }
  };

  const getActivityData = () => {
    if (!stats?.activityData) return [];
    
    return stats.activityData.map(item => ({
      date: item.date,
      total: item.total,
      completed: item.completed,
      pending: item.pending
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-purple-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Overview Section */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">
            Welcome back,{" "}
            {profile?.fullName ? `Dr. ${profile.fullName}` : "Doctor"}
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <motion.div
              whileHover={{ y: -4 }}
              className="bg-white p-6 rounded-xl shadow-sm border border-purple-100"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">
                    Today&apos;s Appointments
                  </p>
                  <p className="text-2xl font-semibold text-gray-900">
                    {stats?.todayAppointments || 0}
                  </p>
                </div>
                <div className="p-3 bg-purple-100 rounded-lg">
                  <FiCalendar className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </motion.div>

            <motion.div
              whileHover={{ y: -4 }}
              className="bg-white p-6 rounded-xl shadow-sm border border-purple-100"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Active Patients</p>
                  <p className="text-2xl font-semibold text-gray-900">
                    {stats?.activePatients || 0}
                  </p>
                </div>
                <div className="p-3 bg-blue-100 rounded-lg">
                  <FiUsers className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </motion.div>

            <motion.div
              whileHover={{ y: -4 }}
              className="bg-white p-6 rounded-xl shadow-sm border border-purple-100"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Pending Consultations</p>
                  <p className="text-2xl font-semibold text-gray-900">
                    {stats?.pendingConsultations || 0}
                  </p>
                </div>
                <div className="p-3 bg-green-100 rounded-lg">
                  <FiMessageCircle className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </motion.div>

            <motion.div
              whileHover={{ y: -4 }}
              className="bg-white p-6 rounded-xl shadow-sm border border-purple-100"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Monthly Earnings</p>
                  <p className="text-2xl font-semibold text-gray-900">
                    Rp {stats?.monthlyEarnings?.toLocaleString() || "0"}
                  </p>
                </div>
                <div className="p-3 bg-yellow-100 rounded-lg">
                  <FiDollarSign className="w-6 h-6 text-yellow-600" />
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Consultation Fee & Activity Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <motion.div
            whileHover={{ y: -2 }}
            className="bg-white rounded-xl shadow-sm border border-purple-100 p-6"
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold flex items-center text-gray-900">
                <FiDollarSign className="mr-2 text-purple-600" /> Consultation
                Fee
              </h2>
              <button
                onClick={() => setEditingFee(!editingFee)}
                className="p-2 hover:bg-purple-50 rounded-lg text-purple-600"
              >
                <FiEdit2 />
              </button>
            </div>

            {editingFee ? (
              <div className="flex items-center gap-4">
                <input
                  type="number"
                  value={newFee}
                  onChange={(e) => setNewFee(Number(e.target.value))}
                  className="px-4 py-2 border rounded-lg w-48 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
                <button
                  onClick={handleUpdateFee}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                >
                  Save
                </button>
              </div>
            ) : (
              <p className="text-2xl font-semibold text-gray-900">
                Rp {profile?.consultationFee?.toLocaleString() || "0"}
              </p>
            )}
          </motion.div>

          <motion.div
    whileHover={{ y: -2 }}
    className="bg-white rounded-xl shadow-sm border border-purple-100 p-6"
  >
    <h2 className="text-lg font-semibold flex items-center text-gray-900 mb-4">
      <FiActivity className="mr-2 text-purple-600" /> Activity Overview
    </h2>
    <div className="h-64">
      <ActivityChart data={getActivityData()} />
    </div>
  </motion.div>
        </div>

        {/* Schedule Management */}
        <motion.div
          whileHover={{ y: -2 }}
          className="bg-white rounded-xl shadow-sm border border-purple-100 p-6"
        >
          <h2 className="text-lg font-semibold flex items-center text-gray-900 mb-6">
            <FiClock className="mr-2 text-purple-600" /> Weekly Schedule
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {days.map((day, index) => (
              <div key={day} className="bg-gray-50 rounded-lg p-4">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="font-medium text-gray-900">{day}</h3>
                  <button
                    onClick={() =>
                      setEditingSchedule((prev) => ({
                        ...prev,
                        [index]: !prev[index],
                      }))
                    }
                    className="p-1.5 hover:bg-purple-50 rounded-lg text-purple-600"
                  >
                    <FiEdit2 size={16} />
                  </button>
                </div>

                {editingSchedule[index] ? (
                  <div className="space-y-2">
                    <input
                      type="time"
                      value={
                        scheduleInputs[index]?.startTime ||
                        profile?.schedules?.find((s) => s.dayOfWeek === index)
                          ?.startTime ||
                        ""
                      }
                      onChange={(e) =>
                        setScheduleInputs((prev) => ({
                          ...prev,
                          [index]: {
                            ...prev[index],
                            startTime: e.target.value,
                          },
                        }))
                      }
                      className="w-full px-3 py-1.5 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                    <input
                      type="time"
                      value={
                        scheduleInputs[index]?.endTime ||
                        profile?.schedules?.find((s) => s.dayOfWeek === index)
                          ?.endTime ||
                        ""
                      }
                      onChange={(e) =>
                        setScheduleInputs((prev) => ({
                          ...prev,
                          [index]: { ...prev[index], endTime: e.target.value },
                        }))
                      }
                      className="w-full px-3 py-1.5 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                    <button
                      onClick={() => handleUpdateSchedule(index)}
                      className="w-full py-1.5 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                    >
                      Save
                    </button>
                  </div>
                ) : (
                  <p className="text-gray-600 text-sm">
                    {profile?.schedules?.find((s) => s.dayOfWeek === index)
                      ?.startTime || "Not set"}{" "}
                    -{" "}
                    {profile?.schedules?.find((s) => s.dayOfWeek === index)
                      ?.endTime || "Not set"}
                  </p>
                )}
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
