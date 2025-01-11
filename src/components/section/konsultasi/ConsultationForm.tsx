"use client"

import { useState, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { ConsultationContext } from './Konsultasi';
import { ConsultationContextType } from '@/types/consultation';
import { consultationService } from '@/services/consultation';
import { toast } from 'react-hot-toast';

interface ConsultationFormProps {
  nextStep: () => void;
  prevStep: () => void;
}

interface FormInputs {
  pregnancyWeek: number;
  previousPregnancies: number;
  symptoms: string;
  concerns: string;
}

const formSteps = [
  {
    title: 'Basic Information',
    description: 'Tell us about your pregnancy'
  },
  {
    title: 'Symptoms & Concerns',
    description: 'Share your current condition'
  }
];

const ConsultationForm = ({ nextStep, prevStep }: ConsultationFormProps) => {
  const [formStep, setFormStep] = useState(0);
  const { consultationData, setConsultationData } = useContext(ConsultationContext) as ConsultationContextType;

  const {
    register,
    handleSubmit,
    trigger,
    formState: { errors }
  } = useForm<FormInputs>({
    defaultValues: {
      pregnancyWeek: 1,
      previousPregnancies: 0,
      symptoms: '',
      concerns: ''
    }
  });

  const goToNext = async () => {
    const fields = formStep === 0 
      ? ['pregnancyWeek', 'previousPregnancies'] as const
      : ['symptoms'] as const;

    const isValid = await trigger(fields);
    if (isValid) {
      setFormStep(prev => prev + 1);
    }
  };

  const onSubmit = async (data: FormInputs) => {
    try {
      const response = await consultationService.createConsultation({
        doctorId: consultationData.doctorId,
        schedule: consultationData.schedule!,
        type: consultationData.type!,
        pregnancyWeek: data.pregnancyWeek,
        previousPregnancies: data.previousPregnancies,
        symptoms: data.symptoms,
        concerns: data.concerns || ''
      });
  
      // Update consultation context with ID
      setConsultationData({
        ...consultationData,
        consultationId: response.consultationId
      });
  
      toast.success('Consultation request submitted successfully');
      nextStep();
    } catch (error) {
      toast.error('Failed to submit consultation request');
      console.error(error);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      {/* Doctor Info */}
      <div className="p-4 bg-purple-50 rounded-lg">
        <h3 className="font-medium text-purple-800 mb-2">
          Consultation with Dr. {consultationData.doctorName}
        </h3>
        <p className="text-purple-600 text-sm">
          {consultationData.type === 'ONLINE' ? 'Online Consultation' : 'Hospital Visit'}
        </p>
      </div>

      {/* Progress Steps */}
      <div className="relative">
        <div className="flex justify-between mb-4">
          {formSteps.map((step, index) => (
            <div
              key={step.title}
              className={`flex-1 ${index !== formSteps.length - 1 ? 'mr-2' : ''}`}
            >
              <div className="relative flex items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    formStep >= index
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-200 text-gray-500'
                  }`}
                >
                  {index + 1}
                </div>
                <div className="flex-1 ml-4">
                  <p className={`font-medium ${
                    formStep >= index ? 'text-purple-600' : 'text-gray-500'
                  }`}>
                    {step.title}
                  </p>
                  <p className="text-sm text-gray-400">{step.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <AnimatePresence mode="wait">
          {formStep === 0 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Current Pregnancy Week
                </label>
                <input
                  type="number"
                  {...register('pregnancyWeek', {
                    required: 'Please enter your current pregnancy week',
                    min: { value: 1, message: 'Week must be at least 1' },
                    max: { value: 42, message: 'Week cannot exceed 42' }
                  })}
                  className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-transparent"
                  placeholder="Enter week (1-42)"
                />
                {errors.pregnancyWeek && (
                  <p className="mt-1 text-red-500 text-sm">{errors.pregnancyWeek.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Previous Pregnancies
                </label>
                <input
                  type="number"
                  {...register('previousPregnancies', {
                    required: 'Please enter number of previous pregnancies',
                    min: { value: 0, message: 'Cannot be negative' }
                  })}
                  className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-transparent"
                  placeholder="Enter number"
                />
                {errors.previousPregnancies && (
                  <p className="mt-1 text-red-500 text-sm">{errors.previousPregnancies.message}</p>
                )}
              </div>
            </motion.div>
          )}

          {formStep === 1 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Current Symptoms
                </label>
                <textarea
                  {...register('symptoms', {
                    required: 'Please describe your current symptoms'
                  })}
                  className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-transparent h-32"
                  placeholder="Describe any symptoms you're experiencing..."
                />
                {errors.symptoms && (
                  <p className="mt-1 text-red-500 text-sm">{errors.symptoms.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Additional Concerns (Optional)
                </label>
                <textarea
                  {...register('concerns')}
                  className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-transparent h-32"
                  placeholder="Any other concerns you'd like to discuss..."
                />
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
          
          {formStep < 1 ? (
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