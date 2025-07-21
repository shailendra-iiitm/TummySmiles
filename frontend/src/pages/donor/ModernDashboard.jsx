import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { toast } from 'react-hot-toast';

const ModernDonorDashboard = () => {
  const { user } = useAuth();
  const [donations, setDonations] = useState([]);
  const [stats, setStats] = useState({
    totalDonations: 0,
    completedDonations: 0,
    pendingDonations: 0,
    impactScore: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDonorData();
  }, []);

  const fetchDonorData = async () => {
    try {
      const response = await api.get('/donor/mine');
      
      setDonations(response.data);
      
      // Calculate stats
      const total = response.data.length;
      const completed = response.data.filter(d => d.status === 'collected').length;
      const pending = response.data.filter(d => ['pending', 'accepted'].includes(d.status)).length;
      const impact = completed * 10; // Simple impact scoring
      
      setStats({
        totalDonations: total,
        completedDonations: completed,
        pendingDonations: pending,
        impactScore: impact
      });
      
      setLoading(false);
      toast.success(`✅ Loaded ${total} donations successfully`);
    } catch (error) {
      console.error('❌ Failed to fetch donor data:', error);
      console.error('Error details:', error.response?.data);
      console.error('Error status:', error.response?.status);
      toast.error(`Failed to fetch data: ${error.response?.data?.msg || error.message}`);
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'from-yellow-400 to-orange-400',
      accepted: 'from-blue-400 to-indigo-400',
      collected: 'from-green-400 to-emerald-400',
      rejected: 'from-red-400 to-pink-400',
      not_found: 'from-gray-400 to-slate-400'
    };
    return colors[status] || 'from-gray-400 to-slate-400';
  };

  const getStatusIcon = (status) => {
    const icons = {
      pending: '⏳',
      accepted: '✅',
      collected: '🎉',
      rejected: '❌',
      not_found: '🔍'
    };
    return icons[status] || '❓';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 flex items-center justify-center">
        <div className="text-center">
          <div className="loading-spinner mb-4"></div>
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Header */}
        <div className="mb-8">
          <div className="glass-morphism p-6 rounded-3xl">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl font-black gradient-text-animate">
                  Welcome back, {user?.name}! 👋
                </h1>
                <p className="text-gray-600 mt-2 text-lg">
                  Thank you for being a food hero in your community
                </p>
              </div>
              <div className="hidden md:block">
                <div className="w-20 h-20 bg-gradient-to-br from-orange-400 to-red-500 rounded-full flex items-center justify-center morphing-shape">
                  <span className="text-3xl">🍽️</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="interactive-card glass-morphism p-6 rounded-2xl stagger-fade-in">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-orange-400 to-red-400 rounded-full flex items-center justify-center">
                <span className="text-white text-xl">📊</span>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-gray-900">{stats.totalDonations}</div>
                <div className="text-sm text-gray-600">Total Donations</div>
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-orange-400 to-red-400 h-2 rounded-full transition-all duration-1000"
                style={{ width: `${Math.min((stats.totalDonations / 10) * 100, 100)}%` }}
              ></div>
            </div>
          </div>

          <div className="interactive-card glass-morphism p-6 rounded-2xl stagger-fade-in">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full flex items-center justify-center">
                <span className="text-white text-xl">✅</span>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-gray-900">{stats.completedDonations}</div>
                <div className="text-sm text-gray-600">Completed</div>
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-green-400 to-emerald-400 h-2 rounded-full transition-all duration-1000"
                style={{ width: `${stats.totalDonations > 0 ? (stats.completedDonations / stats.totalDonations) * 100 : 0}%` }}
              ></div>
            </div>
          </div>

          <div className="interactive-card glass-morphism p-6 rounded-2xl stagger-fade-in">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-indigo-400 rounded-full flex items-center justify-center">
                <span className="text-white text-xl">⏳</span>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-gray-900">{stats.pendingDonations}</div>
                <div className="text-sm text-gray-600">Pending</div>
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-blue-400 to-indigo-400 h-2 rounded-full transition-all duration-1000"
                style={{ width: `${stats.totalDonations > 0 ? (stats.pendingDonations / stats.totalDonations) * 100 : 0}%` }}
              ></div>
            </div>
          </div>

          <div className="interactive-card glass-morphism p-6 rounded-2xl stagger-fade-in">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center">
                <span className="text-white text-xl">🌟</span>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-gray-900">{stats.impactScore}</div>
                <div className="text-sm text-gray-600">Impact Score</div>
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-purple-400 to-pink-400 h-2 rounded-full transition-all duration-1000"
                style={{ width: `${Math.min((stats.impactScore / 100) * 100, 100)}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <div className="glass-morphism p-6 rounded-3xl">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Quick Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Link 
                to="/donor/create"
                className="group btn-modern text-white p-6 rounded-2xl text-center hover-lift"
              >
                <div className="text-3xl mb-2">🍽️</div>
                <div className="font-semibold">Create Donation</div>
                <div className="text-sm opacity-90">Share your excess food</div>
              </Link>
              
              <Link 
                to="/donor/my-donations"
                className="group bg-gradient-to-r from-blue-500 to-indigo-500 text-white p-6 rounded-2xl text-center hover-lift"
              >
                <div className="text-3xl mb-2">📋</div>
                <div className="font-semibold">My Donations</div>
                <div className="text-sm opacity-90">Track your contributions</div>
              </Link>
              
              <Link 
                to="/donor/profile"
                className="group bg-gradient-to-r from-purple-500 to-pink-500 text-white p-6 rounded-2xl text-center hover-lift"
              >
                <div className="text-3xl mb-2">👤</div>
                <div className="font-semibold">Profile</div>
                <div className="text-sm opacity-90">Update your information</div>
              </Link>
            </div>
          </div>
        </div>

        {/* Recent Donations */}
        <div className="glass-morphism p-6 rounded-3xl">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Recent Donations</h2>
            <Link 
              to="/donor/my-donations"
              className="text-orange-600 hover:text-orange-700 font-semibold"
            >
              View All →
            </Link>
          </div>
          
          {donations.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🍽️</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No donations yet</h3>
              <p className="text-gray-600 mb-6">Start making a difference by creating your first donation!</p>
              <Link 
                to="/donor/create"
                className="btn-modern text-white px-8 py-3 rounded-full font-semibold"
              >
                Create Your First Donation
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {donations.slice(0, 5).map((donation) => (
                <div key={donation._id} className="interactive-card bg-white/50 p-6 rounded-2xl border border-white/20">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className={`w-12 h-12 bg-gradient-to-r ${getStatusColor(donation.status)} rounded-full flex items-center justify-center`}>
                        <span className="text-white text-xl">{getStatusIcon(donation.status)}</span>
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{donation.foodType}</h3>
                        <p className="text-sm text-gray-600">
                          {donation.quantity} • {new Date(donation.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`inline-block px-3 py-1 rounded-full text-sm font-medium bg-gradient-to-r ${getStatusColor(donation.status)} text-white`}>
                        {donation.status}
                      </div>
                      {donation.agent && (
                        <p className="text-xs text-gray-500 mt-1">
                          Agent: {donation.agent.name}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ModernDonorDashboard;
