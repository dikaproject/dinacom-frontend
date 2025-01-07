"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { pregnancyService } from "@/services/pregnancy";
import {
  Activity,
  Scale,
  Target,
  Brain,
  AlertTriangle,
  CheckCircle,
  Info,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import DashboardSkeleton from "@/components/loading/DashboardSkeleton";

export default function AnalyzePage() {
  const [loading, setLoading] = useState(true);
  const [aiLoading, setAiLoading] = useState(false);
  const [insights, setInsights] = useState<any>(null);
  const [weightData, setWeightData] = useState([]);
  const [nutritionData, setNutritionData] = useState([]);
  const [exerciseData, setExerciseData] = useState([]);

  const fetchInsights = async () => {
    setAiLoading(true);
    try {
      const data = await pregnancyService.getHealthInsights();
      setInsights(data.analysis);
    } catch (error) {
      console.error("Failed to fetch insights:", error);
    } finally {
      setAiLoading(false);
    }
  };

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const [checkups, nutrition, exercise] = await Promise.all([
          pregnancyService.getDailyCheckups(),
          pregnancyService.getNutritionLogs(),
          pregnancyService.getExerciseLogs(),
        ]);

        // Process weight data
        const weightTrend = checkups.map((check) => ({
          date: new Date(check.date).toLocaleDateString(),
          weight: check.weight,
        }));
        setWeightData(weightTrend);

        // Process nutrition data
        const nutritionTrend = nutrition.map((log) => ({
          date: new Date(log.date).toLocaleDateString(),
          calories: log.calories,
          protein: log.protein,
        }));
        setNutritionData(nutritionTrend);

        // Process exercise data
        const exerciseTrend = exercise.map((log) => ({
          date: new Date(log.date).toLocaleDateString(),
          duration: log.duration,
        }));
        setExerciseData(exerciseTrend);

      } catch (error) {
        console.error("Failed to fetch analytics:", error);
      } finally {
        setLoading(false);
      }
    };

    const fetchData = async () => {
      await Promise.all([fetchAnalytics(), fetchInsights()]);
    };
    fetchData();
  }, []);

  if (loading) return <DashboardSkeleton />

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-purple-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Health Analytics</h1>

        {/* Weight Tracking */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-700 mb-4 flex items-center">
            <Scale className="w-5 h-5 mr-2 text-purple-600" />
            Weight Progress
          </h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={weightData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="weight"
                  stroke="#8b5cf6"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Nutrition Analysis */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <h2 className="text-lg text-gray-700 font-semibold mb-4 flex items-center">
            <Target className="w-5 h-5 mr-2 text-purple-600" />
            Nutrition Trends
          </h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={nutritionData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="calories"
                  stroke="#8b5cf6"
                  strokeWidth={2}
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="protein"
                  stroke="#06b6d4"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Exercise Summary */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <h2 className="text-lg text-gray-700 font-semibold mb-4 flex items-center">
            <Activity className="w-5 h-5 mr-2 text-purple-600" />
            Exercise Activity
          </h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={exerciseData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="duration"
                  stroke="#8b5cf6"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Weekly Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white p-6 rounded-2xl shadow-lg"
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg text-gray-700 font-semibold">Weight Change</h3>
              <Scale className="w-5 h-5 text-purple-600" />
            </div>
            <p className="text-3xl font-bold text-purple-600">
              {weightData.length > 1
                ? (
                    weightData[weightData.length - 1]?.weight -
                    weightData[0]?.weight
                  ).toFixed(1)
                : "0"}{" "}
              kg
            </p>
            <p className="text-sm text-gray-500">Since tracking started</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white p-6 rounded-2xl shadow-lg"
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg text-gray-700 font-semibold">Avg. Calories</h3>
              <Target className="w-5 h-5 text-purple-600" />
            </div>
            <p className="text-3xl font-bold text-purple-600">
              {nutritionData.length
                ? Math.round(
                    nutritionData.reduce((sum, log) => sum + log.calories, 0) /
                      nutritionData.length
                  )
                : "0"}
            </p>
            <p className="text-sm text-gray-500">Daily average</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white p-6 rounded-2xl shadow-lg"
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg text-gray-700 font-semibold">Exercise Time</h3>
              <Activity className="w-5 h-5 text-purple-600" />
            </div>
            <p className="text-3xl font-bold text-purple-600">
              {exerciseData.reduce((sum, log) => sum + log.duration, 0)} min
            </p>
            <p className="text-sm text-gray-500">Total duration</p>
          </motion.div>
        </div>

        {/* AI Insights Section */}
        <div className="mt-6">
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg text-gray-700 font-semibold flex items-center">
                <Brain className="w-5 h-5 mr-2 text-purple-600" />
                AI Health Insights
              </h2>
              {aiLoading ? (
                <div className="flex items-center text-purple-600">
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-purple-600 mr-2" />
                  Analyzing...
                </div>
              ) : (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={fetchInsights}
                  className="px-4 py-2 bg-purple-100 text-purple-600 rounded-lg hover:bg-purple-200 transition-colors text-sm"
                >
                  Refresh Analysis
                </motion.button>
              )}
            </div>

            {insights && (
              <div className="space-y-6">
                {/* Overall Status */}
                <div className="p-4 bg-purple-50 rounded-xl">
                  <h3 className="font-medium text-gray-700 mb-2">Overall Health Status</h3>
                  <p className="text-gray-600">{insights.overallStatus}</p>
                </div>

                {/* Nutrition Analysis */}
                <div className="p-4 bg-blue-50 rounded-xl">
                  <h3 className="font-medium text-gray-700 mb-2">Nutrition Analysis</h3>
                  <p className="text-gray-600">{insights.nutritionAnalysis}</p>
                  <ul className="mt-2 space-y-1">
                    {insights.nutritionRecommendations?.map((rec: string, i: number) => (
                      <li key={i} className="flex items-start">
                        <CheckCircle className="w-4 h-4 mr-2 mt-1 text-blue-500" />
                        <span className="text-sm">{rec}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Exercise Evaluation */}
                <div className="p-4 bg-green-50 rounded-xl">
                  <h3 className="font-medium text-gray-700 mb-2">Exercise Evaluation</h3>
                  <p className="text-gray-600">{insights.exerciseEvaluation}</p>
                  <ul className="mt-2 space-y-1">
                    {insights.exerciseSuggestions?.map((sug: string, i: number) => (
                      <li key={i} className="flex items-start">
                        <CheckCircle className="w-4 h-4 mr-2 mt-1 text-green-500" />
                        <span className="text-sm">{sug}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Warning Signs */}
                {insights.warningSignsToWatch?.length > 0 && (
                  <div className="p-4 bg-red-50 rounded-xl">
                    <h3 className="font-medium mb-2 text-red-700">Warning Signs to Watch</h3>
                    <ul className="space-y-1">
                      {insights.warningSignsToWatch.map((warning: string, i: number) => (
                        <li key={i} className="flex items-start">
                          <AlertTriangle className="w-4 h-4 mr-2 mt-1 text-red-500" />
                          <span className="text-sm text-red-600">{warning}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Weekly Recommendations */}
                <div className="p-4 bg-amber-50 rounded-xl">
                  <h3 className="font-medium text-gray-700 mb-2">Week {insights.currentWeek} Recommendations</h3>
                  <ul className="space-y-1">
                    {insights.weeklyRecommendations?.map((rec: string, i: number) => (
                      <li key={i} className="flex items-start">
                        <Info className="w-4 h-4 mr-2 mt-1 text-amber-500" />
                        <span className="text-sm">{rec}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}