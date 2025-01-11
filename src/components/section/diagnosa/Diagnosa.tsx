"use client"
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiAlertCircle, FiCheck, FiChevronRight, FiPhone } from 'react-icons/fi';

interface DiagnosisResult {
  health_score: number;
  severity_level: string;
  urgency_level: string;
  possible_conditions: string[];
  recommendations: string[];
}

const Diagnosa = () => {
  const [currentAnswers, setCurrentAnswers] = useState<Record<string, string>>({});
  const [questions, setQuestions] = useState<string[]>([]);
  const [showQuestions, setShowQuestions] = useState(false);
  const [diagnosis, setDiagnosis] = useState<DiagnosisResult | null>(null);
  const [answeredCount, setAnsweredCount] = useState(0);
  const [complaint, setComplaint] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const apiKey = 'inth_premium_IDGUGGbdbdkjkwDWoiwodhhnni3eyi73bIbIDdg';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (Object.keys(currentAnswers).length === 0) {
        // First submission - get questions
        const response = await fetch('http://localhost:8000/v1/health/diagnose', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': apiKey
          },
          body: JSON.stringify({ complaint })
        });

        const data = await response.json();
        if (data.questions && data.questions.questions) {
          setQuestions(data.questions.questions);
          setShowQuestions(true);
        }
      } else {
        // Second submission - get diagnosis
        const response = await fetch('http://localhost:8000/v1/health/diagnose', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': apiKey
          },
          body: JSON.stringify({
            complaint,
            answers: currentAnswers
          })
        });

        const result = await response.json();
        setDiagnosis(result);
        setShowQuestions(false);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAnswerChange = (question: string, answer: string) => {
    setCurrentAnswers(prev => {
      const newAnswers = { ...prev, [question]: answer };
      const answered = Object.values(newAnswers).filter(a => a.trim() !== '').length;
      setAnsweredCount(answered);
      return newAnswers;
    });
  };

  const progress = questions.length > 0 ? (answeredCount / questions.length) * 100 : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 pt-28 md:pt-32 pb-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="bg-white rounded-xl shadow-lg p-6 md:p-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <AnimatePresence mode="wait">
            {!showQuestions && !diagnosis && (
              <motion.form
                onSubmit={handleSubmit}
                className="space-y-6"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <h2 className="text-2xl font-semibold text-gray-800">
                  Describe Your Symptoms
                </h2>
                <div>
                  <textarea
                    value={complaint}
                    onChange={(e) => setComplaint(e.target.value)}
                    rows={6}
                    className="w-full rounded-lg border-gray-200 focus:ring-purple-500 focus:border-purple-500"
                    placeholder="Please describe what you're experiencing..."
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                  disabled={isLoading}
                >
                  {isLoading ? "Processing..." : "Analyze Symptoms"}
                </button>
              </motion.form>
            )}

            {showQuestions && (
              <motion.form
                onSubmit={handleSubmit}
                className="space-y-6"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <div className="mb-6">
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium text-purple-700">Progress</span>
                    <span className="text-sm font-medium text-purple-700">{Math.round(progress)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <motion.div
                      className="bg-purple-600 h-2.5 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${progress}%` }}
                      transition={{ duration: 0.5 }}
                    />
                  </div>
                </div>

                {questions.map((q, i) => (
                  <motion.div
                    key={i}
                    className="p-4 bg-white rounded-lg border border-gray-200 shadow-sm"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <label className="block text-gray-700 font-medium mb-2">
                      {i + 1}. {q}
                    </label>
                    <input
                      type="text"
                      className="w-full rounded-lg border-2 border-gray-200 p-3"
                      onChange={(e) => handleAnswerChange(q, e.target.value)}
                      value={currentAnswers[q] || ''}
                    />
                  </motion.div>
                ))}

                <button
                  type="submit"
                  className="w-full py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                  disabled={isLoading}
                >
                  {isLoading ? "Processing..." : "Get Diagnosis"}
                </button>
              </motion.form>
            )}

            {diagnosis && (
              <DiagnosisResult diagnosis={diagnosis} />
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
};

const DiagnosisResult = ({ diagnosis }: { diagnosis: DiagnosisResult }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Health Score */}
      <div className="mb-6">
        <h3 className="text-lg font-medium text-gray-800 mb-2">Health Score</h3>
        <div className="flex items-center space-x-4">
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <motion.div
              className="bg-purple-600 h-2.5 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${diagnosis.health_score}%` }}
              transition={{ duration: 1 }}
            />
          </div>
          <span className="text-sm font-medium text-gray-600 min-w-[4rem]">
            {diagnosis.health_score}%
          </span>
        </div>
      </div>

      {/* Severity and Urgency */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 bg-purple-50 rounded-lg">
          <h3 className="font-semibold text-purple-800">Severity Level</h3>
          <p className="text-gray-600">{diagnosis.severity_level}</p>
        </div>
        <div className="p-4 bg-blue-50 rounded-lg">
          <h3 className="font-semibold text-blue-800">Urgency Level</h3>
          <p className="text-gray-600">{diagnosis.urgency_level}</p>
        </div>
      </div>

      {/* Possible Conditions */}
      <div className="space-y-2">
        <h3 className="font-semibold text-gray-800">Possible Conditions:</h3>
        <ul className="space-y-2">
          {diagnosis.possible_conditions.map((condition, i) => (
            <motion.li
              key={i}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className="flex items-center text-gray-700"
            >
              <FiChevronRight className="mr-2 text-purple-500" />
              {condition}
            </motion.li>
          ))}
        </ul>
      </div>

      {/* Recommendations */}
      <div className="space-y-2">
        <h3 className="font-semibold text-gray-800">Recommendations:</h3>
        <ul className="space-y-2">
          {diagnosis.recommendations.map((rec, i) => (
            <motion.li
              key={i}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className="flex items-center text-gray-700"
            >
              <FiCheck className="mr-2 text-green-500" />
              {rec}
            </motion.li>
          ))}
        </ul>
      </div>

      {/* Important Warning */}
      <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <h3 className="text-yellow-800 font-semibold mb-2 flex items-center">
          <FiAlertCircle className="mr-2" />
          Important Warning
        </h3>
        <div className="text-yellow-700 space-y-2 text-sm">
          <p>This diagnosis is indicative only and does not replace professional medical consultation.</p>
          <p>If your symptoms:</p>
          <ul className="list-disc list-inside ml-4">
            <li>Are severe or unbearable</li>
            <li>Significantly worsen</li>
            <li>Require immediate attention</li>
          </ul>
          <p className="font-medium mt-2">Please take immediate action:</p>
          <div className="flex flex-col space-y-2 mt-2">
            <button 
              className="text-purple-600 hover:text-purple-700 flex items-center"
              onClick={() => window.location.href = '/consultation'}
            >
              <FiChevronRight className="mr-1" /> Book a consultation with our service
            </button>
            <button 
              className="text-red-600 hover:text-red-700 flex items-center"
              onClick={() => window.location.href = '/emergency'}
            >
              <FiPhone className="mr-1" /> Contact emergency services
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Diagnosa;

