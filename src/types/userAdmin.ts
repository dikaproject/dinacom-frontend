export enum UserRole {
  ADMIN = 'ADMIN',
  USER = 'USER',
  DOCTOR = 'DOCTOR'
}

export interface UserAdmin {
  id: string;
  email: string;
  role: UserRole;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface UserAdminFormData {
  email: string;
  password: string;
  confirmPassword: string;
  role: UserRole;
  currentPassword?: string;
}
