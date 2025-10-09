// User types
export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  accountNumber?: string;
  idNumber?: string;
  lastLogin?: Date;
}

// Auth types
export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  idNumber: string;
  accountNumber: string;
}

export interface AuthResponse {
  message: string;
  token: string;
  user: User;
}

// Account types
export interface Account {
  _id: string;
  accountNumber: string;
  accountType: 'checking' | 'savings' | 'business';
  balance: number;
  currency: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface AccountBalance {
  accountNumber: string;
  balance: number;
  currency: string;
}

// Transaction types
export interface Transaction {
  _id: string;
  transactionId: string;
  type: 'deposit' | 'withdrawal' | 'transfer' | 'payment' | 'fee';
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled';
  fromAccount?: string;
  toAccount?: string;
  amount: number;
  currency: string;
  description?: string;
  reference?: string;
  recipientName?: string;
  recipientBank?: string;
  swiftCode?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Payment types
export interface PaymentData {
  fromAccount: string;
  recipientName: string;
  recipientAccount: string;
  recipientBank: string;
  amount: number;
  currency: string;
  swiftCode: string;
  reference?: string;
  description?: string;
}

export interface PaymentResponse {
  message: string;
  transaction: Transaction;
}

// API Error type
export interface ApiError {
  error: string;
  details?: string[];
}