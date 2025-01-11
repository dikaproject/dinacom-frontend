// Konsultasi.tsx
"use client"
import { useState, createContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm, FormProvider } from 'react-hook-form';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ConsultationData } from '@/types/consultation';
import MidtransStatus from './MidtransStatus';

// Step Components
import DoctorSelection from './DoctorSelection';
import ScheduleSelection from './ScheduleSelection';
import ConsultationForm from './ConsultationForm';
import PaymentSection from './PaymentSection';
import SuccessConfirmation from './SuccessConfirmation';
import PendingConfirmation from './PendingConfirmation';

const queryClient = new QueryClient();

// Context for consultation data
export const ConsultationContext = createContext({});

const Konsultasi = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [consultationData, setConsultationData] = useState<ConsultationData>({
    doctorId: '',
    doctorName: '',
    consultationFee: 0,
    type: 'OFFLINE',
    layananKesehatan: {
      id: '',
      name: '',
      district: ''
    }
  });

  const methods = useForm();

  interface StepProps {
    nextStep: () => void;
    prevStep: () => void;
  }

  const steps = [
    { number: 1, title: "Choose Doctor", component: DoctorSelection },
    { number: 2, title: "Schedule", component: ScheduleSelection },
    { number: 3, title: "Consultation Details", component: ConsultationForm },
    { number: 4, title: "Payment", component: PaymentSection },
    { 
      number: 5, 
      title: "Confirmation", 
      component: (props: StepProps) => {
        // For Midtrans payments that are complete
        if (consultationData.paymentMethod === 'MIDTRANS' && consultationData.paymentStatus === 'PAID') {
          return <SuccessConfirmation 
            consultation={{
              doctor: consultationData.doctorName,
              date: new Date(consultationData.schedule!).toLocaleDateString(),
              time: new Date(consultationData.schedule!).toLocaleTimeString(),
              location: consultationData.layananKesehatan.name,
              bookingId: consultationData.consultationId!,
              type: consultationData.type
            }}
            payment={{
              amount: consultationData.consultationFee,
              paymentMethod: 'Midtrans',
              transactionId: consultationData.transactionId!,
              paymentDate: new Date().toISOString()
            }}
          />;
        }
        
        // For manual payments (BANK_TRANSFER/QRIS)
        if (consultationData.paymentMethod === 'BANK_TRANSFER' || consultationData.paymentMethod === 'QRIS') {
          return <PendingConfirmation paymentDetails={{
            method: 'BANK_TRANSFER' as 'BANK_TRANSFER' | 'QRIS',
            amount: 0,
            bankInfo: undefined,
            qrisImage: undefined
          }} consultation={{
            doctor: '',
            date: '',
            time: '',
            location: '',
            type: 'ONLINE'
          }} {...props} />;
        }
        
        // Default to MidtransStatus for processing Midtrans payments
        return <MidtransStatus status="pending" />;
      }
    },
  ];

  const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, 5));
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1));

  return (
    <QueryClientProvider client={queryClient}>
      <ConsultationContext.Provider value={{ consultationData, setConsultationData }}>
        <FormProvider {...methods}>
          {/* Main Container with proper constraints */}
          <div className="relative min-h-screen w-full overflow-x-hidden bg-gray-50">
            {/* Content wrapper with proper spacing */}
            <div className="pt-28 md:pt-32 pb-20 px-4 sm:px-6 lg:px-8 mx-auto max-w-7xl">
              {/* Inner content container */}
              <div className="max-w-5xl mx-auto">
                {/* Progress Steps with responsive spacing */}
                <div className="mb-8 overflow-x-auto">
                  <div className="flex justify-between items-center min-w-max sm:min-w-0">
                    {steps.map((step) => (
                      <div key={step.number} className="flex flex-col items-center px-2 sm:px-0">
                        <motion.div
                          className={`w-10 h-10 rounded-full flex items-center justify-center ${
                            step.number <= currentStep
                              ? 'bg-purple-600 text-white'
                              : 'bg-gray-200 text-gray-500'
                          }`}
                          animate={{
                            scale: step.number === currentStep ? 1.1 : 1,
                            backgroundColor: step.number <= currentStep ? "#7C3AED" : "#E5E7EB"
                          }}
                        >
                          {step.number}
                        </motion.div>
                        <p className="mt-2 text-xs sm:text-sm font-medium text-gray-600 whitespace-nowrap">
                          {step.title}
                        </p>
                        {step.number < 5 && (
                          <div className="hidden sm:block absolute h-0.5 w-full bg-gray-200 -z-10">
                            <motion.div
                              className="h-full bg-purple-600"
                              initial={{ width: "0%" }}
                              animate={{
                                width: step.number < currentStep ? "100%" : "0%"
                              }}
                            />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Main Content Area with responsive padding */}
                <motion.div
                  className="bg-white rounded-2xl shadow-xl p-4 sm:p-6 lg:p-8 mb-12"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={currentStep}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.3 }}
                      className="w-full"
                    >
                      {steps.map((step) => 
                        step.number === currentStep && (
                          <step.component
                            key={step.number}
                            nextStep={nextStep}
                            prevStep={prevStep}
                          />
                        )
                      )}
                    </motion.div>
                  </AnimatePresence>
                </motion.div>
              </div>
            </div>
          </div>
        </FormProvider>
      </ConsultationContext.Provider>
    </QueryClientProvider>
  );
};

export default Konsultasi;