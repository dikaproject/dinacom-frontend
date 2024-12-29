"use client"
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

const HeroSection = () => {
  return (
    <div className="bg-gradient-to-b from-pink-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Your Trusted Partner in
              <span className="text-pink-600"> Maternal Health</span>
            </h1>
            <p className="text-lg text-gray-600 mb-8">
              Get personalized AI-powered guidance throughout your pregnancy journey.
              Connect with experts, track your progress, and ensure a healthy pregnancy.
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              className="flex items-center space-x-2 bg-pink-600 text-white px-6 py-3 rounded-full hover:bg-pink-700"
            >
              <span>Start Your Journey</span>
              <ArrowRight size={20} />
            </motion.button>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <img
              src="/mother-illustration.png"
              alt="Pregnant mother illustration"
              className="w-full h-auto"
            />
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;