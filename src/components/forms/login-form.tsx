"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import { authService } from "@/services/auth";
import type { UserRole } from "@/types/auth";
import { Eye, EyeOff } from 'lucide-react';

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.8 },
};

const floatingAnimation = {
  animate: {
    y: [0, -10, 0],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
};

const LoginForm = () => {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleRoleBasedRedirect = (role: UserRole) => {
    switch (role) {
      case "ADMIN":
        router.push("/admin/dashboard");
        break;
      case "DOCTOR":
        router.push("/doctor/dashboard");
        break;
      case "USER":
        router.push("/dashboard");
        break;
      default:
        router.push("/dashboard");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await authService.login({ email, password });
      if (response.user) {
        login(response.token, response.user);
        handleRoleBasedRedirect(response.user.role);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-b from-white to-purple-50 py-16 md:py-24">
      {/* Background Pattern */}
      <div className="fixed inset-0 opacity-5 pointer-events-none overflow-hidden">
        <div className="absolute w-96 h-96 rounded-full bg-purple-300 blur-3xl -top-20 -left-20" />
        <div className="absolute w-96 h-96 rounded-full bg-purple-300 blur-3xl -bottom-20 -right-20" />
      </div>

      <div className="relative w-[90%] sm:w-[95%] max-w-4xl mx-auto bg-white rounded-2xl shadow-xl my-8">
        <div className="grid grid-cols-1 md:grid-cols-2 min-h-[600px]">
          {/* Form Section */}
          <motion.div
            className="p-8 md:p-12 flex flex-col justify-center"
            initial="initial"
            animate="animate"
            variants={fadeIn}
          >
            <div className="space-y-8">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold text-gray-800">Welcome Back</h2>
                <p className="text-gray-600">
                  Sign in to continue your pregnancy journey
                </p>
              </div>

              {error && (
                <div className="p-3 text-sm text-red-600 bg-red-50 rounded-lg">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Email
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 text-gray-600 rounded-lg border border-purple-100 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent"
                    placeholder="Enter your email"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Password</label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full px-4 py-3 text-gray-600 rounded-lg border border-purple-100 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent"
                      placeholder="Enter your password"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-purple-600"
                    >
                      {showPassword ? (
                        <EyeOff size={20} className="transition-colors" />
                      ) : (
                        <Eye size={20} className="transition-colors" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      className="rounded border-purple-300 text-purple-600 focus:ring-purple-500"
                    />
                    <span className="ml-2 text-sm text-gray-600">
                      Remember me
                    </span>
                  </label>
                  <Link
                    href="/forgot-password"
                    className="text-sm text-purple-600 hover:text-purple-500"
                  >
                    Forgot Password?
                  </Link>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={isLoading}
                  className={`w-full py-3 mt-4 bg-gradient-to-r from-purple-600 to-purple-500 text-white rounded-lg font-medium shadow-lg hover:shadow-xl transition-all ${
                    isLoading ? "opacity-70 cursor-not-allowed" : ""
                  }`}
                >
                  {isLoading ? "Signing in..." : "Sign In"}
                </motion.button>
              </form>

              <p className="text-center text-gray-600 pt-4">
                Don&apos;t have an account?{" "}
                <Link
                  href="/register"
                  className="text-purple-600 hover:text-purple-500 font-medium"
                >
                  Sign Up
                </Link>
              </p>
            </div>
          </motion.div>

          {/* Image Section */}
          <motion.div
            className="relative hidden md:block"
            variants={floatingAnimation}
            animate="animate"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-purple-600/90 to-purple-500/90" />
            <div className="relative h-full">
              <Image
                src="/images/pregnancy-care.jpg"
                alt="Pregnancy Care"
                layout="fill"
                objectFit="cover"
                quality={100}
                priority
              />
            </div>

            {/* Floating Elements */}
            <motion.div
              className="absolute top-10 right-10 bg-white p-3 rounded-xl shadow-lg"
              variants={floatingAnimation}
              animate="animate"
              transition={{ delay: 0.2 }}
            >
              <Image
                src="/images/doctoricon.jpg"
                alt="Doctor"
                width={50}
                height={50}
                className="rounded-lg"
              />
            </motion.div>

            <motion.div
              className="absolute bottom-10 left-10 bg-white p-3 rounded-xl shadow-lg"
              variants={floatingAnimation}
              animate="animate"
              transition={{ delay: 0.4 }}
            >
              <Image
                src="/images/babyicon.jpg"
                alt="Baby"
                width={50}
                height={50}
                className="rounded-lg"
              />
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;