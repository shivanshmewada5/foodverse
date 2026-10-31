import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Pages
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import DashboardPage from './pages/DashboardPage';
import FoodRecognitionPage from './pages/FoodRecognitionPage';
import NutritionAnalysisPage from './pages/NutritionAnalysisPage';
import FreshnessDetectionPage from './pages/FreshnessDetectionPage';
import RestaurantHygienePage from './pages/RestaurantHygienePage';
import CookingAssistantPage from './pages/CookingAssistantPage';
import MealPlannerPage from './pages/MealPlannerPage';
import ProfileSettingsPage from './pages/ProfileSettingsPage';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen flex flex-col bg-neutral-950 text-neutral-100 font-sans selection:bg-emerald-500 selection:text-neutral-950">
          <Navbar />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/forgot-password" element={<ForgotPasswordPage />} />
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/food-recognition" element={<FoodRecognitionPage />} />
              <Route path="/nutrition" element={<NutritionAnalysisPage />} />
              <Route path="/freshness" element={<FreshnessDetectionPage />} />
              <Route path="/hygiene" element={<RestaurantHygienePage />} />
              <Route path="/cooking-assistant" element={<CookingAssistantPage />} />
              <Route path="/meal-planner" element={<MealPlannerPage />} />
              <Route path="/profile" element={<ProfileSettingsPage />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
