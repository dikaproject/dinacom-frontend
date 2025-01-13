export enum UserRole {
    ADMIN = 'ADMIN',
    USER = 'USER',
    DOCTOR = 'DOCTOR'
}

export interface PatientProfile {
    id: string;
    userId: string;
    fullName: string;
    dateOfBirth: Date;
    phoneNumber: string;
    reminderTime: Date;
    address: string;
    bloodType?: string;
    height?: number;
    pregnancyStartDate: Date;
    dueDate: Date;
    pregnancyWeek: number;
    trimester: 'FIRST_TRIMESTER' | 'SECOND_TRIMESTER' | 'THIRD_TRIMESTER';
    photoProfile?: string;
}

export interface PatientFormData {
    email: string;
    password: string;
    profile: {
        fullName: string;
        dateOfBirth: string;
        phoneNumber: string;
        reminderTime: string;
        address: string;
        bloodType?: string;
        height?: number;
        pregnancyStartDate: string;
    };
    photoProfile?: File;
}

export interface Patient {
    id: string;
    email: string;
    role: UserRole;
    profile: PatientProfile;
    createdAt: string;
    updatedAt: string;
}