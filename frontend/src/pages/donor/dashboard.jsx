import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useState, useEffect, useCallback } from 'react';
import api from '../../services/api';

const DonorDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalDonations: 0,
    activeDonations: 0,
    completedDonations: 0,
    impactMeals: 0
  });

  const [recentDonations, setRecentDonations] = useState([]);

  const fetchDashboardData = useCallback(async () => {
    try {
      const response = await api.get('/donor/mine');
      
      const donations = response.data;
      setRecentDonations(donations.slice(0, 3)); // Show latest 3
      
      // Calculate stats
      setStats({
        totalDonations: donations.length,
        activeDonations: donations.filter(d => ['pending', 'accepted', 'agent_accepted'].includes(d.status)).length,
        completedDonations: donations.filter(d => d.status === 'collected').length,
        impactMeals: donations.reduce((total, d) => total + (parseInt(d.quantity) || 0), 0)
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'accepted': return 'bg-blue-100 text-blue-800';
      case 'agent_accepted': return 'bg-purple-100 text-purple-800';
      case 'collected': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-yellow-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Welcome back, {user?.name || 'Food Hero'}! 👋
          </h1>
          <p className="text-xl text-gray-600">Ready to spread more tummy smiles today?</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-orange-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Donations</p>
                <p className="text-3xl font-bold text-gray-900">{stats.totalDonations}</p>
              </div>
              <div className="bg-orange-100 p-3 rounded-full">
                <span className="text-2xl">🍽️</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg border border-blue-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Donations</p>
                <p className="text-3xl font-bold text-gray-900">{stats.activeDonations}</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-full">
                <span className="text-2xl">🚀</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg border border-green-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Completed</p>
                <p className="text-3xl font-bold text-gray-900">{stats.completedDonations}</p>
              </div>
              <div className="bg-green-100 p-3 rounded-full">
                <span className="text-2xl">✅</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg border border-purple-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Meals Shared</p>
                <p className="text-3xl font-bold text-gray-900">{stats.impactMeals}</p>
              </div>
              <div className="bg-purple-100 p-3 rounded-full">
                <span className="text-2xl">❤️</span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Link
            to="/donor/create"
            className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white p-6 rounded-2xl shadow-lg transition-all transform hover:scale-105"
          >
            <div className="flex items-center space-x-4">
              <div className="bg-white bg-opacity-20 p-3 rounded-full">
                <span className="text-2xl">🍱</span>
              </div>
              <div>
                <h3 className="text-xl font-bold">Share Food</h3>
                <p className="text-orange-100">Create a new donation</p>
              </div>
            </div>
          </Link>

          <Link
            to="/donor/my-donations"
            className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white p-6 rounded-2xl shadow-lg transition-all transform hover:scale-105"
          >
            <div className="flex items-center space-x-4">
              <div className="bg-white bg-opacity-20 p-3 rounded-full">
                <span className="text-2xl">📦</span>
              </div>
              <div>
                <h3 className="text-xl font-bold">My Donations</h3>
                <p className="text-blue-100">Track all donations</p>
              </div>
            </div>
          </Link>

          <Link
            to="/donor/profile"
            className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white p-6 rounded-2xl shadow-lg transition-all transform hover:scale-105"
          >
            <div className="flex items-center space-x-4">
              <div className="bg-white bg-opacity-20 p-3 rounded-full">
                <span className="text-2xl">👤</span>
              </div>
              <div>
                <h3 className="text-xl font-bold">My Profile</h3>
                <p className="text-green-100">Update information</p>
              </div>
            </div>
          </Link>
        </div>

        {/* Recent Donations */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Recent Donations</h2>
            <Link 
              to="/donor/my-donations"
              className="text-orange-600 hover:text-orange-500 font-medium transition-colors"
            >
              View All →
            </Link>
          </div>

          {recentDonations.length === 0 ? (
            <div className="text-center py-12">
              <span className="text-6xl">🍽️</span>
              <h3 className="text-xl font-bold text-gray-900 mt-4">No donations yet</h3>
              <p className="text-gray-600 mb-6">Start your journey by sharing your first meal!</p>
              <Link 
                to="/donor/create"
                className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-6 py-3 rounded-lg font-medium transition-all transform hover:scale-105"
              >
                Share Food Now 🚀
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {recentDonations.map((donation) => (
                <div key={donation._id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{donation.foodType}</h3>
                      <p className="text-sm text-gray-600">
                        Quantity: {donation.quantity} • {new Date(donation.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${getStatusColor(donation.status)}`}>
                      {donation.status.replace('_', ' ')}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Impact Section */}
        <div className="mt-8 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl p-8 text-white">
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-4">Your Impact So Far! 🎉</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <div className="text-4xl font-bold">{stats.impactMeals}</div>
                <div className="text-orange-100">Meals Shared</div>
              </div>
              <div>
                <div className="text-4xl font-bold">{stats.completedDonations * 3}</div>
                <div className="text-orange-100">People Fed (est.)</div>
              </div>
              <div>
                <div className="text-4xl font-bold">{stats.totalDonations * 2}</div>
                <div className="text-orange-100">Smiles Created</div>
              </div>
            </div>
            <p className="mt-6 text-xl text-orange-100">
              Thank you for being a food hero! Every meal matters. ❤️
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DonorDashboard;
