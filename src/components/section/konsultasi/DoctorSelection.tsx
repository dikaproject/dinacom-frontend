"use client"

import { useState, useContext } from 'react';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import Image from 'next/image';
import { FiSearch, FiFilter, FiClock, FiStar, FiMapPin } from 'react-icons/fi';
import { consultationService } from '@/services/consultation';
import { ConsultationContext } from './Konsultasi';
import {  Doctor, ConsultationContextType } from '@/types/consultation';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
interface DoctorSelectionProps {
  nextStep: () => void;
}

const DoctorSelection = ({ nextStep }: DoctorSelectionProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpecialization, setSelectedSpecialization] = useState('all');
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const { setConsultationData } = useContext(ConsultationContext) as ConsultationContextType;
  const { user } = useAuth();
  const router = useRouter();

  const { 
    data: doctors = [], 
    isLoading, 
    isError,
    error 
  } = useQuery({
    queryKey: ['doctors'],
    queryFn: consultationService.getDoctors,
    staleTime: 5 * 60 * 1000,
    retry: 2, // Add retry attempts
  });

  // Add loading state
  if (isLoading) {
    return <div className="text-center py-10">Loading doctors...</div>;
  }

  // Add error state
  if (isError) {
    return (
      <div className="text-center py-10 text-red-500">
        Error loading doctors. Please try again later.
        {error instanceof Error && <p>{error.message}</p>}
      </div>
    );
  }

  const specializations = [
    'all',
    'Obstetrics & Gynecology',
    'Maternal-Fetal Medicine',
    'Pediatrics',
  ];

  const getImageUrl = (imagePath: string | null | undefined) => {
    if (!imagePath) {
      return '/images/default-doctor.png'; // Add a default image path
    }

    if (imagePath.startsWith('http')) {
      return imagePath;
    }

    // Handle relative paths
    if (!imagePath.startsWith('/')) {
      return `${process.env.NEXT_PUBLIC_API_URL}/uploads/profiles/${imagePath}`; // Add leading slash and uploads directory
    }

    return `${process.env.NEXT_PUBLIC_API_URL}${imagePath}`;
  };

  const filteredDoctors = doctors?.filter(doctor => {
    const matchesSearch = doctor.fullName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSpecialization = selectedSpecialization === 'all' || 
      doctor.specialization === selectedSpecialization;
    return matchesSearch && matchesSpecialization;
  });

  const handleDoctorSelect = (doctor: Doctor) => {
    if (!user) {
      toast.error('Please login to continue');
      router.push('/login');
      return;
    }
    
    setSelectedDoctor(doctor);
    setConsultationData({
      doctorId: doctor.id,
      doctorName: doctor.fullName,
      consultationFee: doctor.consultationFee,
      layananKesehatan: doctor.layananKesehatan
    });
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
      src={getImageUrl(doctor.image)}
      alt={doctor.fullName}
      fill
      className="object-cover"
    />
              {doctor.available && (
                <div className="absolute top-4 right-4 bg-green-500 text-white text-xs px-2 py-1 rounded-full flex items-center">
                  <FiClock className="mr-1" />
                  Available
                </div>
              )}
            </div>
            
            <div className="p-4 bg-white">
              <h3 className="font-semibold text-lg text-gray-800">
                {doctor.fullName}
              </h3>
              <p className="text-purple-600 text-sm">
                {doctor.specialization}
              </p>
              <div className="mt-2 flex items-center text-gray-600 text-sm">
                <FiMapPin className="w-4 h-4 mr-1" />
                {doctor.layananKesehatan.name} - {doctor.layananKesehatan.district}
              </div>
              <div className="mt-2 flex items-center justify-between">
                <span className="text-gray-600 text-sm">
                  {doctor.experience} experience
                </span>
                <div className="flex items-center text-yellow-500">
                  <FiStar className="w-4 h-4 fill-current" />
                  <span className="ml-1 text-sm">{doctor.rating}</span>
                </div>
              </div>
              <div className="mt-2 text-right text-purple-600 font-medium">
                Rp {doctor.consultationFee.toLocaleString()}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {filteredDoctors?.length === 0 && (
        <div className="text-center py-10">
          <p className="text-gray-500">No doctors found matching your criteria</p>
        </div>
      )}
    </div>
  );
};

export default DoctorSelection;