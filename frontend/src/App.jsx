import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './contexts/AuthProvider';
import { ChatProvider } from './contexts/ChatContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import ParticleBackground from './components/ParticleBackground';
import ChatWidget from './components/ChatWidget';
import Footer from './components/Footer';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import About from './pages/About';
import Contact from './pages/Contact';

import 'leaflet/dist/leaflet.css';
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css';

// Donor Pages
import DonorDashboard from './pages/donor/ModernDashboard';
import CreateDonation from './pages/donor/CreateDonation';
import MyDonations from './pages/donor/MyDonations';
import DonorProfile from './pages/donor/DonorProfile';
import EditDonation from './pages/donor/EditDonation';
import MoneyDonation from './pages/donor/MoneyDonation';
import MyMoneyDonations from './pages/donor/MyMoneyDonations';

// Agent Pages
import AgentDashboard from './pages/agent/AgentDashboard';
import AgentProfile from './pages/agent/AgentProfile';
import AgentLocation from './pages/agent/AgentLocation';
import AgentStatus from './pages/agent/AgentStatus';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminProfile from './pages/admin/AdminProfile';

// Component to conditionally render footer
const ConditionalFooter = () => {
  const location = useLocation();
  
  const shouldHideFooter = location.pathname.includes('dashboard');
  
  return !shouldHideFooter ? <Footer /> : null;
};

// Main App Content component that uses router context
const AppContent = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-yellow-50 relative">
      <ParticleBackground />
      <Navbar />
      <ChatWidget />
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: 'linear-gradient(135deg, #f97316 0%, #ef4444 100%)',
            color: '#fff',
            fontWeight: '600',
            borderRadius: '12px',
            padding: '16px',
            boxShadow: '0 10px 25px rgba(0, 0, 0, 0.2)',
          },
        }}
      />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Donor Routes */}
        <Route path="/donor/dashboard" element={
          <ProtectedRoute role="donor">
            <DonorDashboard />
          </ProtectedRoute>
        } />
        <Route path="/donor/create" element={
          <ProtectedRoute role="donor">
            <CreateDonation />
          </ProtectedRoute>
        } />
        <Route path="/donor/my-donations" element={
          <ProtectedRoute role="donor">
            <MyDonations />
          </ProtectedRoute>
        } />
        <Route path="/donor/profile" element={
          <ProtectedRoute role="donor">
            <DonorProfile />
          </ProtectedRoute>
        } />
        <Route path="/donor/edit/:id" element={
          <ProtectedRoute role="donor">
            <EditDonation />
          </ProtectedRoute>
        } />
        <Route path="/donor/money-donation" element={
          <ProtectedRoute role="donor">
            <MoneyDonation />
          </ProtectedRoute>
        } />
        <Route path="/donor/money-donations" element={
          <ProtectedRoute role="donor">
            <MyMoneyDonations />
          </ProtectedRoute>
        } />

        {/* Agent Routes */}
        <Route path="/agent/dashboard" element={
          <ProtectedRoute role="agent">
            <AgentDashboard />
          </ProtectedRoute>
        } />
        <Route path="/agent/profile" element={
          <ProtectedRoute role="agent">
            <AgentProfile />
          </ProtectedRoute>
        } />
        <Route path="/agent/location" element={
          <ProtectedRoute role="agent">
            <AgentLocation />
          </ProtectedRoute>
        } />
        <Route path="/agent/status" element={
          <ProtectedRoute role="agent">
            <AgentStatus />
          </ProtectedRoute>
        } />

        {/* Admin Routes */}
        <Route path="/admin/dashboard" element={
          <ProtectedRoute role="admin">
            <AdminDashboard />
          </ProtectedRoute>
        } />
        <Route path="/admin/profile" element={
          <ProtectedRoute role="admin">
            <AdminProfile />
          </ProtectedRoute>
        } />
      </Routes>
      <ConditionalFooter />
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <ChatProvider>
        <BrowserRouter>
          <AppContent />
        </BrowserRouter>
      </ChatProvider>
    </AuthProvider>
  );
}

export default App;
