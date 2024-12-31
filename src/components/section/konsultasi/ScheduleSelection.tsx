// ScheduleSelection.tsx
"use client"
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMapPin, FiClock, FiCalendar } from 'react-icons/fi';

interface ScheduleSelectionProps {
  nextStep: () => void;
  prevStep: () => void;
}

const ScheduleSelection = ({ nextStep, prevStep }: ScheduleSelectionProps) => {
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [selectedLocation, setSelectedLocation] = useState('');

  // Mock data - replace with API call
  const locations = [
    { id: 1, name: 'PregnaCare Hospital - Jakarta Pusat' },
    { id: 2, name: 'PregnaCare Clinic - Jakarta Selatan' },
    { id: 3, name: 'PregnaCare Center - Jakarta Barat' },
  ];

  const timeSlots = [
    { time: '09:00', available: true },
    { time: '09:30', available: true },
    { time: '10:00', available: false },
    { time: '10:30', available: true },
    { time: '11:00', available: true },
    { time: '11:30', available: false },
    { time: '13:00', available: true },
    { time: '13:30', available: true },
    { time: '14:00', available: true },
    { time: '14:30', available: false },
    { time: '15:00', available: true },
    { time: '15:30', available: true },
  ];

  const handleContinue = () => {
    if (selectedDate && selectedTime && selectedLocation) {
      nextStep();
    }
  };

  return (
    <div className="space-y-8">
      {/* Location Selection */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-800">
          Select Location
        </h3>
        <div className="relative">
          <FiMapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-800" />
          <select
            value={selectedLocation}
            onChange={(e) => setSelectedLocation(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-400"
          >
            <option value="">Select a location</option>
            {locations.map(location => (
              <option key={location.id} value={location.id}>
                {location.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Date Selection */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-800">
          Select Date
        </h3>
        <div className="relative">
          <FiCalendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 z-10" />
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            min={new Date().toISOString().split('T')[0]}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-400"
          />
        </div>
      </div>

      {/* Time Slots */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-800">
          Select Time
        </h3>
        <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {timeSlots.map((slot) => (
            <motion.button
              key={slot.time}
              whileHover={{ scale: slot.available ? 1.05 : 1 }}
              whileTap={{ scale: slot.available ? 0.95 : 1 }}
              onClick={() => slot.available && setSelectedTime(slot.time)}
              className={`
                p-3 rounded-lg flex items-center justify-center
                ${slot.available 
                  ? selectedTime === slot.time
                    ? 'bg-purple-600 text-white'
                    : 'bg-white border border-gray-200 text-gray-800 hover:border-purple-400'
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                }
              `}
            >
              <FiClock className={`mr-2 ${
                selectedTime === slot.time 
                  ? 'text-white' 
                  : slot.available 
                    ? 'text-gray-600'  
                    : 'text-gray-400'
              }`} />
              {slot.time}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Selected Schedule Summary */}
      <AnimatePresence>
        {selectedDate && selectedTime && selectedLocation && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="p-4 bg-purple-50 rounded-lg border border-purple-100"
          >
            <h4 className="font-medium text-purple-800 mb-2">
              Selected Schedule
            </h4>
            <p className="text-purple-600">
              {selectedDate} at {selectedTime}
            </p>
            <p className="text-purple-600">
              {locations.find(l => l.id === Number(selectedLocation))?.name}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Navigation Buttons */}
      <div className="flex justify-between pt-6">
        <button
          onClick={prevStep}
          className="px-6 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors"
        >
          Back
        </button>
        <button
          onClick={handleContinue}
          disabled={!selectedDate || !selectedTime || !selectedLocation}
          className={`
            px-6 py-2 rounded-lg transition-colors
            ${selectedDate && selectedTime && selectedLocation
              ? 'bg-purple-600 text-white hover:bg-purple-700'
              : 'bg-gray-100 text-gray-400 cursor-not-allowed'
            }
          `}
        >
          Continue
        </button>
      </div>
    </div>
  );
};

export default ScheduleSelection;