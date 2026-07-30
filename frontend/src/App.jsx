import React, { Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import PageLoader from './components/PageLoader';
import ErrorBoundary from './components/ErrorBoundary';

// Lazy loaded pages for Code Splitting
const Login = React.lazy(() => import('./pages/Login'));
const Register = React.lazy(() => import('./pages/Register'));
const Landing = React.lazy(() => import('./pages/Landing'));
const Dashboard = React.lazy(() => import('./pages/Dashboard'));
const SubmitComplaint = React.lazy(() => import('./pages/SubmitComplaint'));
const ComplaintHistory = React.lazy(() => import('./pages/ComplaintHistory'));
const ComplaintDetails = React.lazy(() => import('./pages/ComplaintDetails'));
const SchemeDiscovery = React.lazy(() => import('./pages/SchemeDiscovery'));
const Profile = React.lazy(() => import('./pages/Profile'));
const Services = React.lazy(() => import('./pages/Services'));
const ServiceDetails = React.lazy(() => import('./pages/ServiceDetails'));
const DocumentVault = React.lazy(() => import('./pages/DocumentVault'));
const EmergencySOS = React.lazy(() => import('./pages/EmergencySOS'));
const NewsCenter = React.lazy(() => import('./pages/NewsCenter'));
const NearbyOffices = React.lazy(() => import('./pages/NearbyOffices'));
const KnowledgeCenter = React.lazy(() => import('./pages/KnowledgeCenter'));
const AdminPanel = React.lazy(() => import('./pages/AdminPanel'));

function App() {
  return (
    <ErrorBoundary>
      <Suspense fallback={<PageLoader />}>
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
          <Route path="/services/:id" element={<ProtectedRoute><Layout><ServiceDetails /></Layout></ProtectedRoute>} />
          <Route path="/documents" element={<ProtectedRoute><Layout><DocumentVault /></Layout></ProtectedRoute>} />
          <Route path="/vault" element={<ProtectedRoute><Layout><DocumentVault /></Layout></ProtectedRoute>} />
          <Route path="/emergency" element={<ProtectedRoute><Layout><EmergencySOS /></Layout></ProtectedRoute>} />
          <Route path="/news" element={<ProtectedRoute><Layout><NewsCenter /></Layout></ProtectedRoute>} />
          <Route path="/offices" element={<ProtectedRoute><Layout><NearbyOffices /></Layout></ProtectedRoute>} />
          <Route path="/knowledge" element={<ProtectedRoute><Layout><KnowledgeCenter /></Layout></ProtectedRoute>} />
          <Route path="/admin" element={<ProtectedRoute><Layout><AdminPanel /></Layout></ProtectedRoute>} />
        </Routes>
      </Suspense>
    </ErrorBoundary>
  );
}

export default App;
