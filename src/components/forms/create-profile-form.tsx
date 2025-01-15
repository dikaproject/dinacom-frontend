"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { PregnancyProfile } from "@/types/pregnancy";
import { pregnancyService } from "@/services/pregnancy"; 
import Image from "next/image";
import { FiUpload } from "react-icons/fi";
import toast from "react-hot-toast";

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.8 },
};

const CreateProfileForm = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  

  const [formData, setFormData] = useState<PregnancyProfile>({
    fullName: "",
    photoProfile: undefined,
    dateOfBirth: "",
    phoneNumber: "",
    reminderTime: "",
    address: "",
    bloodType: "",
    height: "",
    pregnancyStartDate: "",
    dueDate: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Add file size validation
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast.error('Image size should not exceed 5MB');
        return;
      }
  
      // Add file type validation
      if (!file.type.startsWith('image/')) {
        toast.error('Please upload an image file');
        return;
      }
  
      setFormData(prev => ({
        ...prev,
        photoProfile: file
      }));
  
      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const formDataToSend = new FormData();
      
      // Append all form fields
      Object.entries(formData).forEach(([key, value]) => {
        if (value !== undefined && value !== "") {
          if (key === 'photoProfile' && value instanceof File) {
            formDataToSend.append('photoProfile', value);
          } else {
            formDataToSend.append(key, value.toString());
          }
        }
      });

      await pregnancyService.createProfile(formDataToSend);
      router.push("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create profile");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="min-h-screen bg-gradient-to-b from-white to-purple-50 py-20">
      <motion.div
        className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8"
        initial="initial"
        animate="animate"
        variants={fadeIn}
      >
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Complete Your Profile</h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-3 text-sm text-red-600 bg-red-50 rounded-lg">
                {error}
              </div>
            )}

            {/* Photo Upload Section */}
            <div className="flex justify-center mb-8">
              <div className="space-y-4">
                <div className="relative w-32 h-32 rounded-full overflow-hidden border-2 border-purple-100 mx-auto">
                  {photoPreview ? (
                    <Image
                      src={photoPreview}
                      alt="Profile preview"
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-purple-50">
                      <FiUpload className="w-8 h-8 text-purple-300" />
                    </div>
                  )}
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-4 py-2 text-sm text-purple-600 border border-purple-200 rounded-lg hover:bg-purple-50"
                >
                  Upload Photo
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Personal Details */}
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-700">Personal Details</h3>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Full Name</label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    className="mt-1 w-full px-4 text-gray-600 py-3 rounded-lg border border-purple-100 focus:outline-none focus:ring-2 focus:ring-purple-400"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Date of Birth</label>
                  <input
                    type="date"
                    name="dateOfBirth"
                    value={formData.dateOfBirth}
                    onChange={handleChange}
                    className="mt-1 w-full px-4 py-3 text-gray-600 rounded-lg border border-purple-100 focus:outline-none focus:ring-2 focus:ring-purple-400"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Phone Number</label>
                  <input
                  type="tel"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  placeholder="Use country code example (e.g. 6281234567890) not 081234567890"
                  className="mt-1 w-full px-4 py-3 text-gray-600 rounded-lg border border-purple-100 focus:outline-none focus:ring-2 focus:ring-purple-400"
                  required
                  />
                  <p className="mt-1 text-sm text-gray-500">
                  Use country code example (e.g. 6281234567890) not 081234567890
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Address</label>
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    rows={3}
                    className="mt-1 w-full px-4 py-3 text-gray-600 rounded-lg border border-purple-100 focus:outline-none focus:ring-2 focus:ring-purple-400"
                    required
                  />
                </div>
              </div>

              {/* Pregnancy Details */}
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-700">Pregnancy Details</h3>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Blood Type</label>
                  <select
                    name="bloodType"
                    value={formData.bloodType}
                    onChange={handleChange}
                    className="mt-1 w-full px-4 py-3 text-gray-600 rounded-lg border border-purple-100 focus:outline-none focus:ring-2 focus:ring-purple-400"
                  >
                    <option value="">Select Blood Type</option>
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Height (cm)</label>
                  <input
                    type="number"
                    name="height"
                    value={formData.height}
                    onChange={handleChange}
                    className="mt-1 w-full px-4 py-3 text-gray-600 rounded-lg border border-purple-100 focus:outline-none focus:ring-2 focus:ring-purple-400"
                    placeholder="Enter your height in cm"
                  />
                </div>

                                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Start Pregnancy Date
                  </label>
                  <input
                    type="date"
                    name="pregnancyStartDate"
                    value={formData.pregnancyStartDate}
                    onChange={handleChange}
                    className="mt-1 w-full px-4 py-3 rounded-lg border border-purple-100 focus:outline-none focus:ring-2 focus:ring-purple-400"
                    required
                  />
                  <p className="mt-1 text-sm text-gray-500">
                    The date you found out you were pregnant
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Daily Reminder Time</label>
                  <input
                    type="time"
                    name="reminderTime"
                    value={formData.reminderTime}
                    onChange={handleChange}
                    className="mt-1 w-full px-4 py-3 text-gray-600 rounded-lg border border-purple-100 focus:outline-none focus:ring-2 focus:ring-purple-400"
                    required
                  />
                </div>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={isLoading}
              className={`w-full py-4 bg-gradient-to-r from-purple-600 to-purple-500 text-white rounded-lg font-medium shadow-lg hover:shadow-xl transition-all ${
                isLoading ? "opacity-70 cursor-not-allowed" : ""
              }`}
            >
              {isLoading ? "Creating Profile..." : "Complete Profile"}
            </motion.button>
          </form>
        </div>
      </motion.div>
    </section>
  );
};

export default CreateProfileForm;