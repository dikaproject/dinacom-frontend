// ConsultationForm.tsx
"use client"
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { FiUpload, FiX } from 'react-icons/fi';

interface ConsultationFormProps {
  nextStep: () => void;
  prevStep: () => void;
}

const ConsultationForm: React.FC<ConsultationFormProps> = ({ nextStep, prevStep }) => {
  const [formStep, setFormStep] = useState(0);
  const [files, setFiles] = useState<File[]>([]);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    trigger
  } = useForm<FormData>({
    mode: 'onChange'
  });

  const formSteps = [
    { title: "Basic Information", progress: 33 },
    { title: "Symptoms & Concerns", progress: 66 },
    { title: "Medical History", progress: 100 }
  ];

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newFiles = Array.from(event.target.files || []);
    setFiles(prev => [...prev, ...newFiles]);
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const goToNext = async () => {
    const isStepValid = await trigger();
    if (isStepValid) {
      setFormStep(prev => prev + 1);
    }
  };

interface FormData {
    pregnancyWeek: number;
    previousPregnancies: number;
    symptoms: string;
    concerns?: string;
    medicalHistory: string;
}

const onSubmit = (data: FormData) => {
    console.log({ ...data, files });
    nextStep();
};

  return (
    <div className="space-y-6">
      {/* Progress Bar */}
      <div className="relative pt-1">
        <div className="flex mb-2 items-center justify-between">
          <div>
            <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-purple-600 bg-purple-200">
              {formSteps[formStep].title}
            </span>
          </div>
          <div className="text-right">
            <span className="text-xs font-semibold inline-block text-purple-600">
              {formSteps[formStep].progress}%
            </span>
          </div>
        </div>
        <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-purple-200">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${formSteps[formStep].progress}%` }}
            className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-purple-600"
          />
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <AnimatePresence mode="wait">
          {formStep === 0 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Current Pregnancy Week
                </label>
                <input
                  type="number"
                  {...register('pregnancyWeek', {
                    required: 'This field is required',
                    min: { value: 1, message: 'Must be at least 1' },
                    max: { value: 42, message: 'Must be less than 42' }
                  })}
                  className={`mt-1 block w-full rounded-lg border border-gray-200 text-gray-800 py-2 px-4 focus:ring-2 focus:ring-purple-400 focus:border-transparent ${
                    errors.pregnancyWeek ? 'border-red-300' : ''
                  }`}
                />
                {errors.pregnancyWeek && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mt-1 text-sm text-red-600"
                  >
                    {errors.pregnancyWeek.message as string}
                  </motion.p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Previous Pregnancies
                </label>
                <input
                  type="number"
                  {...register('previousPregnancies', {
                    required: 'This field is required',
                    min: { value: 0, message: 'Cannot be negative' }
                  })}
                  className={`mt-1 block w-full rounded-lg border border-gray-200 text-gray-800 py-2 px-4 focus:ring-2 focus:ring-purple-400 focus:border-transparent ${
                    errors.previousPregnancies ? 'border-red-300' : ''
                  }`}
                />
                {errors.previousPregnancies && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mt-1 text-sm text-red-600"
                  >
                    {errors.previousPregnancies.message as string}
                  </motion.p>
                )}
              </div>
            </motion.div>
          )}

          {formStep === 1 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Current Symptoms
                </label>
                <textarea
                  {...register('symptoms', {
                    required: 'Please describe your symptoms',
                    minLength: { value: 20, message: 'Please provide more detail' }
                  })}
                  rows={4}
                  className={`mt-1 block w-full rounded-lg border border-gray-200 text-gray-800 py-2 px-4 focus:ring-2 focus:ring-purple-400 focus:border-transparent ${
                    errors.symptoms ? 'border-red-300' : ''
                  }`}
                />
                {errors.symptoms && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mt-1 text-sm text-red-600"
                  >
                    {errors.symptoms.message as string}
                  </motion.p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Additional Concerns
                </label>
                <textarea
                  {...register('concerns')}
                  rows={4}
                  className="mt-1 block w-full rounded-lg border border-gray-200 text-gray-800 py-2 px-4 focus:ring-2 focus:ring-purple-400 focus:border-transparent"
                />
              </div>
            </motion.div>
          )}

          {formStep === 2 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Medical History
                </label>
                <textarea
                  {...register('medicalHistory', {
                    required: 'Please provide your medical history'
                  })}
                  rows={4}
                  className={`mt-1 block w-full rounded-lg border border-gray-200 text-gray-800 py-2 px-4 focus:ring-2 focus:ring-purple-400 focus:border-transparent ${
                    errors.medicalHistory ? 'border-red-300' : ''
                  }`}
                />
                {errors.medicalHistory && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mt-1 text-sm text-red-600"
                  >
                    {errors.medicalHistory.message as string}
                  </motion.p>
                )}
              </div>

              {/* File Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Upload USG Results (optional)
                </label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                  <div className="space-y-1 text-center">
                    <FiUpload className="mx-auto h-12 w-12 text-gray-400" />
                    <div className="flex text-sm text-gray-600">
                      <label className="relative cursor-pointer rounded-md font-medium text-purple-600 hover:text-purple-500">
                        <span>Upload files</span>
                        <input
                          type="file"
                          multiple
                          accept="image/*,.pdf"
                          onChange={handleFileUpload}
                          className="sr-only"
                        />
                      </label>
                    </div>
                    <p className="text-xs text-gray-500">
                      PNG, JPG, PDF up to 10MB
                    </p>
                  </div>
                </div>

                {/* File Preview */}
                {files.length > 0 && (
                  <div className="mt-4 space-y-2">
                    {files.map((file, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-2 bg-purple-50 rounded-md"
                      >
                        <span className="text-sm text-purple-600">
                          {file.name}
                        </span>
                        <button
                          type="button"
                          onClick={() => removeFile(index)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <FiX />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Navigation Buttons */}
        <div className="flex justify-between pt-6">
          <button
            type="button"
            onClick={formStep === 0 ? prevStep : () => setFormStep(prev => prev - 1)}
            className="px-6 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Back
          </button>
          
          {formStep < 2 ? (
            <button
              type="button"
              onClick={goToNext}
              className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              Next
            </button>
          ) : (
            <button
              type="submit"
              className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              Submit
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default ConsultationForm;