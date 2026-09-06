import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Request interceptor to attach JWT token if present
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('digiclear_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for centralized error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      console.warn('[DigiClear API] Unauthorized or session expired.');
    }
    return Promise.reject(error);
  }
);

// Auth API Calls
export const loginApi = async (email, password) => {
  const response = await api.post('/auth/login', { email, password });
  return response.data;
};

export const signupApi = async (userDetails) => {
  const response = await api.post('/auth/signup', userDetails);
  return response.data;
};

export const getMeApi = async () => {
  const response = await api.get('/auth/me');
  return response.data;
};

export const logoutApi = async () => {
  const response = await api.post('/auth/logout');
  return response.data;
};

export const checkServerHealth = async () => {
  const response = await api.get('/health');
  return response.data;
};

export const verifyCertificateApi = async (verificationCode) => {
  const response = await api.get(`/certificate/verify/${encodeURIComponent(verificationCode)}`);
  return response.data;
};

export const updateDepartmentStatusApi = async (requestId, status, reason) => {
  const response = await api.patch(`/department/requests/${requestId}/${status}`, { reason });
  return response.data;
};

export const getCurrentCertificateApi = async () => {
  const response = await api.get('/certificate/current');
  return response.data;
};

export default api;
