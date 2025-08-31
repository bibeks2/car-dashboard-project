import React, { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import CssBaseline from '@mui/material/CssBaseline';

import Loader from './components/common/Loader';
import ProtectedRoute from './components/HOC/ProtectedRoute.jsx';
import MainLayout from './components/layout/MainLayout';
import AuthGuard from './features/auth/AuthGuard';

const DashboardPage = lazy(() => import('./pages/DashboardPage'));
const AboutPage = lazy(() => import('./pages/AboutPage'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const SignupPage = lazy(() => import('./pages/SignupPage'));
const DetailedCarPage = lazy(() => import('./pages/DetailedCarPage'));


function App() {
  return (
    <>
    <CssBaseline />
      <Router>
        <AuthGuard>
          <Suspense fallback={<Loader />}>
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignupPage />} />
              <Route element={<MainLayout />}>
                <Route path="/" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/car/:id" element={<ProtectedRoute><DetailedCarPage /></ProtectedRoute>} />
              </Route>
            </Routes>
          </Suspense>
        </AuthGuard>
      </Router>
    </>
      
  );
}

export default App;