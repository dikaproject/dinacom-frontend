// Workflow.tsx
"use client"
import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';

const Workflow = () => {
  const steps = [
    {
      number: "01",
      title: "Create Account",
      description: "Sign up and complete your health profile to get personalized care"
    },
    {
      number: "02",
      title: "Choose Service",
      description: "Select from our range of services including AI diagnosis or doctor consultation"
    },
    {
      number: "03",
      title: "Get Care",
      description: "Receive immediate AI responses or schedule appointments with specialists"
    },
    {
      number: "04",
      title: "Track Progress",
      description: "Monitor your pregnancy journey and access ongoing support"
    }
  ];

  const containerRef = useRef(null);
  const isInView = useInView(containerRef, { once: true, margin: "-100px" });

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            <span className="bg-gradient-to-r from-purple-600 to-purple-400 bg-clip-text text-transparent">
              How It Works
            </span>
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Your journey to better maternal health in four simple steps
          </p>
        </motion.div>

        {/* Timeline Steps */}
        <div 
          ref={containerRef}
          className="relative"
        >
          {/* Connecting Line */}
          <div className="hidden lg:block absolute top-1/2 left-0 w-full h-0.5 bg-purple-100 -translate-y-1/2" />

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                className="relative"
              >
                {/* Number Circle */}
                <div className="flex justify-center mb-6">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-600 to-purple-400 flex items-center justify-center text-white font-bold shadow-lg">
                    {step.number}
                  </div>
                </div>

                {/* Content Card */}
                <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow text-center">
                  <h3 className="text-xl font-semibold text-gray-800 mb-3">
                    {step.title}
                  </h3>
                  <p className="text-gray-600">
                    {step.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="text-center mt-12"
        >
          <button className="px-8 py-4 bg-gradient-to-r from-purple-600 to-purple-500 text-white rounded-full font-medium shadow-lg hover:shadow-xl transition-all">
            Start Your Journey Now
          </button>
        </motion.div>
      </div>
    </section>
  );
};

export default Workflow;