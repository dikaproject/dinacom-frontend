"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { pregnancyService } from "@/services/pregnancy";
import {
  Bell,
  Clock,
  MessageCircle,
  ToggleRight,
  ToggleLeft,
  Calendar,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import DashboardSkeleton from "@/components/loading/DashboardSkeleton";
import type { PregnancyProfile } from "@/types/pregnancy";

interface ExtendedProfile extends PregnancyProfile {
  isWhatsappActive: boolean;
  reminderTime: string;
}

export default function RemindersPage() {
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<ExtendedProfile | null>(null);
  const [reminderTime, setReminderTime] = useState("");
  const [isWhatsappActive, setIsWhatsappActive] = useState(true);

  const [isSaving, setIsSaving] = useState(false);

  const fetchProfile = async () => {
    try {
      const data = await pregnancyService.getProfile();
      if (!data) throw new Error('No data received');

      const wibTime = data.reminderTime 
        ? new Date(data.reminderTime).toLocaleTimeString('en-US', {
            timeZone: 'Asia/Jakarta',
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
          })
        : "08:00";

      setProfile({
        ...data,
        isWhatsappActive: data.isWhatsappActive ?? false,
        reminderTime: data.reminderTime || new Date().toISOString()
      } as unknown as ExtendedProfile);
      
      setReminderTime(wibTime);
      setIsWhatsappActive(data.isWhatsappActive ?? false);
    } catch (error) {
      console.error("Failed to fetch profile:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleUpdateSettings = async () => {
    setIsSaving(true);
    try {
      const [hours, minutes] = reminderTime.split(":");
      const date = new Date();
      // Convert WIB time to UTC for storage
      const jakartaOffset = 7; // UTC+7
      date.setUTCHours(parseInt(hours) - jakartaOffset, parseInt(minutes), 0, 0);

      const response = await pregnancyService.updateReminderSettings({
        isWhatsappActive,
        reminderTime: date.toISOString(),
      });

      if (!response) throw new Error('Update failed');
      await fetchProfile();
    } catch (error) {
      console.error("Failed to update settings:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const formatTimeWIB = (date: string) => {
    return new Date(date).toLocaleTimeString("en-US", {
      timeZone: "Asia/Jakarta",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  };

  if (loading) {
    return <DashboardSkeleton />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-purple-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">
          Daily Reminders
        </h1>

        {/* Settings Card */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4 flex items-center">
            <Bell className="w-5 h-5 mr-2 text-purple-600" />
            Reminder Settings
          </h2>

          <div className="space-y-6">
            {/* Time Picker */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Daily Reminder Time
              </label>
              <div className="flex items-center space-x-4">
                <div className="relative flex items-center">
                  <input
                    type="time"
                    value={reminderTime}
                    onChange={(e) => setReminderTime(e.target.value)}
                    className="px-4 py-2 rounded-lg border border-purple-100 focus:outline-none focus:ring-2 focus:ring-purple-400"
                  />
                  <span className="ml-2 text-sm text-gray-500">WIB</span>
                  <Clock className="w-5 h-5 text-gray-400 ml-2" />
                </div>
              </div>
            </div>

            {/* WhatsApp Toggle */}
            <div>
              <label className="flex items-center justify-between cursor-pointer">
                <span className="text-sm font-medium text-gray-700">
                  WhatsApp Notifications
                </span>
                <button
                  onClick={() => setIsWhatsappActive(!isWhatsappActive)}
                  className="relative"
                >
                  {isWhatsappActive ? (
                    <ToggleRight className="w-10 h-10 text-purple-600" />
                  ) : (
                    <ToggleLeft className="w-10 h-10 text-gray-400" />
                  )}
                </button>
              </label>
            </div>

            {/* Save Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleUpdateSettings}
              disabled={isSaving}
              className={`w-full py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors ${
                isSaving ? "opacity-75" : ""
              }`}
            >
              {isSaving ? (
                <div className="flex items-center justify-center">
                  <div className="w-5 h-5 border-t-2 border-white rounded-full animate-spin mr-2" />
                  Saving...
                </div>
              ) : (
                "Save Changes"
              )}
            </motion.button>
          </div>
        </div>

        {/* Reminder Status */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4 flex items-center">
            <Calendar className="w-5 h-5 mr-2 text-purple-600" />
            Next Reminders
          </h2>

          <div className="space-y-4">
            {["Checkup", "Nutrition", "Exercise"].map((type) => (
              <div
                key={type}
                className="flex items-center justify-between p-4 rounded-lg bg-gray-50"
              >
                <div>
                  <p className="font-medium text-gray-900">{type} Reminder</p>
                  <p className="text-sm text-gray-500">
                    Next:{" "}
                    {profile?.reminderTime
                      ? formatTimeWIB(profile.reminderTime)
                      : "--:--"}{" "}
                    WIB
                  </p>
                </div>
                {isWhatsappActive ? (
                  <CheckCircle2 className="w-5 h-5 text-green-500" />
                ) : (
                  <XCircle className="w-5 h-5 text-red-500" />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Message History */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h2 className="text-lg font-semibold mb-4 flex items-center">
            <MessageCircle className="w-5 h-5 mr-2 text-purple-600" />
            Recent Reminders
          </h2>

          <div className="space-y-4">
            {[1, 2, 3].map((_, i) => (
              <div
                key={i}
                className="p-4 border border-purple-100 rounded-lg hover:bg-purple-50 transition-colors"
              >
                <div className="flex items-center justify-between mb-2">
                  <p className="font-medium text-gray-900">
                    Daily Checkup Reminder
                  </p>
                  <span className="text-sm text-gray-500">
                    {new Date().toLocaleDateString()}
                  </span>
                </div>
                <p className="text-sm text-gray-600">
                  Reminder sent successfully via WhatsApp
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
