"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FiSearch, FiCalendar, FiFileText } from "react-icons/fi";
import { toast } from "react-hot-toast";
import { format } from "date-fns";
import { doctorService } from "@/services/doctor";

interface MedicalRecord {
  id: string;
  consultationId: string;
  schedule: string;
  patientName: string;
  pregnancyWeek: number;
  diagnosis: string;
  notes: string;
  status: string;
}

export default function MedicalRecordsPage() {
  const [records, setRecords] = useState<MedicalRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchMedicalRecords();
  }, []);

  const fetchMedicalRecords = async () => {
    try {
      const patients = await doctorService.getPatients();
      const allRecords: MedicalRecord[] = [];

      for (const patient of patients) {
        const consultations = patient.consultations.map(consultation => ({
          id: consultation.id,
          consultationId: consultation.id,
          schedule: consultation.schedule,
          patientName: patient.profile.fullName,
          pregnancyWeek: patient.profile.pregnancyWeek,
          diagnosis: "Pregnancy Progress Review",
          notes: "Regular checkup",
          status: consultation.status
        }));
        allRecords.push(...consultations);
      }

      setRecords(allRecords);
    } catch (error) {
      console.error("Failed to fetch medical records:", error);
      toast.error("Failed to fetch medical records");
    } finally {
      setLoading(false);
    }
  };

  const filteredRecords = records.filter(record => 
    record.patientName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-purple-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Medical Records</h1>
          <div className="relative">
            <input
              type="text"
              placeholder="Search patient..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <FiSearch className="absolute left-3 top-3 text-gray-400" />
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600"></div>
          </div>
        ) : filteredRecords.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-purple-100 p-8 text-center">
            <p className="text-gray-500">No medical records found</p>
          </div>
        ) : (
          <div className="grid gap-6">
            {filteredRecords.map((record) => (
              <motion.div
                key={record.id}
                whileHover={{ y: -2 }}
                className="bg-white rounded-xl shadow-sm border border-purple-100 p-6"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {record.patientName}
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">
                      Pregnancy Week: {record.pregnancyWeek}
                    </p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium
                    ${record.status === 'COMPLETED' ? 'bg-green-100 text-green-800' : 
                      record.status === 'CANCELLED' ? 'bg-red-100 text-red-800' : 
                      'bg-yellow-100 text-yellow-800'}`}
                  >
                    {record.status}
                  </span>
                </div>

                <div className="mt-4 space-y-3">
                  <div className="flex items-center text-sm text-gray-500">
                    <FiCalendar className="w-4 h-4 mr-2" />
                    {format(new Date(record.schedule), 'PPpp')}
                  </div>
                  <div className="flex items-start text-sm text-gray-500">
                    <FiFileText className="w-4 h-4 mr-2 mt-1" />
                    <div>
                      <p className="font-medium">Diagnosis:</p>
                      <p>{record.diagnosis}</p>
                      <p className="font-medium mt-2">Notes:</p>
                      <p>{record.notes}</p>
                    </div>
                  </div>
                </div>

                <div className="mt-4 flex justify-end">
                  <button
                    onClick={() => {
                      window.location.href = `/doctor/consultations/${record.consultationId}/chat`;
                    }}
                    className="px-4 py-2 text-purple-600 hover:text-purple-700 font-medium text-sm"
                  >
                    View Consultation Chat
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}