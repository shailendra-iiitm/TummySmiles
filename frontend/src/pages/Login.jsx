import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Login = () => {
  const { setToken } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    identifier: '',
    password: ''
  });

  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', formData);
      const token = res.data.token;

      setToken(token);
      localStorage.setItem('token', token);

      const user = JSON.parse(atob(token.split('.')[1]));

      switch (user.role) {
        case 'donor':
          navigate('/donor/dashboard');
          break;
        case 'agent':
          navigate('/agent/dashboard');
          break;
        case 'admin':
          navigate('/admin/dashboard');
          break;
        default:
          setError('Invalid role detected.');
      }

    } catch (err) {
      setError(err.response?.data?.msg || 'Login failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md w-96">
        <h2 className="text-2xl font-semibold mb-4">Login</h2>

        {error && <p className="text-red-500 text-sm mb-3">{error}</p>}

        <input
          type="text"
          name="identifier"
          placeholder="Phone number/Email"
          value={formData.identifier}
          onChange={handleChange}
          className="w-full p-2 mb-4 border border-gray-300 rounded"
          required
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          className="w-full p-2 mb-4 border border-gray-300 rounded"
          required
        />

        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
        >
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;
