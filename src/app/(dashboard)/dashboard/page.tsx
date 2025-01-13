/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import { useAuth } from "@/context/AuthContext";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Calendar,
  Activity,
  Heart,
  Bell,
  AlertCircle,
  TrendingUp,
  Baby,
} from "lucide-react";
import Link from "next/link";
import { pregnancyService } from "@/services/pregnancy";
import { PregnancyProfile, DailyCheckup, AIResponse } from "@/types/pregnancy";
import DashboardSkeleton from "@/components/loading/DashboardSkeleton";
import { useCountdown } from "@/hooks/useCountdown";

const getNextCheckupTime = (lastCheckup: DailyCheckup | null): Date => {
  const today = new Date();
  
  if (!lastCheckup || !lastCheckup.createdAt) {
    return today;
  }
  
  const lastCheckupDate = new Date(lastCheckup.createdAt);
  const nextCheckupDate = new Date(lastCheckupDate);
  nextCheckupDate.setDate(nextCheckupDate.getDate() + 1);
  nextCheckupDate.setHours(0, 0, 0, 0);
  
  return nextCheckupDate;
};

const getCheckupStatus = (checkups: DailyCheckup[]): {
  canCheckup: boolean;
  message: string;
  nextCheckup: Date;
} => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const lastCheckup = checkups[0];
  
  if (!lastCheckup || !lastCheckup.createdAt) {
    return {
      canCheckup: true,
      message: "Daily checkup needed",
      nextCheckup: today
    };
  }

  const lastCheckupDate = new Date(lastCheckup.createdAt);
  lastCheckupDate.setHours(0, 0, 0, 0);

  if (lastCheckupDate.getTime() === today.getTime()) {
    const nextCheckup = getNextCheckupTime(lastCheckup);
    return {
      canCheckup: false,
      message: "Checkup completed for today",
      nextCheckup
    };
  }

  return {
    canCheckup: true,
    message: "Daily checkup needed",
    nextCheckup: today
  };
};

