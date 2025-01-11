"use client";

import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { pregnancyService } from "@/services/pregnancy";
import {
  User,
  Mail,
  Phone,
  Lock,
  CheckCircle,
  AlertCircle,
  Camera,
} from "lucide-react";

import DashboardSkeleton from "@/components/loading/DashboardSkeleton";

const NEXT_PUBLIC_API_URL = process.env.NEXT_PUBLIC_API_URL;

interface ProfileState {
  fullName: string;
  email: string;
  phoneNumber: string;
  address: string;
  photoUrl: string | File;
  photoProfile?: File;
}

export default function SettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [photoPreview, setPhotoPreview] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [profile, setProfile] = useState<ProfileState>({
    fullName: "",
    email: "",
    phoneNumber: "",
    address: "",
    photoUrl: "",
  });

  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  useEffect(() => {
    fetchProfile();
  }, []); // fetchProfile is defined in component scope, no need to add as dependency

  const getPhotoUrl = (photoUrl: string | File): string => {
    if (!photoUrl) return "/default-avatar.png";
    if (typeof photoUrl === 'string') {
      if (photoUrl.startsWith("http")) return photoUrl;
      return `${NEXT_PUBLIC_API_URL}/uploads/profiles/${photoUrl}`;
    }
    return "/default-avatar.png";
  };

  const fetchProfile = async () => {
    try {
      const { profile: fetchedProfile } = await pregnancyService.getProfile();
      if (!fetchedProfile) throw new Error("No data received");

      setProfile({
        fullName: fetchedProfile.fullName || "",
        email: fetchedProfile.user?.email || "",
        phoneNumber: fetchedProfile.phoneNumber || "",
        address: fetchedProfile.address || "",
        photoUrl: fetchedProfile.photoProfile || "",
        photoProfile: undefined,
      });
    } catch (error) {
      setMessage({
        type: "error",
        text: error instanceof Error ? error.message : "Failed to load profile",
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const objectUrl = URL.createObjectURL(file);
      setPhotoPreview(objectUrl);
      setProfile((prev) => ({
        ...prev,
        photoProfile: file,
        photoUrl: prev.photoUrl,
      }));
    }
  };

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const formData = new FormData();
      formData.append("fullName", profile.fullName);
      formData.append("phoneNumber", profile.phoneNumber);
      formData.append("address", profile.address);
      formData.append("email", profile.email);

      if (profile.photoProfile) {
        formData.append("photoProfile", profile.photoProfile);
      }

      await pregnancyService.updateProfile(formData);
      setMessage({ type: "success", text: "Profile updated successfully" });
      await fetchProfile();
    } catch (error) {
      setMessage({
        type: "error",
        text:
          error instanceof Error ? error.message : "Failed to update profile",
      });
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwords.newPassword !== passwords.confirmPassword) {
      setMessage({ type: "error", text: "Passwords do not match" });
      return;
    }
    setSaving(true);
    try {
      await pregnancyService.updatePassword(passwords);
      setMessage({ type: "success", text: "Password updated successfully" });
      setPasswords({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error) {
      console.error(error);
      setMessage({ type: "error", text: "Failed to update password" });
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <DashboardSkeleton />;

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-purple-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">
          Account Settings
        </h1>

        {message.text && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`p-4 rounded-lg mb-6 ${
              message.type === "success"
                ? "bg-green-50 text-green-700"
                : "bg-red-50 text-red-700"
            }`}
          >
            {message.type === "success" ? (
              <CheckCircle className="inline w-5 h-5 mr-2" />
            ) : (
              <AlertCircle className="inline w-5 h-5 mr-2" />
            )}
            {message.text}
          </motion.div>
        )}

        {/* Profile Information */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">
            Personal Information
          </h2>
          <form onSubmit={handleProfileUpdate} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="mb-6 flex flex-col items-center">
                <div className="relative w-32 h-32 mb-4">
                  <div className="w-full h-full rounded-full overflow-hidden border-4 border-purple-100">
                    <Image
                      src={photoPreview || getPhotoUrl(profile.photoUrl)}
                      alt="Profile"
                      width={128}
                      height={128}
                      className="object-cover rounded-full w-full h-full"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute bottom-0 right-0 p-2 bg-purple-600 rounded-full text-white hover:bg-purple-700"
                  >
                    <Camera size={20} />
                  </button>
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoChange}
                  className="hidden"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Full Name
                </label>
                <div className="mt-1 relative">
                  <input
                    type="text"
                    value={profile.fullName}
                    onChange={(e) =>
                      setProfile({ ...profile, fullName: e.target.value })
                    }
                    className="w-full px-4 py-2 rounded-lg border border-purple-100 focus:outline-none focus:ring-2 focus:ring-purple-400"
                    required
                  />
                  <User className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <div className="mt-1 relative">
                  <input
                    type="email"
                    value={profile.email}
                    onChange={(e) =>
                      setProfile({ ...profile, email: e.target.value })
                    }
                    className="w-full px-4 py-2 rounded-lg border border-purple-100 focus:outline-none focus:ring-2 focus:ring-purple-400"
                    required
                  />
                  <Mail className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Phone Number
                </label>
                <div className="mt-1 relative">
                  <input
                    type="tel"
                    value={profile.phoneNumber}
                    onChange={(e) =>
                      setProfile({ ...profile, phoneNumber: e.target.value })
                    }
                    className="w-full px-4 py-2 rounded-lg border border-purple-100 focus:outline-none focus:ring-2 focus:ring-purple-400"
                    required
                  />
                  <Phone className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Address
              </label>
              <textarea
                value={profile.address}
                onChange={(e) =>
                  setProfile({ ...profile, address: e.target.value })
                }
                rows={3}
                className="mt-1 w-full px-4 py-2 rounded-lg border border-purple-100 focus:outline-none focus:ring-2 focus:ring-purple-400"
              />
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={saving}
              className={`w-full py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors ${
                saving ? "opacity-75" : ""
              }`}
            >
              {saving ? (
                <div className="flex items-center justify-center">
                  <div className="w-5 h-5 border-t-2 border-white rounded-full animate-spin mr-2" />
                  Saving...
                </div>
              ) : (
                "Save Changes"
              )}
            </motion.button>
          </form>
        </div>

        {/* Change Password */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">
            Change Password
          </h2>
          <form onSubmit={handlePasswordChange} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Current Password
              </label>
              <div className="mt-1 relative">
                <input
                  type="password"
                  value={passwords.currentPassword}
                  onChange={(e) =>
                    setPasswords({
                      ...passwords,
                      currentPassword: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2 rounded-lg border border-purple-100 focus:outline-none focus:ring-2 focus:ring-purple-400"
                  required
                />
                <Lock className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                New Password
              </label>
              <div className="mt-1 relative">
                <input
                  type="password"
                  value={passwords.newPassword}
                  onChange={(e) =>
                    setPasswords({ ...passwords, newPassword: e.target.value })
                  }
                  className="w-full px-4 py-2 rounded-lg border border-purple-100 focus:outline-none focus:ring-2 focus:ring-purple-400"
                  required
                  minLength={6}
                />
                <Lock className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Confirm New Password
              </label>
              <div className="mt-1 relative">
                <input
                  type="password"
                  value={passwords.confirmPassword}
                  onChange={(e) =>
                    setPasswords({
                      ...passwords,
                      confirmPassword: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2 rounded-lg border border-purple-100 focus:outline-none focus:ring-2 focus:ring-purple-400"
                  required
                  minLength={6}
                />
                <Lock className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={saving}
              className={`w-full py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors ${
                saving ? "opacity-75" : ""
              }`}
            >
              Update Password
            </motion.button>
          </form>
        </div>
      </div>
    </div>
  );
}
