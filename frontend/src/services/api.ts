import axios, { AxiosResponse } from 'axios';
import type {
  LoginData,
  RegisterData,
  AuthResponse,
  Account,
  AccountBalance,
  Transaction,
  PaymentData,
  PaymentResponse,
  User,
} from '../types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://localhost:3443/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authAPI = {
  register: (data: RegisterData): Promise<AxiosResponse<AuthResponse>> => 
    api.post('/auth/register', data),
  login: (data: LoginData): Promise<AxiosResponse<AuthResponse>> => 
    api.post('/auth/login', data),
  getProfile: (): Promise<AxiosResponse<{ user: User }>> => 
    api.get('/auth/profile'),
};

export const accountsAPI = {
  getAccounts: (): Promise<AxiosResponse<{ accounts: Account[] }>> => 
    api.get('/accounts'),
  getAccount: (accountNumber: string): Promise<AxiosResponse<{ account: Account }>> => 
    api.get(`/accounts/${accountNumber}`),
  getBalance: (accountNumber: string): Promise<AxiosResponse<AccountBalance>> => 
    api.get(`/accounts/${accountNumber}/balance`),
};

export const paymentsAPI = {
  createPayment: (data: PaymentData): Promise<AxiosResponse<PaymentResponse>> => 
    api.post('/payments/international', data),
  getPaymentHistory: (): Promise<AxiosResponse<{ payments: Transaction[] }>> => 
    api.get('/payments'),
};

export const transactionsAPI = {
  getTransactions: (): Promise<AxiosResponse<{ transactions: Transaction[] }>> => 
    api.get('/transactions'),
};

export default api;