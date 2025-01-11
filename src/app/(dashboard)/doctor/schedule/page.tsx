"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FiEdit2, FiPlus } from "react-icons/fi";
import { toast } from "react-hot-toast";
import { doctorService } from "@/services/doctor";
import DashboardSkeleton from "@/components/loading/DashboardSkeleton";

interface Schedule {
  id: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  isAvailable: boolean;
}

interface ScheduleModal {
  isOpen: boolean;
  type: "add" | "edit";
  data?: Schedule;
}

const days = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

export default function DoctorSchedule() {
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [modal, setModal] = useState<ScheduleModal>({
    isOpen: false,
    type: "add",
  });
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    dayOfWeek: 0,
    startTime: "",
    endTime: "",
  });

  useEffect(() => {
    fetchSchedules();
  }, []);

  const fetchSchedules = async () => {
    try {
      const data = await doctorService.getProfile();
      setSchedules(data.schedules);
    } catch (error) {
      console.error("Failed to fetch schedules:", error);
      toast.error("Failed to fetch schedules");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await doctorService.updateSchedule({
        dayOfWeek: formData.dayOfWeek,
        startTime: formData.startTime,
        endTime: formData.endTime,
      });
      toast.success("Schedule updated successfully");
      setModal({ isOpen: false, type: "add" });
      fetchSchedules();
    } catch (error) {
      console.error("Failed to update schedule:", error);
      toast.error("Failed to update schedule");
    }
  };

  if (loading) return <DashboardSkeleton />;

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-purple-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-xl shadow-sm border border-purple-100 p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Schedule Management</h1>
            <button
              onClick={() => setModal({ isOpen: true, type: "add" })}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center gap-2"
            >
              <FiPlus /> Add Schedule
            </button>
          </div>

          {/* Schedule Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Day
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Start Time
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    End Time
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {days.map((day, index) => {
                  const schedule = schedules.find((s) => s.dayOfWeek === index);
                  return (
                    <tr key={day}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {day}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {schedule?.startTime || "-"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {schedule?.endTime || "-"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            schedule?.isAvailable
                              ? "bg-green-100 text-green-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {schedule?.isAvailable ? "Available" : "Not Set"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() =>
                            setModal({
                              isOpen: true,
                              type: "edit",
                              data: schedule,
                            })
                          }
                          className="text-purple-600 hover:text-purple-900 mr-4"
                        >
                          <FiEdit2 className="w-5 h-5" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Schedule Modal */}
      {modal.isOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="bg-white rounded-2xl w-full max-w-md shadow-xl overflow-hidden"
          >
            {/* Modal Header */}
            <div className="bg-purple-50 px-6 py-4 border-b border-purple-100">
              <h2 className="text-xl font-semibold text-purple-900">
                {modal.type === "add" ? "Add New Schedule" : "Edit Schedule"}
              </h2>
              <p className="text-sm text-purple-600 mt-1">
                Set your availability for patient appointments
              </p>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSubmit} className="p-6">
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Day of Week
                  </label>
                  <select
                    value={formData.dayOfWeek}
                    onChange={(e) =>
                      setFormData({ ...formData, dayOfWeek: parseInt(e.target.value) })
                    }
                    className="w-full text-gray-600 rounded-lg border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 transition-colors"
                  >
                    {days.map((day, index) => (
                      <option key={day} value={index}>
                        {day}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Start Time
                    </label>
                    <input
                      type="time"
                      value={formData.startTime}
                      onChange={(e) =>
                        setFormData({ ...formData, startTime: e.target.value })
                      }
                      className="w-full text-gray-700 rounded-lg border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      End Time
                    </label>
                    <input
                      type="time"
                      value={formData.endTime}
                      onChange={(e) =>
                        setFormData({ ...formData, endTime: e.target.value })
                      }
                      className="w-full rounded-lg border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 transition-colors"
                    />
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="mt-8 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setModal({ isOpen: false, type: "add" })}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}