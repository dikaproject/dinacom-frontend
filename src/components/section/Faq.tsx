// FAQ.tsx
"use client"
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiPlus, FiMinus } from 'react-icons/fi';

const FAQ = () => {
  type FaqCategory = 'general' | 'diagnosis' | 'consultation' | 'account';

  const [activeTab, setActiveTab] = useState<FaqCategory>('general');
  const [activeAccordion, setActiveAccordion] = useState<string | null>(null);

  const categories = [
    { id: 'general', name: 'General' },
    { id: 'diagnosis', name: 'Diagnosis' },
    { id: 'consultation', name: 'Consultation' },
    { id: 'account', name: 'Account & Privacy' },
  ];

  const faqData = {
    general: [
      {
        id: 'g1',
        question: "What is PregnaCare and how does it work?",
        answer: "PregnaCare is a comprehensive pregnancy care platform that combines AI-powered diagnosis, expert consultation, and community support to guide you through your pregnancy journey."
      },
      {
        id: 'g2',
        question: "Is PregnaCare suitable for all stages of pregnancy?",
        answer: "Yes, PregnaCare supports women from pre-conception through postpartum care, with specialized features for each stage of pregnancy."
      }
    ],
    diagnosis: [
      {
        id: 'd1',
        question: "How accurate is the AI diagnosis system?",
        answer: "Our AI system has been trained on extensive medical data and provides preliminary assessments with high accuracy. However, it's always recommended to confirm with healthcare professionals."
      },
      {
        id: 'd2',
        question: "How quickly can I get a diagnosis?",
        answer: "The AI system provides immediate preliminary results. For expert consultation, appointments are usually available within 24-48 hours."
      }
    ],
    consultation: [
      {
        id: 'c1',
        question: "How do I schedule a consultation with a doctor?",
        answer: "You can book consultations through our app or website. Choose your preferred doctor, select a convenient time slot, and confirm your appointment."
      },
      {
        id: 'c2',
        question: "What specialists are available for consultation?",
        answer: "We have OB-GYNs, nutritionists, pediatricians, and mental health professionals specialized in maternal care."
      }
    ],
    account: [
      {
        id: 'a1',
        question: "How is my medical data protected?",
        answer: "We implement bank-level encryption and comply with healthcare data protection regulations to ensure your information remains secure and confidential."
      },
      {
        id: 'a2',
        question: "Can I share my account with family members?",
        answer: "Yes, you can add family members to your account with different access levels while maintaining privacy for sensitive information."
      }
    ]
  };

  return (
    <section className="py-20 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            <span className="bg-gradient-to-r from-purple-600 to-purple-400 bg-clip-text text-transparent">
              Frequently Asked Questions
            </span>
          </h2>
          <p className="text-gray-600 text-lg">
            Find answers to common questions about PregnaCare
          </p>
        </motion.div>

        {/* Category Tabs */}
        <div className="mb-8 overflow-x-auto">
          <div className="flex space-x-4 min-w-max">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveTab(category.id as FaqCategory)}
                className={`px-6 py-2 text-sm font-medium transition-all relative
                  ${activeTab === category.id 
                    ? 'text-purple-600' 
                    : 'text-gray-600 hover:text-purple-600'
                  }`}
              >
                {category.name}
                {activeTab === category.id && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-600"
                  />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Accordion */}
        <div className="space-y-4">
          <AnimatePresence>
            {faqData[activeTab].map((item) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, height: 0 }}
                className="border border-purple-100 rounded-lg overflow-hidden"
              >
                <button
                  onClick={() => setActiveAccordion(
                    activeAccordion === item.id ? null : item.id
                  )}
                  className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-purple-50 transition-colors"
                >
                  <span className="font-medium text-gray-800">
                    {item.question}
                  </span>
                  {activeAccordion === item.id ? (
                    <FiMinus className="text-purple-600 w-5 h-5" />
                  ) : (
                    <FiPlus className="text-purple-600 w-5 h-5" />
                  )}
                </button>
                
                <AnimatePresence>
                  {activeAccordion === item.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="border-t border-purple-100"
                    >
                      <div className="px-6 py-4 text-gray-600 leading-relaxed">
                        {item.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};

export default FAQ;