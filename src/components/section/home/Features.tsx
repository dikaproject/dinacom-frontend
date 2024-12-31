// Features.tsx
"use client"
import { motion } from 'framer-motion';
import { 
  FaStethoscope, 
  FaComments, 
  FaRobot,
  FaUserMd,
  FaCalendarCheck,
  FaBrain 
} from 'react-icons/fa';

const Features = () => {
  const features = [
    {
      icon: <FaStethoscope className="w-8 h-8" />,
      title: "Smart Diagnosa",
      description: "Get preliminary health assessments based on your symptoms and conditions."
    },
    {
      icon: <FaRobot className="w-8 h-8" />,
      title: "AI Assistant",
      description: "24/7 support with our intelligent chatbot for immediate responses to your concerns."
    },
    {
      icon: <FaUserMd className="w-8 h-8" />,
      title: "Expert Consultation",
      description: "Connect with qualified healthcare professionals for personalized care."
    },
    {
      icon: <FaComments className="w-8 h-8" />,
      title: "Community Support",
      description: "Join our supportive community of mothers sharing experiences and advice."
    },
    {
      icon: <FaCalendarCheck className="w-8 h-8" />,
      title: "Appointment Booking",
      description: "Easy scheduling for virtual or in-person consultations with doctors."
    },
    {
      icon: <FaBrain className="w-8 h-8" />,
      title: "Health Tracking",
      description: "Monitor your pregnancy journey with our intelligent tracking system."
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1
    }
  };

  return (
    <section className="py-20 bg-gradient-to-b from-white to-purple-50">
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
              Comprehensive Care
            </span>
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Experience complete pregnancy care with our innovative features designed for your journey
          </p>
        </motion.div>

        {/* Features Grid */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover={{ 
                y: -5,
                transition: { duration: 0.2 }
              }}
              className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all border border-purple-50"
            >
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="p-4 bg-purple-50 rounded-full text-purple-600">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-800">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Features;