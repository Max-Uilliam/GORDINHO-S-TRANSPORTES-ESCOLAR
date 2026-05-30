export type UserRole = 'driver' | 'guardian';

export interface Guardian {
  id: string;
  name: string;
  phone: string;
  address: string;
  cpf: string;
  email?: string;
  createdAt: string;
}

export interface Child {
  id: string;
  guardianId: string;
  name: string;
  school: string;
  shift: 'morning' | 'afternoon' | 'night';
  grade: string;
  photoUrl?: string;
  address: string;
  active: boolean;
  createdAt: string;
}

export interface Payment {
  id: string;
  childId: string;
  guardianId: string;
  referenceMonth: string; // 'YYYY-MM'
  dueDate: string;
  amount: number;
  status: 'paid' | 'pending' | 'overdue';
  paidAt?: string;
  notes?: string;
}

export interface AttendanceRecord {
  id: string;
  childId: string;
  date: string;
  status: 'present' | 'absent' | 'justified';
  notes?: string;
}

export type ActiveView =
  | 'dashboard'
  | 'students'
  | 'student-detail'
  | 'guardians'
  | 'guardian-detail'
  | 'payments'
  | 'attendance'
  | 'reports'
  | 'settings';
