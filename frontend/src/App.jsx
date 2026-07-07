import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Landing from './pages/Landing';
import Dashboard from './pages/Dashboard';
import SubmitComplaint from './pages/SubmitComplaint';
import ComplaintHistory from './pages/ComplaintHistory';
import ComplaintDetails from './pages/ComplaintDetails';
import SchemeDiscovery from './pages/SchemeDiscovery';
import Profile from './pages/Profile';
import Services from './pages/Services';
import DocumentVault from './pages/DocumentVault';
import EmergencySOS from './pages/EmergencySOS';
import NewsCenter from './pages/NewsCenter';
import NearbyOffices from './pages/NearbyOffices';
import KnowledgeCenter from './pages/KnowledgeCenter';
import AdminPanel from './pages/AdminPanel';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      
      {/* Protected Routes wrapped in Layout */}
      <Route path="/dashboard" element={<ProtectedRoute><Layout><Dashboard /></Layout></ProtectedRoute>} />
      <Route path="/submit" element={<ProtectedRoute><Layout><SubmitComplaint /></Layout></ProtectedRoute>} />
      <Route path="/history" element={<ProtectedRoute><Layout><ComplaintHistory /></Layout></ProtectedRoute>} />
      <Route path="/complaints/:id" element={<ProtectedRoute><Layout><ComplaintDetails /></Layout></ProtectedRoute>} />
      <Route path="/schemes" element={<ProtectedRoute><Layout><SchemeDiscovery /></Layout></ProtectedRoute>} />
      <Route path="/profile" element={<ProtectedRoute><Layout><Profile /></Layout></ProtectedRoute>} />
      <Route path="/settings" element={<ProtectedRoute><Layout><Profile /></Layout></ProtectedRoute>} />
      
      {/* New Protected Routes */}
      <Route path="/services" element={<ProtectedRoute><Layout><Services /></Layout></ProtectedRoute>} />
      <Route path="/documents" element={<ProtectedRoute><Layout><DocumentVault /></Layout></ProtectedRoute>} />
      <Route path="/emergency" element={<ProtectedRoute><Layout><EmergencySOS /></Layout></ProtectedRoute>} />
      <Route path="/news" element={<ProtectedRoute><Layout><NewsCenter /></Layout></ProtectedRoute>} />
      <Route path="/offices" element={<ProtectedRoute><Layout><NearbyOffices /></Layout></ProtectedRoute>} />
      <Route path="/knowledge" element={<ProtectedRoute><Layout><KnowledgeCenter /></Layout></ProtectedRoute>} />
      <Route path="/admin" element={<ProtectedRoute><Layout><AdminPanel /></Layout></ProtectedRoute>} />
    </Routes>
  );
}

export default App;
