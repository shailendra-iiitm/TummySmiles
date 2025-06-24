import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import DonorDashboard from './pages/donor/Dashboard';
import AgentDashboard from './pages/agent/Dashboard';
import AdminDashboard from './pages/admin/Dashboard';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/donor/dashboard" element={<DonorDashboard />} />
        <Route path="/agent/dashboard" element={<AgentDashboard />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