export default function DashboardPage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<PregnancyProfile | null>(null);
  const [checkups, setCheckups] = useState<DailyCheckup[]>([]);
  const [aiRecommendations, setAiRecommendations] = useState<string[]>([]);
  const [checkupStatus, setCheckupStatus] = useState({
    canCheckup: true,
    message: "",
    nextCheckup: new Date()
  });

  const { hours, minutes } = useCountdown(checkupStatus.nextCheckup);

       useEffect(() => {
      const fetchDashboardData = async () => {
        setLoading(true);
        try {
          const [profileResponse, checkupsData] = await Promise.all([
            pregnancyService.getProfile(true),
            pregnancyService.getDailyCheckups(true)
          ]);
          
          if (profileResponse?.profile) {
            setProfile(profileResponse.profile);
            
            if (profileResponse.profile.pregnancyWeek) {
              try {
                const healthData = {
                  trimester: profileResponse.profile.trimester,
                  week: profileResponse.profile.pregnancyWeek,
                };
                
                const aiResponse = await pregnancyService.getAIRecommendations(healthData);
                if (aiResponse && aiResponse.analysis) {
                  const recommendations = [
                    ...aiResponse.analysis.weeklyRecommendations,
                    ...aiResponse.analysis.nutritionRecommendations,
                    ...aiResponse.analysis.exerciseSuggestions
                  ];
                  setAiRecommendations(recommendations);
                }
              } catch (error) {
                console.error('AI recommendations error:', error);
                setAiRecommendations([]);
              }
            }
          }
          
          if (Array.isArray(checkupsData)) {
            setCheckups(checkupsData);
            const status = getCheckupStatus(checkupsData);
            setCheckupStatus(status);
          }
          
        } catch (error) {
          console.error('Dashboard data error:', error);
        } finally {
          setLoading(false);
        }
      };
    
      fetchDashboardData();
    }, []);

  // Helper functions
  const getTrimmester = (week: number): string => {
    if (week <= 12) return "First";
    if (week <= 26) return "Second";
    return "Third";
  };

  const getBabySize = (week: number): string => {
    const sizes = {
      4: "Poppy Seed",
      8: "Raspberry",
      12: "Lime",
      16: "Avocado",
      20: "Banana",
      24: "Papaya",
      28: "Eggplant",
      32: "Squash",
      36: "Honeydew",
      40: "Watermelon",
    };

    const nearestWeek = Object.keys(sizes)
      .map(Number)
      .reduce((a, b) => (Math.abs(b - week) < Math.abs(a - week) ? b : a));

    return sizes[nearestWeek as keyof typeof sizes];
  };

  // Stats using profile data
  const stats = [
    {
      label: "Current Week",
      value: `Week ${profile?.pregnancyWeek || 0}`,
      icon: Calendar,
    },
    {
      label: "Trimester",
      value: profile?.trimester 
        ? profile.trimester.split('_')[0].toLowerCase()
        : getTrimmester(profile?.pregnancyWeek || 0),
      icon: TrendingUp,
    },
    {
      label: "Next Checkup",
      value: checkupStatus.canCheckup 
        ? "Due now"
        : `in ${hours}h ${minutes}m`,
      icon: Activity,
      status: checkupStatus.canCheckup ? 'due' : 'upcoming'
    },
    {
      label: "Baby Size",
      value: getBabySize(profile?.pregnancyWeek || 0),
      icon: Baby,
    },
  ];

  if (loading) {
    return <DashboardSkeleton />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-purple-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Welcome Section */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Welcome back, {profile?.fullName || 'Unknown'} 🌟
              </h1>
              <p className="text-purple-600 mt-1">
                How are you feeling today?
              </p>
            </div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="bg-purple-100 p-3 rounded-full"
            >
              <Bell className="h-6 w-6 text-purple-600" />
            </motion.div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
      {stats.map((stat, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="bg-white p-6 rounded-2xl shadow-lg"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">{stat.label}</p>
              <p className={`text-2xl font-bold mt-1 ${
                stat.label === "Next Checkup" 
                  ? stat.status === 'due' 
                    ? 'text-red-600'
                    : 'text-green-600'
                  : 'text-gray-900'
              }`}>
                {stat.value}
              </p>
            </div>
            <div className={`p-3 rounded-full ${
              stat.label === "Next Checkup"
                ? stat.status === 'due'
                  ? 'bg-red-100'
                  : 'bg-green-100'
                : 'bg-purple-100'
            }`}>
              <stat.icon className={`h-6 w-6 ${
                stat.label === "Next Checkup"
                  ? stat.status === 'due'
                    ? 'text-red-600'
                    : 'text-green-600'
                  : 'text-purple-600'
              }`} />
            </div>
          </div>
        </motion.div>
      ))}
    </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="bg-white p-6 rounded-2xl shadow-lg">
            <h2 className="text-lg font-semibold text-gray-700 mb-4">Quick Actions</h2>
            <div className="grid grid-cols-2 gap-4">
              <Link
                href="/dashboard/checkup"
                className="flex items-center p-3 bg-purple-50 rounded-xl hover:bg-purple-100 transition-colors"
              >
                <Activity className="h-5 w-5 text-purple-600 mr-2" />
                <span>Daily Checkup</span>
              </Link>
              <Link
                href="/dashboard/nutrition"
                className="flex items-center p-3 bg-purple-50 rounded-xl hover:bg-purple-100 transition-colors"
              >
                <Heart className="h-5 w-5 text-purple-600 mr-2" />
                <span>Log Nutrition</span>
              </Link>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-lg">
            <h2 className="text-lg font-semibold text-gray-700 mb-4">Important Reminders</h2>
            <div className="space-y-4">
              <div className="flex items-center text-yellow-600 bg-yellow-50 p-3 rounded-xl">
                <AlertCircle className="h-5 w-5 mr-2" />
                <span>Upcoming doctor appointment in 3 days</span>
              </div>
              <div className="flex items-center text-red-600 bg-red-50 p-3 rounded-xl">
                <AlertCircle className="h-5 w-5 mr-2" />
                <span>Take your prenatal vitamins daily</span>
              </div>
            </div>
          </div>
        </div>

        {/* Progress Tracker */}
        <div className="bg-white p-6 rounded-2xl shadow-lg mb-6">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">Pregnancy Progress</h2>
          <div className="relative pt-1">
            <div className="flex mb-2 items-center justify-between">
              <div>
                <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-purple-600 bg-purple-200">
                  Week {profile?.pregnancyWeek || 0} of 40
                </span>
              </div>
              <div className="text-right">
                <span className="text-xs font-semibold inline-block text-purple-600">
                  {Math.round(((profile?.pregnancyWeek || 0) / 40) * 100)}%
                </span>
              </div>
            </div>
            <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-purple-200">
              <div
                style={{
                  width: `${((profile?.pregnancyWeek || 0) / 40) * 100}%`,
                }}
                className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-purple-500"
              ></div>
            </div>
          </div>
        </div>

        {/* Recent Activities & Health Tips */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="bg-white p-6 rounded-2xl shadow-lg">
            <h2 className="text-lg font-semibold mb-4 text-gray-700">Recent Activities</h2>
            <div className="space-y-4">
              {checkups.length > 0 ? (
                checkups.map((checkup, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-xl"
                  >
                    <span className="text-sm text-gray-600">
                      {checkup.weight}kg, BP: {checkup.bloodPressure || "N/A"}
                    </span>
                    <span className="text-xs text-purple-600">
                      {new Date(checkup.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                ))
              ) : (
                <div className="text-center text-gray-500">
                  No recent checkups
                </div>
              )}
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-lg">
  <h2 className="text-lg font-semibold text-gray-700 mb-4">Health Tips (AI Generated)</h2>
  <div className="space-y-4">
    {aiRecommendations.length > 0 ? (
      aiRecommendations.map((tip, index) => (
        <motion.div
          key={index}
          whileHover={{ scale: 1.02 }}
          className="p-4 bg-purple-50 rounded-xl"
        >
          <div className="text-sm text-gray-600">{tip}</div>
        </motion.div>
      ))
    ) : (
      <div className="text-center text-gray-500">
        No recommendations available
      </div>
    )}
  </div>
</div>
        </div>

        {/* Emergency Contact */}
        <div className="bg-red-50 p-6 rounded-2xl shadow-lg mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-red-700 mb-2">
                Emergency Contact
              </h2>
              <p className="text-sm text-red-600">
                If you experience any emergency symptoms, immediately contact:
              </p>
              <p className="text-lg font-bold text-red-700 mt-2">
                Emergency Hotline: 119
              </p>
            </div>
            <div className="bg-red-100 p-3 rounded-full">
              <AlertCircle className="h-6 w-6 text-red-600" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
