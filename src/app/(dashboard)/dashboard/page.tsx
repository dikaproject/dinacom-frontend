"use client"
import { useAuth } from "@/context/AuthContext";

export default function DashboardPage() {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold text-gray-900">
              Welcome to Your Dashboard
            </h1>
            <button
              onClick={logout}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Logout
            </button>
          </div>
          <div className="border-t border-gray-200 pt-4">
            <p className="text-gray-600">
              Logged in as: {user?.email}
            </p>
            <p className="text-gray-600">
              Role: {user?.role}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}