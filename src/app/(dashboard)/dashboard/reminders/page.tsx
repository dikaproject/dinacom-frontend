"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { pregnancyService } from "@/services/pregnancy";
import {
  Bell,
  Clock,
  MessageCircle,
  Calendar,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import DashboardSkeleton from "@/components/loading/DashboardSkeleton";
import type { PregnancyProfile } from "@/types/pregnancy";
import { Switch } from '@/components/ui/switch';
import toast from "react-hot-toast";
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
      const response = await pregnancyService.getProfile();
      console.log('Profile data:', response); // Debug log
  
      if (!response || !response.profile) {
        throw new Error('Invalid profile data');
      }
  
      // Convert UTC to WIB
      const reminderTimeWIB = response.profile.reminderTime 
        ? new Date(response.profile.reminderTime).toLocaleTimeString('en-US', {
            timeZone: 'Asia/Jakarta',
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
          })
        : "08:00";
  
      setProfile(response.profile as ExtendedProfile);
      setReminderTime(reminderTimeWIB);
      setIsWhatsappActive(response.profile.isWhatsappActive ?? false);
  
    } catch (error) {
      console.error("Failed to fetch profile:", error);
      toast.error('Failed to load reminder settings');
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
      // Convert time to correct format
      const [hours, minutes] = reminderTime.split(":");
      const date = new Date();
      date.setHours(parseInt(hours), parseInt(minutes), 0, 0);

      await pregnancyService.updateReminderSettings({
        isWhatsappActive,
        reminderTime: date.toISOString(),
      });

      await fetchProfile(); // Refresh data after update
      toast.success('Settings updated successfully');
    } catch (error) {
      console.error("Failed to update settings:", error);
      toast.error('Failed to update settings');
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
            <div className="flex items-center justify-between space-x-4 py-4">
    <div className="space-y-1">
      <h4 className="text-sm font-medium text-gray-900">
        WhatsApp Notifications
      </h4>
      <p className="text-sm text-gray-500">
        Receive daily reminders via WhatsApp
      </p>
    </div>
    <Switch
      checked={isWhatsappActive}
      onCheckedChange={setIsWhatsappActive}
      className="data-[state=checked]:bg-purple-600"
    />
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
