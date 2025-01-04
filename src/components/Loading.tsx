// Loading.tsx
"use client"
import { motion } from 'framer-motion';

const Loading = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-white backdrop-blur-sm z-50 flex items-center justify-center"
    >
      <div className="relative flex flex-col items-center">
        {/* Main loading circle */}
        <div className="relative">
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.5, 0.8, 0.5],
            }}
            transition={{
              duration: 1,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="w-16 h-16 rounded-full border-4 border-purple-600/30"
          />
          <motion.div
            animate={{
              rotate: 360
            }}
            transition={{
              duration: 1,
              repeat: Infinity,
              ease: "linear"
            }}
            className="absolute inset-0 border-4 border-transparent border-t-purple-600 rounded-full"
          />
        </div>

        {/* PregnaCare text */}
        <motion.div
          animate={{
            opacity: [0.5, 1, 0.5]
          }}
          transition={{
            duration: 1.2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="mt-4 text-center"
        >
          <h3 className="text-xl font-semibold bg-gradient-to-r from-purple-600 to-purple-400 bg-clip-text text-transparent">
            PregnaCare
          </h3>
          <p className="text-sm text-gray-500 mt-1">
            Loading...
          </p>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Loading;