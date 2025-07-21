import { useEffect, useState, useCallback } from 'react';
import api from '../../services/api';

const DonorProfile = () => {
  const [formData, setFormData] = useState({
    name: '',
    address: ''
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const fetchProfile = useCallback(async () => {
    try {
      const res = await api.get('/donor/profile');
      setFormData({
        name: res.data.name || '',
        address: res.data.address || ''
      });
    } catch (error) {
      console.error('Failed to load profile:', error);
      setError('Failed to load profile');
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      await api.patch('/donor/profile', formData);
      setSuccess('Profile updated successfully!');
    } catch (error) {
      console.error('Failed to update profile:', error);
      setError('Failed to update profile');
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

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
