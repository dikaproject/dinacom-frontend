"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { pregnancyService } from "@/services/pregnancy";
import { 
  Plus, X, Activity, Clock, Heart,
  ChevronDown
} from "lucide-react";
import DashboardSkeleton from "@/components/loading/DashboardSkeleton";
import type { ExerciseLog } from "@/types/pregnancy";

const ACTIVITY_TYPES = [
    "Walking",
    "Swimming",
    "Yoga",
    "Stretching",
    "Light Cardio",
    "Pelvic Floor Exercise",
    "Other"
  ];

const INTENSITY_LEVELS = ["Low", "Moderate"];

export default function ExercisePage() {
    const [loading, setLoading] = useState(false);
    const [logs, setLogs] = useState<ExerciseLog[]>([]); // Add type
    const [showAddModal, setShowAddModal] = useState(false);
    const [error, setError] = useState("");
    const [formData, setFormData] = useState({
        activityType: ACTIVITY_TYPES[0],
        customActivity: "", // Add this
        duration: "",
        intensity: INTENSITY_LEVELS[0],
        heartRate: "",
        notes: ""
      });

  const fetchExerciseLogs = async () => {
    setLoading(true);
    try {
      const data = await pregnancyService.getExerciseLogs();
      setLogs(data);
    } catch (error) {
      console.error('Failed to fetch exercise logs:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExerciseLogs();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setError("");
  try {
    const exerciseData = {
      ...formData,
      // If Other is selected, use customActivity as activityType
      activityType: formData.activityType === "Other" 
        ? formData.customActivity 
        : formData.activityType,
      duration: parseInt(formData.duration),
      heartRate: formData.heartRate ? parseInt(formData.heartRate) : undefined,
      // Remove customActivity from final data if not Other
      ...(formData.activityType !== "Other" && { customActivity: undefined })
    };

    await pregnancyService.createExerciseLog(exerciseData);
    setShowAddModal(false);
    fetchExerciseLogs();
  } catch (error) {
    setError(error instanceof Error ? error.message : 'Failed to save exercise');
  }
};

  if (loading) {
    return <DashboardSkeleton />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-purple-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Exercise Log</h1>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowAddModal(true)}
            className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg"
          >
            <Plus className="w-5 h-5 mr-2" />
            Add Exercise
          </motion.button>
        </div>

        {/* Weekly Summary */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">Weekly Summary</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-purple-50 rounded-xl">
              <div className="flex items-center justify-between">
                <p className="text-sm text-purple-600">Total Minutes</p>
                <Clock className="w-5 h-5 text-purple-600" />
              </div>
              <p className="text-2xl font-bold text-purple-900 mt-1">
                {logs.reduce((sum, log) => sum + (log.duration || 0), 0)} min
              </p>
            </div>
            <div className="p-4 bg-purple-50 rounded-xl">
              <div className="flex items-center justify-between">
                <p className="text-sm text-purple-600">Activities</p>
                <Activity className="w-5 h-5 text-purple-600" />
              </div>
              <p className="text-2xl font-bold text-purple-900 mt-1">
                {logs.length}
              </p>
            </div>
            <div className="p-4 bg-purple-50 rounded-xl">
              <div className="flex items-center justify-between">
                <p className="text-sm text-purple-600">Avg Heart Rate</p>
                <Heart className="w-5 h-5 text-purple-600" />
              </div>
              <p className="text-2xl font-bold text-purple-900 mt-1">
                {Math.round(logs.reduce((sum, log) => sum + (log.heartRate || 0), 0) / logs.length || 0)} bpm
              </p>
            </div>
          </div>
        </div>

        {/* Exercise Logs */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">Recent Activities</h2>
          <div className="space-y-4">
            {logs.map((log) => (
              <motion.div
                key={log.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 border border-purple-100 rounded-xl hover:bg-purple-50 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="p-2 bg-purple-100 rounded-lg">
                      <Activity className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{log.activityType}</p>
                      <p className="text-sm text-gray-500">
                        {new Date(log.date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-900">
                      {log.duration} minutes
                    </p>
                    <p className="text-sm text-gray-500">
                      {log.intensity} Intensity
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Add Exercise Modal */}
      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl p-6 w-full max-w-lg mx-4"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg text-gray-700 font-semibold">Add Exercise</h3>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {error && (
                <div className="mb-4 p-4 bg-red-50 text-red-600 rounded-lg">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
              <div>
  <label className="block text-sm font-medium text-gray-700">
    Activity Type
  </label>
  <div className="space-y-2">
    <select
      value={formData.activityType}
      onChange={(e) => setFormData({ 
        ...formData, 
        activityType: e.target.value,
        customActivity: e.target.value === "Other" ? "" : formData.customActivity 
      })}
      className="w-full px-4 py-3 text-gray-700 rounded-lg border border-purple-100 focus:outline-none focus:ring-2 focus:ring-purple-400"
    >
      {ACTIVITY_TYPES.map(type => (
        <option key={type} value={type}>{type}</option>
      ))}
    </select>

    {formData.activityType === "Other" && (
      <input
        type="text"
        value={formData.customActivity}
        onChange={(e) => setFormData({ 
          ...formData, 
          customActivity: e.target.value 
        })}
        className="w-full px-4 py-3 rounded-lg border border-purple-100 focus:outline-none focus:ring-2 focus:ring-purple-400"
        placeholder="Enter your activity..."
        required
      />
    )}
  </div>
</div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Duration (minutes)
                    </label>
                    <input
                      type="number"
                      required
                      value={formData.duration}
                      onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                      className="mt-1 w-full px-4 py-3 rounded-lg border border-purple-100 focus:outline-none focus:ring-2 focus:ring-purple-400"
                      placeholder="e.g., 30"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Intensity
                    </label>
                    <select
                      value={formData.intensity}
                      onChange={(e) => setFormData({ ...formData, intensity: e.target.value })}
                      className="mt-1 w-full text-gray-700 px-4 py-3 rounded-lg border border-purple-100 focus:outline-none focus:ring-2 focus:ring-purple-400"
                    >
                      {INTENSITY_LEVELS.map(level => (
                        <option key={level} value={level}>{level}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Heart Rate (optional)
                  </label>
                  <input
                    type="number"
                    value={formData.heartRate}
                    onChange={(e) => setFormData({ ...formData, heartRate: e.target.value })}
                    className="mt-1 w-full px-4 py-3 rounded-lg border border-purple-100 focus:outline-none focus:ring-2 focus:ring-purple-400"
                    placeholder="e.g., 120"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Notes
                  </label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    rows={3}
                    className="mt-1 w-full px-4 py-3 rounded-lg border border-purple-100 focus:outline-none focus:ring-2 focus:ring-purple-400"
                    placeholder="Any additional notes..."
                  />
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  className="w-full py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                >
                  Save Exercise
                </motion.button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}