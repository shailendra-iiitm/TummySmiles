import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../../contexts/AuthContext';

const DonorProfile = () => {
  const { token } = useAuth();

  const [formData, setFormData] = useState({
    name: '',
    address: ''
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const fetchProfile = async () => {
    try {
      const res = await axios.get('http://localhost:5000/donor/profile', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setFormData({
        name: res.data.name || '',
        address: res.data.address || ''
      });
    } catch {
      setError('Failed to load profile');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      await axios.patch('http://localhost:5000/donor/profile', formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSuccess('Profile updated successfully!');
    } catch {
      setError('Failed to update profile');
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  return (
    <div className="min-h-screen p-6 bg-white">
      <h2 className="text-xl font-bold mb-4">👤 My Profile</h2>

      {error && <p className="text-red-600 mb-2">{error}</p>}
      {success && <p className="text-green-600 mb-2">{success}</p>}

      <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Your Name"
          className="w-full p-2 border rounded"
        />

        <input
          type="text"
          name="address"
          value={formData.address}
          onChange={handleChange}
          placeholder="Your Address"
          className="w-full p-2 border rounded"
        />

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Update Profile
        </button>
      </form>
    </div>
  );
};

export default DonorProfile;
