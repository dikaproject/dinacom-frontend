export type BloodType = 'A+' | 'A-' | 'B+' | 'B-' | 'O+' | 'O-' | 'AB+' | 'AB-' | '';
export type Trimester = 'FIRST_TRIMESTER' | 'SECOND_TRIMESTER' | 'THIRD_TRIMESTER';

export interface PregnancyProfile {
  email: string;
  photoUrl: string;
  id?: string;
  fullName: string;
  photoProfile?: string | File; 
  dateOfBirth: string;
  phoneNumber: string;
  reminderTime?: string;
  address: string;
  user?: {
    email: string;
    role: string;
  };
  bloodType?: BloodType;
  height?: string;
  dueDate: string;
  pregnancyStartDate: string;
  pregnancyWeek?: number;
  trimester?: Trimester;
  isWhatsappActive?: boolean;
}

export interface DailyCheckup {
  id?: string;
  date?: string;
  weight: number;
  bloodPressure?: string;
  mood: string;
  sleepHours: number;
  waterIntake: number;
  symptoms?: string[];
  notes?: string;
  createdAt: string;
}

export interface NutritionLog {
  id?: string;
  profileId: string;
  date: Date;
  mealType: 'BREAKFAST' | 'LUNCH' | 'DINNER' | 'SNACK';
  foodItems: string[];
  portions: number[];
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  notes?: string;
  createdAt?: Date;
}

export interface NutritionAnalysis {
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  explanation: string;
}
export interface ExerciseLog {
  id?: string;
  date?: string;
  activityType: string;
  customActivity?: string; // Add this
  duration: number;
  intensity: string;
  heartRate?: number;
  notes?: string;
  createdAt?: string;
}

export interface AIRecommendation {
  type: string;
  week: number;
  trimester: Trimester;
  recommendation: string;
  analysis: string;
  message: string;
}

export interface AIAnalysis {
  type: 'free' | 'pro';
  analysis: string;
  recommendation: {
    nutrition: string;
    exercise: string;
    health: string;
    nextSteps: string;
  };
  lastAnalysis?: Date;
  remainingUsage: number;
}

export interface AnalyzeStatus {
  remainingFree: number;
  lastProAnalysis: string | null;
  canUsePro: boolean;
}

export interface PregnancyResponse {
  message: string;
  profile: PregnancyProfile;
  reminderTime: string;
  isWhatsappActive: boolean;
}

export interface ReminderSettings {
  isWhatsappActive: boolean;
  reminderTime: string;
}

export interface ProfileUpdateData {
  fullName: string;
  email: string;
  phoneNumber: string;
  address?: string;
}

export interface PasswordUpdateData {
  currentPassword: string;
  newPassword: string;
}

export interface UpdateResponse {
  success: boolean;
  message: string;
  user?: ProfileUpdateData;
}

export interface HealthInsightResponse {
  success: boolean;
  analysis: {
    overallStatus: string;
    nutritionAnalysis: string;
    nutritionRecommendations: string[];
    exerciseEvaluation: string;
    exerciseSuggestions: string[];
    warningSignsToWatch: string[];
    weeklyRecommendations: string[];
    currentWeek: number;
  };
}

export interface AIResponse {
  success: boolean;
  analysis: {
    weeklyRecommendations: string[];
    nutritionRecommendations: string[];
    exerciseSuggestions: string[];
  };
}