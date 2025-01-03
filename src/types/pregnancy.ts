export type BloodType = 'A+' | 'A-' | 'B+' | 'B-' | 'O+' | 'O-' | 'AB+' | 'AB-' | '';
export type Trimester = 'FIRST_TRIMESTER' | 'SECOND_TRIMESTER' | 'THIRD_TRIMESTER';

export interface PregnancyProfile {
  id?: string;
  fullName: string;
  dateOfBirth: string;
  phoneNumber: string;
  reminderTime: string;
  address: string;
  bloodType?: BloodType;
  height?: string;
  dueDate: string;
  pregnancyStartDate: string;
  pregnancyWeek?: number;
  trimester?: Trimester;
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
  createdAt?: string;
}

export interface NutritionLog {
  mealType: string;
  foodItems: string[];
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFat: number;
  totalFolate: number;
  totalIron: number;
}

export interface ExerciseLog {
  activityType: string;
  duration: number;
  intensity: string;
  heartRate?: number;
  notes?: string;
}

export interface AIRecommendation {
  type: string;
  week: number;
  trimester: Trimester;
  recommendation: string;
  analysis: string;
  message: string;
}

export interface PregnancyResponse {
  message: string;
  profile: PregnancyProfile;
}