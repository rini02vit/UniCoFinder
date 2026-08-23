import axios from 'axios';
import { authApi } from '../../auth/services/authApi';

const apiClient = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const profileApi = {
  getProfile: async () => {
    try {
      const user = await authApi.getCurrentUser();
      return user;
    } catch (error) {
      console.error('Failed to fetch profile', error);
      throw error;
    }
  },

  updateProfile: async (formData) => {
    const payload = {
      name: `${formData.firstName || ''} ${formData.lastName || ''}`.trim(),
      cgpa: formData.gpa ? parseFloat(formData.gpa) : undefined,
      degree: formData.currentDegree || undefined,
      course: formData.preferredCourse || undefined,
      countryPreference: formData.targetCountries || undefined,
      budget: formData.tuitionBudget ? parseFloat(formData.tuitionBudget) : undefined,
      englishExam: formData.ielts ? 'IELTS' : (formData.toefl ? 'TOEFL' : (formData.duolingo ? 'Duolingo' : undefined)),
      examScore: formData.ielts ? parseFloat(formData.ielts) : (formData.toefl ? parseFloat(formData.toefl) : (formData.duolingo ? parseFloat(formData.duolingo) : undefined)),
    };
    
    // Remove undefined values
    Object.keys(payload).forEach(key => payload[key] === undefined && delete payload[key]);

    const res = await apiClient.put('/users/profile', payload);
    return res.data.data.user;
  }
};
