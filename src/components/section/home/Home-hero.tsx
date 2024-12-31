// home-hero.tsx
"use client"
import { motion } from 'framer-motion';
import Image from 'next/image';

const HomeHero = () => {
  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.8 }
  };

  const floatingAnimation = {
    animate: {
      y: [0, -10, 0],
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-gradient-to-b from-white to-purple-50">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute w-96 h-96 rounded-full bg-purple-300 blur-3xl -top-20 -left-20" />
        <div className="absolute w-96 h-96 rounded-full bg-purple-300 blur-3xl -bottom-20 -right-20" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Text Content */}
          <motion.div 
            className="space-y-8 text-center lg:text-left"
            initial="initial"
            animate="animate"
            variants={fadeIn}
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold">
              <span className="text-gray-800">Caring for Your</span>
              <br />
              <span className="bg-gradient-to-r from-purple-600 to-purple-400 bg-clip-text text-transparent">
                Pregnancy Journey
              </span>
            </h1>
            
            <p className="text-gray-600 text-lg md:text-xl max-w-2xl mx-auto lg:mx-0">
              Expert guidance, personalized care, and support throughout your 
              pregnancy journey. Connect with specialists and get the care you deserve.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="px-8 py-4 bg-gradient-to-r from-purple-600 to-purple-500 text-white rounded-full font-medium shadow-lg hover:shadow-xl transition-all"
              >
                Start Your Journey
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="px-8 py-4 bg-white text-purple-600 rounded-full font-medium shadow-md hover:shadow-lg transition-all border border-purple-100"
              >
                Learn More
              </motion.button>
            </div>
          </motion.div>

          {/* Hero Image */}
            <motion.div
            className="relative"
            variants={floatingAnimation}
            animate="animate"
            >
            <Image
              src="/images/hero.jpg"
              alt="Pregnancy Care Illustration"
              width={600}
              height={600}
              className="w-full h-auto max-w-md mx-auto rounded-2xl"
              priority
            />
            
            {/* Floating Elements */}
            <motion.div
              className="absolute -top-5 right-10 bg-white p-2 rounded-xl shadow-lg"
              variants={floatingAnimation}
              animate="animate"
              transition={{ delay: 0.2 }}
            >
              <Image
              src="/images/doctoricon.jpg"
              alt="Doctor"
              width={55}
              height={55}
              className="rounded-lg object-cover"
              />
            </motion.div>
            
            <motion.div
              className="absolute -bottom-5 left-10 bg-white p-2 rounded-xl shadow-lg"
              variants={floatingAnimation}
              animate="animate"
              transition={{ delay: 0.4 }}
            >
              <Image
              src="/images/babyicon.jpg"
              alt="Baby"
              width={55}
              height={55}
              className="rounded-lg object-cover"
              />
            </motion.div>
            </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HomeHero;