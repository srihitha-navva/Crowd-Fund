import { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import RootLayout from './components/RootLayout';
import Home from './components/Home';
import FundraisingPage from './components/FundraisingPage';
import Header from './components/Header';
import Footer from './components/Footer';
import { useAuth } from './store/authStore';

import Campaigns from './components/Campaigns';
import CampaignDetail from './components/CampaignDetail';
import Login from './components/Login';
import Register from './components/Register';
import Profile from './components/Profile';
import AdminDashboard from './components/AdminDashboard';
import {
  ContactUs,
  HelpCenter,
  HowItWorks,
  PrivacyPolicy,
  TermsConditions,
} from './components/InfoPages';

function App() {
  const checkAuth = useAuth((state) => state.checkAuth);
  const authChecked = useAuth((state) => state.authChecked);
  const isAuthenticated = useAuth((state) => state.isAuthenticated);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (!authChecked) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#ECE7D1]/45 text-sm font-semibold text-[#8A7650]">
        Checking session...
      </div>
    );
  }

  return (
    <Routes>
      <Route element={<RootLayout />}>
        <Route index element={<Home />} />
        <Route path="/campaigns" element={<Campaigns />} />
        <Route path="/campaign/:id" element={<CampaignDetail />} />
        <Route path="/fundraising" element={<FundraisingPage />} />
        <Route path="/donor-profile" element={<Profile expectedRole="DONOR" />} />
        <Route path="/fundraiser-profile" element={<Profile expectedRole="FUNDRAISER" />} />
        <Route path="/admin-profile" element={<Profile expectedRole="ADMIN" />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/how-it-works" element={<HowItWorks />} />
        <Route path="/help-center" element={<HelpCenter />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/terms-conditions" element={<TermsConditions />} />
        <Route path="/contact" element={<ContactUs />} />
      </Route>
      <Route
        path="/login"
        element={
          isAuthenticated ? <Navigate to="/" replace /> : <><Header /><Login /><Footer /></>
        }
      />
      <Route
        path="/register"
        element={
          isAuthenticated ? <Navigate to="/" replace /> : <><Header /><Register /><Footer /></>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
