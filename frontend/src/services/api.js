import axios from 'axios';
import { clearUserData } from '../utils/auth';

const API_BASE_URL = 'http://localhost:8080/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle 401 unauthorized responses
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // If the 401 came from a login attempt, don't force a redirect back to /login
      // because that will cause the login page to fully reload when credentials are invalid.
      const requestUrl = error.config?.url || '';
      const isLoginRequest = requestUrl.includes('/auth/login');
      const isOnLoginPage = typeof window !== 'undefined' && window.location?.pathname === '/login';

      // Clear any stale user data regardless, but only navigate when it's not a login attempt
      // and we're not already on the login page.
      clearUserData();
      if (!isLoginRequest && !isOnLoginPage) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// Authentication
export const login = async (credentials) => {
  const response = await api.post('/auth/login', credentials);
  return response.data;
};

export const logout = () => {
  clearUserData();
  window.location.href = '/login';
};

// Clients
export const getClients = async () => {
  const response = await api.get('/admin/clients');
  return response.data;
};

export const getClient = async (id) => {
  const response = await api.get(`/admin/clients/${id}`);
  return response.data;
};

export const createClient = async (data) => {
  const response = await api.post('/admin/clients', data);
  return response.data;
};

export const updateClient = async (id, data) => {
  const response = await api.put(`/admin/clients/${id}`, data);
  return response.data;
};

// Vendors
export const getVendors = async () => {
  const response = await api.get('/admin/vendors');
  return response.data;
};

// Employees
export const getEmployees = async () => {
  const response = await api.get('/admin/employees');
  return response.data;
};

// Trips
export const getTrips = async () => {
  const response = await api.get('/admin/trips');
  return response.data;
};

// Billing
export const processBilling = async (vendorId, month, year) => {
  const response = await api.post(`/admin/billing/process/${vendorId}?month=${month}&year=${year}`);
  return response.data;
};

export const processAllBilling = async (month, year) => {
  const response = await api.post(`/admin/billing/process-all?month=${month}&year=${year}`);
  return response.data;
};

// Reports
export const getClientReport = async (clientId, month, year) => {
  const response = await api.get(`/reports/client/${clientId}?month=${month}&year=${year}`);
  return response.data;
};

export const getVendorReport = async (vendorId, month, year) => {
  const response = await api.get(`/reports/vendor/${vendorId}?month=${month}&year=${year}`);
  return response.data;
};

export const getEmployeeReport = async (employeeId, month, year) => {
  const response = await api.get(`/reports/employee/${employeeId}?month=${month}&year=${year}`);
  return response.data;
};

// Vendor/Employee self reports
export const getSelfVendorReport = async (month, year) => {
  const response = await api.get(`/reports/vendor/me?month=${month}&year=${year}`);
  return response.data;
};

export const getSelfEmployeeReport = async (month, year) => {
  const response = await api.get(`/reports/employee/me?month=${month}&year=${year}`);
  return response.data;
};

export default api;
