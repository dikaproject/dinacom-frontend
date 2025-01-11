"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { pregnancyService } from "@/services/pregnancy";
import { Activity, Droplet, Moon, Heart } from "lucide-react";
import { CheckupComplete } from "@/components/modals/CheckupComplete";
import type { DailyCheckup } from "@/types/pregnancy";

export default function DailyCheckupPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [hasCompletedToday, setHasCompletedToday] = useState(false);
  const [formData, setFormData] = useState<Omit<DailyCheckup, 'weight' | 'sleepHours' | 'waterIntake'> & {
    weight: string;
    sleepHours: string;
    waterIntake: string;
    symptoms: string[];
  }>({
    weight: "",
    bloodPressure: "",
    mood: "happy", 
    sleepHours: "",
    waterIntake: "",
    symptoms: [],
    notes: "",
    createdAt: new Date().toISOString()
  });

  useEffect(() => {
    const checkTodayStatus = async () => {
      try {
        const logs = await pregnancyService.getDailyCheckups();
        const today = new Date().toDateString();
        const hasToday = logs.some(log => 
          log.date && new Date(log.date).toDateString() === today
        );
        setHasCompletedToday(hasToday);
      } catch (error) {
        console.error('Failed to check today status:', error);
      }
    };

    checkTodayStatus();
  }, []);

  if (hasCompletedToday) {
    return <CheckupComplete isOpen={true} onClose={() => router.push('/dashboard')} />;
  }

  const moodOptions = ["happy", "neutral", "tired", "anxious", "sick"];
  const symptomsList = [
    "nausea",
    "headache",
    "fatigue",
    "backPain",
    "swelling",
    "cramping",
    "dizziness"
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);

    try {
      await pregnancyService.createDailyCheckup({
        ...formData,
        weight: parseFloat(formData.weight),
        sleepHours: parseFloat(formData.sleepHours),
        waterIntake: parseFloat(formData.waterIntake)
      });
      setSuccess(true);
      setFormData({
        weight: "",
        bloodPressure: "",
        mood: "happy",
        sleepHours: "",
        waterIntake: "",
        symptoms: [],
        notes: "",
        createdAt: new Date().toISOString()
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save checkup");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-purple-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Daily Health Checkup</h1>

          {error && (
            <div className="mb-4 p-4 bg-red-50 text-red-600 rounded-lg">
              {error}
            </div>
          )}

          {success && (
            <div className="mb-4 p-4 bg-green-50 text-green-600 rounded-lg">
              Checkup saved successfully!
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Measurements */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">Weight (kg)</label>
                <div className="mt-1 relative">
                  <input
                    type="number"
                    step="0.1"
                    required
                    value={formData.weight}
                    onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg border border-purple-100 focus:outline-none focus:ring-2 focus:ring-purple-400"
                    placeholder="Enter your weight"
                  />
                  <Activity className="absolute right-3 top-3 h-5 w-5 text-gray-400" />
                </div>
              </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Blood Pressure (optional)
              </label>
              <div className="mt-1 relative">
                <input
                  type="text"
                  value={formData.bloodPressure}
                  onChange={(e) => setFormData({ ...formData, bloodPressure: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg border border-purple-100 focus:outline-none focus:ring-2 focus:ring-purple-400"
                  placeholder="e.g., 120/80 (optional)"
                />
                <Heart className="absolute right-3 top-3 h-5 w-5 text-gray-400" />
              </div>
              <p className="mt-1 text-xs text-gray-500">
                Leave blank if you don&apos;t have a blood pressure monitor at home
              </p>
            </div>
            </div>

            {/* Wellness Tracking */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">Mood</label>
                <select
                  value={formData.mood}
                  onChange={(e) => setFormData({ ...formData, mood: e.target.value })}
                  className="mt-1 w-full px-4 py-3 text-gray-700 rounded-lg border border-purple-100 focus:outline-none focus:ring-2 focus:ring-purple-400"
                >
                  {moodOptions.map(mood => (
                    <option key={mood} value={mood}>{mood}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Sleep (hours)</label>
                <div className="mt-1 relative">
                  <input
                    type="number"
                    step="0.5"
                    required
                    value={formData.sleepHours}
                    onChange={(e) => setFormData({ ...formData, sleepHours: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg border border-purple-100 focus:outline-none focus:ring-2 focus:ring-purple-400"
                    placeholder="Hours of sleep"
                  />
                  <Moon className="absolute right-3 top-3 h-5 w-5 text-gray-400" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Water Intake (L)</label>
                <div className="mt-1 relative">
                  <input
                    type="number"
                    step="0.1"
                    required
                    value={formData.waterIntake}
                    onChange={(e) => setFormData({ ...formData, waterIntake: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg border border-purple-100 focus:outline-none focus:ring-2 focus:ring-purple-400"
                    placeholder="Liters of water"
                  />
                  <Droplet className="absolute right-3 top-3 h-5 w-5 text-gray-400" />
                </div>
              </div>
            </div>

            {/* Symptoms */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Symptoms (Opsional)</label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {symptomsList.map(symptom => (
                  <label key={symptom} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={formData.symptoms.includes(symptom)}
                      onChange={(e) => {
                        const updatedSymptoms = e.target.checked
                          ? [...formData.symptoms, symptom]
                          : formData.symptoms.filter(s => s !== symptom);
                        setFormData({ ...formData, symptoms: updatedSymptoms });
                      }}
                      className="rounded border-purple-300 text-purple-600 focus:ring-purple-500"
                    />
                    <span className="text-sm text-gray-700">{symptom}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Notes */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Additional Notes</label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                rows={3}
                className="mt-1 w-full px-4 py-3 rounded-lg border border-purple-100 focus:outline-none focus:ring-2 focus:ring-purple-400"
                placeholder="Any additional notes or concerns..."
              />
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className={`w-full py-4 bg-gradient-to-r from-purple-600 to-purple-500 text-white rounded-lg font-medium shadow-lg hover:shadow-xl transition-all ${
                loading ? "opacity-70 cursor-not-allowed" : ""
              }`}
            >
              {loading ? "Saving..." : "Save Daily Checkup"}
            </motion.button>
          </form>
        </div>
      </div>
    </div>
  );
}