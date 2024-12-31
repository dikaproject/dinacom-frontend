// DoctorSelection.tsx
"use client"
import { useState } from 'react';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import Image from 'next/image';
import { FiSearch, FiFilter, FiClock, FiStar } from 'react-icons/fi';

// Mock data - replace with API call
const mockDoctors = [
  {
    id: 1,
    name: "Dr. Sarah Johnson",
    specialization: "Obstetrics & Gynecology",
    experience: "15 years",
    rating: 4.8,
    available: true,
    image: "/doctors/doctor1.jpg",
    nextAvailable: "Today",
  },
  // Add more mock doctors...
];

interface DoctorSelectionProps {
  nextStep: () => void;
}

const DoctorSelection = ({ nextStep }: DoctorSelectionProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpecialization, setSelectedSpecialization] = useState('all');
  const [selectedDoctor, setSelectedDoctor] = useState<typeof mockDoctors[0] | null>(null);

  // Fetch doctors - replace with actual API call
  const { data: doctors, isLoading } = useQuery({
    queryKey: ['doctors'],
    queryFn: () => Promise.resolve(mockDoctors),
  });

  const specializations = [
    'all',
    'Obstetrics & Gynecology',
    'Maternal-Fetal Medicine',
    'Pediatrics',
  ];

  const filteredDoctors = doctors?.filter(doctor => {
    const matchesSearch = doctor.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSpecialization = selectedSpecialization === 'all' || 
      doctor.specialization === selectedSpecialization;
    return matchesSearch && matchesSpecialization;
  });

  const handleDoctorSelect = (doctor: typeof mockDoctors[0]) => {
    setSelectedDoctor(doctor);
    setTimeout(nextStep, 500);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        {/* Search Bar */}
        <div className="relative flex-1">
          <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search doctors..."
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-400"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Specialization Filter */}
        <div className="relative">
          <FiFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <select
            className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 appearance-none bg-white"
            value={selectedSpecialization}
            onChange={(e) => setSelectedSpecialization(e.target.value)}
          >
            {specializations.map(spec => (
              <option key={spec} value={spec}>
                {spec === 'all' ? 'All Specializations' : spec}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Doctor Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => (
            <div key={i} className="animate-pulse">
              <div className="bg-gray-200 h-48 rounded-t-lg" />
              <div className="p-4 space-y-3 bg-white rounded-b-lg">
                <div className="h-4 bg-gray-200 rounded w-3/4" />
                <div className="h-4 bg-gray-200 rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDoctors?.map(doctor => (
            <motion.div
              key={doctor.id}
              layout
              whileHover={{ y: -4 }}
              onClick={() => handleDoctorSelect(doctor)}
              className={`cursor-pointer rounded-lg overflow-hidden border ${
                selectedDoctor?.id === doctor.id 
                  ? 'border-purple-500 ring-2 ring-purple-500' 
                  : 'border-gray-200 hover:border-purple-200'
              }`}
            >
              <div className="relative h-48">
                <Image
                  src={doctor.image}
                  alt={doctor.name}
                  fill
                  className="object-cover"
                />
                {doctor.available && (
                  <div className="absolute top-4 right-4 bg-green-500 text-white text-xs px-2 py-1 rounded-full flex items-center">
                    <FiClock className="mr-1" />
                    Available {doctor.nextAvailable}
                  </div>
                )}
              </div>
              
              <div className="p-4 bg-white">
                <h3 className="font-semibold text-lg text-gray-800">
                  {doctor.name}
                </h3>
                <p className="text-purple-600 text-sm">
                  {doctor.specialization}
                </p>
                <div className="mt-2 flex items-center justify-between">
                  <span className="text-gray-600 text-sm">
                    {doctor.experience} experience
                  </span>
                  <div className="flex items-center text-yellow-500">
                    <FiStar className="w-4 h-4 fill-current" />
                    <span className="ml-1 text-sm">{doctor.rating}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DoctorSelection;