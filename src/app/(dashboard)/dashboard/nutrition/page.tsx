"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { pregnancyService } from "@/services/pregnancy";
import {
  Coffee,
  Plus,
  X,
  Utensils,
  ArrowRight,
} from "lucide-react";
import type { NutritionLog } from "@/types/pregnancy";
import DashboardSkeleton from "@/components/loading/DashboardSkeleton";

const MEAL_TYPES = ["BREAKFAST", "LUNCH", "DINNER", "SNACK"];

const mealTypeIcons = {
  BREAKFAST: Coffee,
  LUNCH: Utensils,
  DINNER: Utensils,
  SNACK: Coffee,
};

type MealType = "BREAKFAST" | "LUNCH" | "DINNER" | "SNACK";

export default function NutritionLogPage() {
  const [loading, setLoading] = useState(false);
  const [logs, setLogs] = useState<NutritionLog[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState<Partial<NutritionLog>>({
    mealType: "BREAKFAST",
    foodItems: [],
    portions: [],
    calories: 0,
    protein: 0,
    carbs: 0,
    fats: 0,
    notes: "",
  });
  const [error, setError] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showAIModal, setShowAIModal] = useState(false);
const [foodDescription, setFoodDescription] = useState("");
const [aiAnalysis, setAiAnalysis] = useState<string>("");

const analyzeFoodWithAI = async () => {
  setIsAnalyzing(true);
  try {
    const response: {
      calories?: number;
      protein?: number;
      carbs?: number;
      fats?: number;
      explanation: string;
    } = await pregnancyService.analyzeFoodNutrition(foodDescription);
    
    setFormData({
      ...formData,
      calories: response.calories || 0,
      protein: response.protein || 0,
      carbs: response.carbs || 0,
      fats: response.fats || 0,
    });
    setAiAnalysis(response.explanation);
    setShowAIModal(false);
  } catch (error) {
    setError("Failed to analyze food");
    console.error(error);
  } finally {
    setIsAnalyzing(false);
  }
};

  const fetchNutritionLogs = async () => {
    setLoading(true);
    try {
      const data = await pregnancyService.getNutritionLogs();
      setLogs(data);
    } catch (error) {
      console.error("Failed to fetch nutrition logs:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNutritionLogs();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      await pregnancyService.createNutritionLog(formData as NutritionLog);
      setShowAddModal(false);
      fetchNutritionLogs();
      setFormData({
        mealType: "BREAKFAST",
        foodItems: [],
        portions: [],
        calories: 0,
        protein: 0,
        carbs: 0,
        fats: 0,
        notes: "",
      });
    } catch (error) {
      setError(error instanceof Error ? error.message : "Failed to save meal");
    }
  };

  const getTodaysSummary = () => {
    const today = new Date().toDateString();
    const todaysLogs = logs.filter(
      (log) => new Date(log.date).toDateString() === today
    );

    return {
      totalCalories: todaysLogs.reduce((sum, log) => sum + log.calories, 0),
      totalProtein: todaysLogs.reduce((sum, log) => sum + log.protein, 0),
      totalCarbs: todaysLogs.reduce((sum, log) => sum + log.carbs, 0),
      totalFats: todaysLogs.reduce((sum, log) => sum + log.fats, 0),
    };
  };

    if (loading) {
        return <DashboardSkeleton />;
    }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-purple-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Nutrition Log</h1>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowAddModal(true)}
            className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg"
          >
            <Plus className="w-5 h-5 mr-2" />
            Add Meal
          </motion.button>
        </div>

        {/* Today's Summary Card */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">Today&apos;s Summary</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {Object.entries(getTodaysSummary()).map(([key, value]) => (
              <div key={key} className="p-4 bg-purple-50 rounded-xl">
                <p className="text-sm text-purple-600 capitalize">
                  {key.replace("total", "")}
                </p>
                <p className="text-2xl font-bold text-purple-900">
                  {Math.round(value)}
                  <span className="text-sm ml-1">
                    {key.includes("Calories") ? "kcal" : "g"}
                  </span>
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Meals */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">Recent Meals</h2>
          <div className="space-y-4">
            {logs.map((log) => {
              const MealIcon = mealTypeIcons[log.mealType];
              return (
                <motion.div
                  key={log.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 border border-purple-100 rounded-xl hover:bg-purple-50 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="p-2 bg-purple-100 rounded-lg">
                        <MealIcon className="w-5 h-5 text-purple-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">
                          {log.mealType}
                        </p>
                        <p className="text-sm text-gray-500">
                          {new Date(log.date).toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-gray-900">
                        {log.calories} kcal
                      </p>
                      <p className="text-sm text-gray-500">
                        P: {log.protein}g • C: {log.carbs}g • F: {log.fats}g
                      </p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Add Meal Modal */}
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
                <h3 className="text-lg text-gray-600 font-semibold">Add Meal</h3>
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
                    Meal Type
                  </label>
                  <select
                    value={formData.mealType}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        mealType: e.target.value as MealType,
                      })
                    }
                    className="mt-1 text-gray-700 w-full px-4 py-3 rounded-lg border border-purple-100 focus:outline-none focus:ring-2 focus:ring-purple-400"
                  >
                    {MEAL_TYPES.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                <label className="block text-sm font-medium text-gray-700">
    Food Items
  </label>
  <input
    type="text"
    value={formData.foodItems?.join(", ")} // Change to comma
    onChange={(e) => setFormData({
      ...formData,
      foodItems: e.target.value
        .split(",") // Split by comma
        .map(item => item.trim())
        .filter(item => item !== "") // Remove empty items
    })}
    className="mt-1 w-full px-4 py-3 rounded-lg border border-purple-100 focus:outline-none focus:ring-2 focus:ring-purple-400"
    placeholder="e.g., 2 Telur Dadar, 200g nasi uduk, Sayur Kangkung"
  />
  <p className="mt-1 text-sm text-gray-500">
    Separate items with commas
  </p>
  <motion.button
    type="button"
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
    onClick={() => setShowAIModal(true)}
    className="mt-2 px-4 py-2 bg-purple-100 text-purple-600 rounded-lg hover:bg-purple-200 transition-colors text-sm flex items-center"
  >
    <span className="mr-2">Need help calculating nutrition?</span>
    <ArrowRight className="w-4 h-4" />
  </motion.button>
</div>

{/* Add AI Analysis explanation here */}
{aiAnalysis && (
  <div className="mt-4 p-4 bg-purple-50 rounded-lg">
    <p className="text-sm text-gray-600">{aiAnalysis}</p>
  </div>
)}


{/* AI Analysis Modal */}
<AnimatePresence>
  {showAIModal && (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-2xl p-6 w-full max-w-lg mx-4"
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg text-gray-600 font-semibold">AI Nutrition Analysis</h3>
          <button
  type="button" // Add type="button" to prevent form submission
  onClick={() => setShowAIModal(false)}
  className="text-gray-400 hover:text-gray-600"
>
  <X className="w-5 h-5" />
</button>
        </div>

        <div className="space-y-4">
          <p className="text-sm text-gray-500">
            Describe your meal in detail (ingredients, portions, cooking method)
          </p>
          <textarea
            value={foodDescription}
            onChange={(e) => setFoodDescription(e.target.value)}
            rows={4}
            className="w-full px-4 py-3 rounded-lg border border-purple-100 focus:outline-none focus:ring-2 focus:ring-purple-400"
            placeholder="Example: 2 large fried eggs with 400g of steamed white rice and 1 cup of stir-fried vegetables"
          />

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={analyzeFoodWithAI}
            disabled={isAnalyzing || !foodDescription}
            className={`w-full py-3 bg-purple-600 text-white rounded-lg ${
              isAnalyzing ? 'opacity-50' : 'hover:bg-purple-700'
            } transition-colors`}
          >
            {isAnalyzing ? (
              <div className="flex items-center justify-center">
                <span className="mr-2">Analyzing meal...</span>
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white"></div>
              </div>
            ) : (
              'Analyze with AI'
            )}
          </motion.button>
        </div>
      </motion.div>
    </div>
  )}
</AnimatePresence>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Calories
                    </label>
                    <input
                      type="number"
                      value={formData.calories}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          calories: parseFloat(e.target.value),
                        })
                      }
                      className="mt-1 w-full px-4 py-3 rounded-lg border border-purple-100 focus:outline-none focus:ring-2 focus:ring-purple-400"
                      placeholder="Total calories"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Protein (g)
                    </label>
                    <input
                      type="number"
                      value={formData.protein}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          protein: parseFloat(e.target.value),
                        })
                      }
                      className="mt-1 w-full px-4 py-3 rounded-lg border border-purple-100 focus:outline-none focus:ring-2 focus:ring-purple-400"
                      placeholder="Protein in grams"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Carbs (g)
                    </label>
                    <input
                      type="number"
                      value={formData.carbs}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          carbs: parseFloat(e.target.value),
                        })
                      }
                      className="mt-1 w-full px-4 py-3 rounded-lg border border-purple-100 focus:outline-none focus:ring-2 focus:ring-purple-400"
                      placeholder="Carbs in grams"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Fats (g)
                    </label>
                    <input
                      type="number"
                      value={formData.fats}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          fats: parseFloat(e.target.value),
                        })
                      }
                      className="mt-1 w-full px-4 py-3 rounded-lg border border-purple-100 focus:outline-none focus:ring-2 focus:ring-purple-400"
                      placeholder="Fats in grams"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Notes
                  </label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        notes: e.target.value,
                      })
                    }
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
                  Save Meal
                </motion.button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
