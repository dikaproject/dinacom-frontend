"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import { authService } from "@/services/auth";
import PasswordStrengthIndicator from "./PasswordStrengthIndicator";
import { Eye, EyeOff } from "lucide-react";

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

const RegisterForm = () => {
  // ... state dan logic tetap sama
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // ... semua handler dan validasi tetap sama
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const validatePassword = (password: string) => {
    const requirements = {
      length: password.length >= 8,
      hasNumber: /\d/.test(password),
      hasLower: /[a-z]/.test(password),
      hasUpper: /[A-Z]/.test(password),
      hasSpecial: /[!@#$%^&*(),.?":{}|<>]/.test(password),
      noSequential: !/123|234|345|456|567|678|789/.test(password),
    };

    return Object.values(requirements).every(Boolean);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    // ... handleSubmit logic tetap sama
    e.preventDefault();
    setError("");
    setIsLoading(true);
    setIsSuccess(false);
  
    try {
      if (!validatePassword(formData.password)) {
        setError("Password doesn't meet security requirements");
        setIsLoading(false);
        return;
      }
  
      if (formData.password !== formData.confirmPassword) {
        setError("Passwords do not match");
        setIsLoading(false);
        return;
      }
  
      const response = await authService.register({
        email: formData.email,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
      });
  
      if (response.token && response.user) {
        setIsSuccess(true);
        await login(response.token, response.user);
        setTimeout(() => {
          window.location.href = '/dashboard';
        }, 1500);
      } else {
        throw new Error('Invalid response data');
      }
    } catch (err) {
      console.error("Registration error:", err);
      setError(err instanceof Error ? err.message : "An unexpected error occurred");
      setIsSuccess(false);
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
                <h2 className="text-3xl font-bold text-gray-800">
                  Create Account
                </h2>
                <p className="text-gray-600">
                  Start your pregnancy journey with us
                </p>
              </div>

              {error && (
                <div className="p-3 text-sm text-red-600 bg-red-50 rounded-lg">
                  {error}
                </div>
              )}

              {/* Form tetap sama */}
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* ... form fields tetap sama ... */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 text-gray-600 rounded-lg border border-purple-100 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent"
                    placeholder="Enter your email"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      className="w-full px-4 py-3 text-gray-600 rounded-lg border border-purple-100 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent"
                      placeholder="Create a password"
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
                  <PasswordStrengthIndicator password={formData.password} />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className="w-full px-4 py-3 text-gray-600 rounded-lg border border-purple-100 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent"
                      placeholder="Confirm your password"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-purple-600"
                    >
                      {showConfirmPassword ? (
                        <EyeOff size={20} className="transition-colors" />
                      ) : (
                        <Eye size={20} className="transition-colors" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    className="rounded border-purple-300 text-purple-600 focus:ring-purple-500"
                  />
                  <span className="ml-2 text-sm text-gray-600">
                    I agree to the Terms of Service and Privacy Policy
                  </span>
                </div>

                <div className="space-y-4">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    disabled={isLoading || isSuccess}
                    className={`w-full py-3 bg-gradient-to-r relative ${
                      isSuccess 
                        ? "from-green-600 to-green-500" 
                        : "from-purple-600 to-purple-500"
                    } text-white rounded-lg font-medium shadow-lg hover:shadow-xl transition-all ${
                      (isLoading || isSuccess) ? "opacity-70 cursor-not-allowed" : ""
                    }`}
                  >
                    {isLoading ? (
                      <div className="flex items-center justify-center">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Creating Account...
                      </div>
                    ) : isSuccess ? (
                      <div className="flex items-center justify-center">
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                        Registration Successful!
                      </div>
                    ) : (
                      "Create Account"
                    )}
                  </motion.button>

                  {isSuccess && (
                    <motion.p
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-center text-sm text-green-600"
                    >
                      Redirecting to profile setup...
                    </motion.p>
                  )}
                </div>
              </form>

              <div className="space-y-4 pt-4">
  <p className="text-center text-gray-600">
    Already have an account?{" "}
    <Link
      href="/login"
      className="text-purple-600 hover:text-purple-500 font-medium"
    >
      Sign In
    </Link>
  </p>

  <div className="relative">
    <div className="absolute inset-0 flex items-center">
      <div className="w-full border-t border-gray-200"></div>
    </div>
    <div className="relative flex justify-center text-sm">
      <span className="px-2 bg-white text-gray-500">Or</span>
    </div>
  </div>

  <div className="text-center space-y-2">
    <p className="text-sm text-gray-600">Are you a healthcare professional?</p>
    <Link
      href="/register/doctor"
      className="inline-flex items-center justify-center px-6 py-3 border border-purple-600 text-purple-600 hover:bg-purple-50 rounded-lg font-medium transition-colors"
    >
      Register as a Doctor
      <svg 
        className="ml-2 w-4 h-4" 
        fill="none" 
        stroke="currentColor" 
        viewBox="0 0 24 24"
      >
        <path 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          strokeWidth="2" 
          d="M14 5l7 7m0 0l-7 7m7-7H3"
        />
      </svg>
    </Link>
  </div>
</div>
            </div>
          </motion.div>

          {/* Image Section */}
          <motion.div
            className="relative hidden md:block h-full"
            variants={floatingAnimation}
            animate="animate"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-purple-600/90 to-purple-500/90" />
            <div className="relative h-full">
              <Image
                src="/login.jpg"
                alt="Motherhood"
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
                alt="Pregnant"
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
                alt="Family"
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

export default RegisterForm;