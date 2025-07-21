import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../services/api';
import { toast } from 'react-hot-toast';

const AdminProfile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    address: '',
    phone: ''
  });
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfile();
  }, [user]); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchProfile = async () => {
    try {
      // Since there's no specific admin profile endpoint, we'll use the auth update format
      setProfile({
        name: user.name || '',
        email: user.email || '',
        address: user.address || '',
        phone: user.phone || ''
      });
      setLoading(false);
    } catch (error) {
      console.error('Failed to load profile:', error);
      toast.error('Failed to load profile');
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.patch('/admin/profile', profile);
      toast.success('Profile updated successfully!');
      setIsEditing(false);
    } catch (error) {
      console.error('Profile update failed:', error);
      toast.error('Failed to update profile');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-2xl shadow-lg">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
          <p className="text-center mt-4 text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 p-4 md:p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 border-t-4 border-orange-500">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                Admin Profile
              </h1>
              <p className="text-gray-600 mt-1">Manage your administrative account settings</p>
            </div>
            <div className="bg-gradient-to-br from-orange-100 to-red-100 p-4 rounded-xl">
              <span className="text-2xl">👑</span>
            </div>
          </div>
        </div>

        {/* Profile Form */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-gray-800">Profile Information</h2>
            {!isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-6 py-2 rounded-lg font-semibold transition-all transform hover:scale-105 shadow-lg"
              >
                ✏️ Edit Profile
              </button>
            )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={profile.name}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className={`w-full p-4 border rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all ${
                    isEditing 
                      ? 'border-gray-300 bg-white' 
                      : 'border-gray-200 bg-gray-50 cursor-not-allowed'
                  }`}
                  placeholder="Enter your full name"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={profile.email}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className={`w-full p-4 border rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all ${
                    isEditing 
                      ? 'border-gray-300 bg-white' 
                      : 'border-gray-200 bg-gray-50 cursor-not-allowed'
                  }`}
                  placeholder="Enter your email"
                />
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={profile.phone}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className={`w-full p-4 border rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all ${
                    isEditing 
                      ? 'border-gray-300 bg-white' 
                      : 'border-gray-200 bg-gray-50 cursor-not-allowed'
                  }`}
                  placeholder="Enter your phone number"
                />
              </div>

              {/* Address */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Address
                </label>
                <textarea
                  name="address"
                  value={profile.address}
                  onChange={handleChange}
                  disabled={!isEditing}
                  rows="3"
                  className={`w-full p-4 border rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all ${
                    isEditing 
                      ? 'border-gray-300 bg-white' 
                      : 'border-gray-200 bg-gray-50 cursor-not-allowed'
                  }`}
                  placeholder="Enter your address"
                />
              </div>
            </div>

            {/* Action Buttons */}
            {isEditing && (
              <div className="flex space-x-4 pt-6 border-t border-gray-200">
                <button
                  type="submit"
                  className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-8 py-3 rounded-xl font-semibold transition-all transform hover:scale-105 shadow-lg"
                >
                  💾 Save Changes
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsEditing(false);
                    fetchProfile(); // Reset form
                  }}
                  className="bg-gray-500 hover:bg-gray-600 text-white px-8 py-3 rounded-xl font-semibold transition-all transform hover:scale-105 shadow-lg"
                >
                  ❌ Cancel
                </button>
              </div>
            )}
          </form>

          {/* Admin Info */}
          {!isEditing && (
            <div className="mt-8 p-6 bg-gradient-to-br from-orange-50 to-red-50 rounded-xl border border-orange-200">
              <h3 className="text-lg font-semibold text-orange-800 mb-2">👑 Admin Privileges</h3>
              <ul className="space-y-2 text-orange-700">
                <li className="flex items-center">
                  <span className="text-green-500 mr-2">✅</span>
                  Full access to all donations and user management
                </li>
                <li className="flex items-center">
                  <span className="text-green-500 mr-2">✅</span>
                  Ability to assign agents to donations
                </li>
                <li className="flex items-center">
                  <span className="text-green-500 mr-2">✅</span>
                  Platform statistics and analytics access
                </li>
                <li className="flex items-center">
                  <span className="text-green-500 mr-2">✅</span>
                  User blocking and account management
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminProfile;
