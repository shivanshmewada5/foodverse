import axios from 'axios';

const API_BASE = '/api';

const api = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach JWT token to requests if present
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('foodverse_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Authentication
export const authAPI = {
  login: (email, password) => api.post('/auth/login', { email, password }),
  register: (email, password, full_name) => api.post('/auth/register', { email, password, full_name }),
  demoLogin: () => api.post('/auth/demo-login'),
  getMe: () => api.get('/auth/me'),
  updateProfile: (profileData) => api.put('/auth/me', profileData),
};

// AI Food Recognition
export const foodAPI = {
  analyzeImage: (formData) => api.post('/food-recognition/analyze', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
};

// AI Nutrition Analysis
export const nutritionAPI = {
  analyzeNutrition: (food_name, portion_grams, image_url) =>
    api.post('/nutrition/analyze', { food_name, portion_grams, image_url }),
};

// Food Freshness Detection
export const freshnessAPI = {
  analyzeFreshness: (formData) => api.post('/freshness/analyze', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
};

// Restaurant Kitchen Hygiene
export const hygieneAPI = {
  analyzeVideo: (formData) => api.post('/hygiene/analyze-video', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
};

// Smart Cooking Assistant
export const recipeAPI = {
  generateRecipes: (params) => api.post('/recipes/generate', params),
  getSaved: () => api.get('/recipes/saved'),
  saveRecipe: (recipe) => api.post('/recipes/save', recipe),
};

// AI Food Chat
export const chatAPI = {
  sendMessage: (message, history, currentRecipeContext) =>
    api.post('/chat/message', {
      message,
      conversation_history: history || [],
      current_recipe_context: currentRecipeContext || null,
    }),
};

// Meal Planning
export const mealPlanAPI = {
  generatePlan: (params) => api.post('/meal-plans/generate', params),
  getLatest: () => api.get('/meal-plans/latest'),
};

// History & Dashboard Stats
export const historyAPI = {
  getScans: (type) => api.get('/history/scans', { params: { analysis_type: type } }),
  getDashboardStats: () => api.get('/history/dashboard-stats'),
  deleteScan: (id) => api.delete(`/history/scans/${id}`),
};

export default api;
