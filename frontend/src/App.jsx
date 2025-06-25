import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Register from './pages/Register'; // if using role-based register
import Home from './pages/Home';
import 'leaflet/dist/leaflet.css';
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css';


// Donor
import DonorDashboard from './pages/donor/dashboard';
import CreateDonation from './pages/donor/CreateDonation';
import MyDonations from './pages/donor/MyDonations';
import DonorProfile from './pages/donor/DonorProfile';
import EditDonation from './pages/donor/EditDonation';

// Agent
import AgentDashboard from './pages/agent/AgentDashboard';
import AgentProfile from './pages/agent/AgentProfile';
import AgentLocation from './pages/agent/AgentLocation';

// Admin
import AdminDashboard from './pages/admin/AdminDashboard';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Donor Protected Routes */}
        <Route element={<ProtectedRoute allowedRoles={['donor']} />}>
          <Route path="/donor/dashboard" element={<DonorDashboard />} />
          <Route path="/donor/create" element={<CreateDonation />} />
          <Route path="/donor/my-donations" element={<MyDonations />} />
          <Route path="/donor/profile" element={<DonorProfile />} />
          <Route path="/donor/edit/:id" element={<EditDonation />} />
        </Route>

        <Route element={<ProtectedRoute allowedRoles={['agent']} />}>
        <Route path="/agent/dashboard" element={<AgentDashboard />} />
        <Route path="/agent/profile" element={<AgentProfile />} />
        <Route path="/agent/location" element={<AgentLocation />} />
        </Route>
        
        {/* Admin Protected Routes */}
        <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
        </Route>

      </Routes>
    </BrowserRouter>
  );
}

export default App;
