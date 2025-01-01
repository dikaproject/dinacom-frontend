// Diagnosa.tsx
"use client"
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { FiAlertCircle, FiCheck, FiChevronRight, FiPhone } from 'react-icons/fi';

// Removed duplicate setIsProcessing function



interface Diagnosis {
    severity: 'Low' | 'Medium' | 'High';
    urgency: string;
    conditions: string[];
    recommendations: string[];
    warnings: string[];
}

const Diagnosa = () => {
  const [step, setStep] = useState(1);
  const [diagnosis, setDiagnosis] = useState<Diagnosis | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const steps = [
    { number: 1, title: "Symptoms" },
    { number: 2, title: "Questionnaire" },
    { number: 3, title: "Analysis" },
    { number: 4, title: "Results" }
  ];

const processDiagnosis = async (): Promise<void> => {
    setIsProcessing(true);
    await new Promise(resolve => setTimeout(resolve, 3000));
    const diagnosis: Diagnosis = {
        severity: "Medium",
        urgency: "Moderate",
        conditions: [
            "Morning Sickness",
            "Dehydration",
            "Fatigue"
        ],
        recommendations: [
            "Increase fluid intake",
            "Rest frequently",
            "Small, frequent meals"
        ],
        warnings: [
            "Seek immediate care if vomiting becomes severe",
            "Monitor for signs of dehydration"
        ]
    };
    setDiagnosis(diagnosis);
    setStep(4);
    setIsProcessing(false);
};
  return (
    <div className="min-h-screen bg-gray-50 pt-28 md:pt-32 pb-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            {steps.map((s) => (
              <div key={s.number} className="flex flex-col items-center">
                <motion.div
                  className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    s.number <= step
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-200 text-gray-500'
                  }`}
                  animate={{
                    scale: s.number === step ? 1.1 : 1,
                    backgroundColor: s.number <= step ? "#7C3AED" : "#E5E7EB"
                  }}
                >
                  {s.number}
                </motion.div>
                <p className="mt-2 text-sm font-medium text-gray-600">
                  {s.title}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Main Content Area */}
        <motion.div
          className="bg-white rounded-xl shadow-lg p-6 md:p-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <AnimatePresence mode="wait">
            {step === 1 && (
              <SymptomInput 
                onNext={() => setStep(2)} 
              />
            )}
            
            {step === 2 && (
              <Questionnaire 
                onNext={() => setStep(3)}
                onBack={() => setStep(1)}
              />
            )}
            
            {step === 3 && (
              <LoadingState 
                onComplete={processDiagnosis}
              />
            )}
            
            {step === 4 && diagnosis && (
              <DiagnosisCard 
                diagnosis={diagnosis}
              />
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
};

const SymptomInput = ({ onNext }: { onNext: () => void }) => {
  const { register, handleSubmit, watch } = useForm();
  const symptoms = watch('symptoms', '');

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      <h2 className="text-2xl font-semibold text-gray-800">
        Describe Your Symptoms
      </h2>
      <form onSubmit={handleSubmit(onNext)} className="space-y-4">
        <div>
          <textarea
            {...register('symptoms', { required: true, minLength: 20 })}
            rows={6}
            className="w-full rounded-lg border-gray-200 focus:ring-purple-500 focus:border-purple-500 text-gray-800"
            placeholder="Please describe what you're experiencing..."
          />
          <div className="mt-2 flex justify-between text-sm text-gray-500">
            <span>Minimum 20 characters</span>
            <span>{symptoms.length} / 500</span>
          </div>
        </div>
        <button
          type="submit"
          className="w-full py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
        >
          Continue
        </button>
      </form>
    </motion.div>
  );
};

const Questionnaire = ({ onNext, onBack }: { onNext: () => void; onBack: () => void }) => {
    const questions = [
        "How many weeks pregnant are you?",
        "Is this your first pregnancy?",
        "Have you experienced these symptoms before?",
        "Are you taking any medications?"
    ];

    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-8"
        >
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">
                Additional Information
            </h2>
            <div className="space-y-6">
                {questions.map((q, i) => (
                    <motion.div 
                        key={i}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="p-4 bg-white rounded-lg border border-gray-200 shadow-sm hover:border-purple-300 transition-all"
                    >
                        <label className="block text-gray-700 font-medium text-lg mb-3">
                            Question {i + 1}: {q}
                        </label>
                        <input
                            type="text"
                            className="w-full rounded-lg border-2 border-gray-200 p-3 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-gray-800 text-base"
                            placeholder="Type your answer here..."
                        />
                        <p className="mt-2 text-sm text-gray-500">
                            Please provide a detailed answer
                        </p>
                    </motion.div>
                ))}
            </div>
            <div className="flex justify-between pt-4">
                <button
                    onClick={onBack}
                    className="px-6 py-3 text-gray-600 hover:text-gray-800 font-medium transition-colors flex items-center"
                >
                    ← Back
                </button>
                <button
                    onClick={onNext}
                    className="px-8 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium shadow-md hover:shadow-lg"
                >
                    Continue →
                </button>
            </div>
        </motion.div>
    );
};

const LoadingState = ({ onComplete }: { onComplete: () => void }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="py-12 text-center"
      onAnimationComplete={onComplete}
    >
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        className="w-16 h-16 border-4 border-purple-200 border-t-purple-600 rounded-full mx-auto mb-6"
      />
      <h3 className="text-xl font-medium text-gray-800 mb-2">
        Analyzing Your Symptoms
      </h3>
      <p className="text-gray-600">
        Please wait while we process your information...
      </p>
    </motion.div>
  );
};

const DiagnosisCard = ({ diagnosis }: { diagnosis: Diagnosis }) => {
  const severityColors = {
    Low: "bg-green-100 text-green-800",
    Medium: "bg-yellow-100 text-yellow-800",
    High: "bg-red-100 text-red-800"
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex justify-between items-start">
        <h2 className="text-2xl font-semibold text-gray-800">
          Diagnosis Results
        </h2>
        <span className={`px-3 py-1 rounded-full text-sm font-medium ${severityColors[diagnosis.severity]}`}>
          {diagnosis.severity} Risk
        </span>
      </div>

      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-medium text-gray-800 mb-3">
            Possible Conditions
          </h3>
          <ul className="space-y-2">
            {diagnosis.conditions.map((condition, i) => (
              <li key={i} className="flex items-center text-gray-700">
                <FiChevronRight className="mr-2 text-purple-500" />
                {condition}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-lg font-medium text-gray-800 mb-3">
            Recommendations
          </h3>
          <ul className="space-y-2">
            {diagnosis.recommendations.map((rec, i) => (
              <li key={i} className="flex items-center text-gray-700">
                <FiCheck className="mr-2 text-green-500" />
                {rec}
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-red-50 border border-red-100 rounded-lg p-4">
          <h3 className="text-lg font-medium text-red-800 mb-3 flex items-center">
            <FiAlertCircle className="mr-2" />
            Important Warnings
          </h3>
          <ul className="space-y-2">
            {diagnosis.warnings.map((warning, i) => (
              <li key={i} className="text-red-700">
                {warning}
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-purple-50 border border-purple-100 rounded-lg p-4">
          <h3 className="text-lg font-medium text-purple-800 mb-3 flex items-center">
            <FiPhone className="mr-2" />
            Need Immediate Help?
          </h3>
          <p className="text-purple-700 mb-4">
            If you&apos;re experiencing severe symptoms, don&apos;t hesitate to contact us.
          </p>
          <button className="w-full py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
            Book Consultation Now
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default Diagnosa;

