import { Routes, Route } from 'react-router-dom';
import PhoneLogin from './components/PhoneLogin';
import DonorDashboard from './pages/DonorDashboard';
import AdminDashboard from './pages/AdminDashboard';
import AgentDashboard from './pages/AgentDashboard';
import NotFound from './pages/NotFound';

function App() {
  return (
    <Routes>
      <Route path="/" element={<PhoneLogin />} />
      <Route path="/donor" element={<DonorDashboard />} />
      <Route path="/admin" element={<AdminDashboard />} />
      <Route path="/agent" element={<AgentDashboard />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
