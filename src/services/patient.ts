import api from './api';
import { Patient, PatientFormData } from '@/types/patient';

// Helper function to calculate trimester
function calculateTrimester(startDate: Date): 'FIRST_TRIMESTER' | 'SECOND_TRIMESTER' | 'THIRD_TRIMESTER' {
    const pregnancyWeek = Math.floor((new Date().getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24 * 7));
    
    if (pregnancyWeek <= 12) return 'FIRST_TRIMESTER';
    if (pregnancyWeek <= 26) return 'SECOND_TRIMESTER';
    return 'THIRD_TRIMESTER';
}

export const patientService = {
    getAll: async (): Promise<Patient[]> => {
        const response = await api.get('/patients-admin/patients');
        return response.data;
    },

    getById: async (id: string): Promise<Patient> => {
        const response = await api.get(`/patients-admin/patients/${id}`);
        return response.data;
    },

    create: async (data: PatientFormData): Promise<Patient> => {
        const formData = new FormData();
        
        // Basic user data
        formData.append('email', data.email);
        formData.append('password', data.password);
        
        // Format profile data
        const profileData = {
            fullName: data.profile.fullName,
            dateOfBirth: new Date(data.profile.dateOfBirth).toISOString(),
            phoneNumber: data.profile.phoneNumber,
            reminderTime: data.profile.reminderTime,
            address: data.profile.address,
            bloodType: data.profile.bloodType,
            height: data.profile.height,
            pregnancyStartDate: new Date(data.profile.pregnancyStartDate).toISOString(),
            // Calculate dueDate and pregnancyWeek
            dueDate: new Date(new Date(data.profile.pregnancyStartDate).setDate(new Date(data.profile.pregnancyStartDate).getDate() + 280)).toISOString(),
            pregnancyWeek: Math.floor((new Date().getTime() - new Date(data.profile.pregnancyStartDate).getTime()) / (1000 * 60 * 60 * 24 * 7)),
            // Calculate trimester
            trimester: calculateTrimester(new Date(data.profile.pregnancyStartDate))
        };

        formData.append('profile', JSON.stringify(profileData));

        if (data.photoProfile) {
            formData.append('photoProfile', data.photoProfile);
        }

        const response = await api.post('/patients-admin/patients', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    },

    update: async (id: string, data: Partial<PatientFormData>): Promise<Patient> => {
        const formData = new FormData();

        if (data.email) formData.append('email', data.email);
        if (data.password) formData.append('password', data.password);
        if (data.profile) formData.append('profile', JSON.stringify(data.profile));
        if (data.photoProfile) formData.append('photoProfile', data.photoProfile);

        const response = await api.put(`/patients-admin/patients/${id}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    },

    delete: async (id: string): Promise<void> => {
        await api.delete(`/patients-admin/patients/${id}`);
    },
};