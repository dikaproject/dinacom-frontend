"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FiCalendar } from "react-icons/fi";
import { toast } from "react-hot-toast";
import { format } from "date-fns";
import DashboardSkeleton from "@/components/loading/DashboardSkeleton";
import { doctorService } from "@/services/doctor";

interface Patient {
  id: string;
  profile: {
    fullName: string;
    pregnancyWeek: number;
  };
  consultations: {
    id: string;
    schedule: string;
    status: string;
    type: string;
  }[];
}

export default function PatientsPage() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    try {
      setLoading(true);
      const data = await doctorService.getPatients();
      setPatients(data);
    } catch (error) {
      console.error('Failed to fetch patients:', error);
      toast.error("Failed to fetch patients");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <DashboardSkeleton />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-purple-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">My Patients</h1>
        
        <div className="grid grid-cols-1 gap-6">
          {patients.map((patient) => (
            <motion.div
              key={patient.id}
              whileHover={{ y: -2 }}
              className="bg-white rounded-xl shadow-sm border border-purple-100 p-6"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">
                    {patient.profile.fullName}
                  </h2>
                  <p className="text-sm text-gray-600 mt-1">
                    Pregnancy Week: {patient.profile.pregnancyWeek}
                  </p>
                </div>
                <span className="px-3 py-1 text-xs font-medium rounded-full bg-purple-100 text-purple-800">
                  {patient.consultations.length} Consultations
                </span>
              </div>

              <div className="mt-4">
                <h3 className="text-sm font-medium text-gray-900 mb-2">
                  Recent Consultations
                </h3>
                <div className="space-y-3">
                  {patient.consultations.slice(0, 3).map((consultation) => (
                    <div
                      key={consultation.id}
                      className="flex items-center justify-between text-sm bg-gray-50 rounded-lg p-3"
                    >
                      <div className="flex items-center space-x-3">
                        <FiCalendar className="text-purple-600" />
                        <span>{format(new Date(consultation.schedule), 'PPp')}</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium
                          ${consultation.status === 'COMPLETED' ? 'bg-green-100 text-green-800' : 
                            consultation.status === 'CANCELLED' ? 'bg-red-100 text-red-800' : 
                            'bg-yellow-100 text-yellow-800'}`}
                        >
                          {consultation.status}
                        </span>
                        <span className="text-gray-500">
                          {consultation.type}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}