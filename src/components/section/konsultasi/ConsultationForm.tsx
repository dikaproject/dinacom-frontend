"use client"

import { useContext, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { ConsultationContext } from './Konsultasi';
import { ConsultationContextType } from '@/types/consultation';
import { consultationService } from '@/services/consultation';
import { pregnancyService } from '@/services/pregnancy';
import { toast } from 'react-hot-toast';
import { useAuth } from '@/hooks/useAuth';

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

const ConsultationForm = ({ nextStep, prevStep }: ConsultationFormProps) => {
  const router = useRouter();
  const { user } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { consultationData, setConsultationData } = useContext(ConsultationContext) as ConsultationContextType;

  useEffect(() => {
    fetchPregnancyProfile();
  }, []);

  const fetchPregnancyProfile = async () => {
    try {
      const data = await pregnancyService.getProfile();
      setProfile(data?.profile);
    } catch (error) {
      toast.error('Failed to fetch pregnancy profile');
    } finally {
      setIsLoading(false);
    }
  };

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<FormInputs>({
    defaultValues: {
      pregnancyWeek: profile?.pregnancyWeek || 0,
      previousPregnancies: profile?.previousPregnancies || 0,
      symptoms: '',
      concerns: ''
    }
  });

  const onSubmit = async (data: FormInputs) => {
    try {
      if (!profile?.pregnancyWeek) {
        toast.error('Pregnancy profile data is required');
        return;
      }

      const response = await consultationService.createConsultation({
        doctorId: consultationData.doctorId,
        schedule: consultationData.schedule!,
        type: consultationData.type!,
        pregnancyWeek: profile.pregnancyWeek,
        previousPregnancies: profile.previousPregnancies || 0,
        symptoms: data.symptoms,
        concerns: data.concerns || ''
      });
  
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

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="text-gray-600">Loading profile data...</div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600">Please complete your pregnancy profile first</p>
        <button
          onClick={() => router.push('/dashboard/profile')}
          className="mt-4 px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
        >
          Complete Profile
        </button>
      </div>
    );
  }

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

      {/* Pregnancy Info (Read-only) */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <h3 className="font-medium text-gray-700 mb-2">Pregnancy Information</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-500">Current Week</p>
            <p className="font-medium text-gray-700">{profile.pregnancyWeek || '-'}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Previous Pregnancies</p>
            <p className="font-medium">{profile.previousPregnancies || '-'}</p>
          </div>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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

        {/* Navigation */}
        <div className="flex justify-between pt-6">
          <button
            type="button"
            onClick={prevStep}
            className="px-6 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Back
          </button>
          
          <button
            type="submit"
            className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default ConsultationForm;