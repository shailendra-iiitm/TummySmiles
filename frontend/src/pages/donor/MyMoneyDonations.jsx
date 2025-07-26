import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import api from '../../services/api';

const MyMoneyDonations = () => {
  const [donations, setDonations] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [donationsResponse, statsResponse] = await Promise.all([
        api.get('/payment/my-donations'),
        api.get('/payment/stats')
      ]);

      setDonations(donationsResponse.data.donations);
      setStats(statsResponse.data.stats);
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch data:', error);
      toast.error('Failed to fetch donation history');
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      completed: 'bg-green-100 text-green-800 border-green-200',
      pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      failed: 'bg-red-100 text-red-800 border-red-200',
      refunded: 'bg-gray-100 text-gray-800 border-gray-200'
    };
    return colors[status] || colors.pending;
  };

  const getStatusIcon = (status) => {
    const icons = {
      completed: '✅',
      pending: '⏳',
      failed: '❌',
      refunded: '↩️'
    };
    return icons[status] || '⏳';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 p-4 md:p-6">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading your donation history...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 p-4 md:p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 border-t-4 border-orange-500">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent mb-2">
                💰 My Money Donations
              </h1>
              <p className="text-gray-600">
                Track your financial contributions to our cause
              </p>
            </div>
            <Link
              to="/donor/money-donation"
              className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-6 py-3 rounded-xl font-semibold transition-all transform hover:scale-105 shadow-lg"
            >
              💝 Donate Again
            </Link>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-white rounded-xl p-6 shadow-lg border-l-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Donated</p>
                <p className="text-3xl font-bold text-green-600">
                  ₹{stats.totalAmountDonated?.toLocaleString() || 0}
                </p>
              </div>
              <div className="bg-green-100 p-3 rounded-full">
                <span className="text-2xl">💰</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg border-l-4 border-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Donations</p>
                <p className="text-3xl font-bold text-blue-600">
                  {stats.totalDonations || 0}
                </p>
              </div>
              <div className="bg-blue-100 p-3 rounded-full">
                <span className="text-2xl">📊</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg border-l-4 border-purple-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Impact Score</p>
                <p className="text-3xl font-bold text-purple-600">
                  {Math.floor((stats.totalAmountDonated || 0) / 10)}
                </p>
              </div>
              <div className="bg-purple-100 p-3 rounded-full">
                <span className="text-2xl">⭐</span>
              </div>
            </div>
          </div>
        </div>

        {/* Donations List */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Donation History</h2>
            <div className="text-sm text-gray-500">
              {donations.length} donation{donations.length !== 1 ? 's' : ''}
            </div>
          </div>

          {donations.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">💰</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No donations yet</h3>
              <p className="text-gray-600 mb-6">Start supporting our mission with your first donation!</p>
              <Link
                to="/donor/money-donation"
                className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-8 py-3 rounded-xl font-semibold transition-all transform hover:scale-105 shadow-lg"
              >
                Make Your First Donation
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {donations.map((donation) => (
                <div
                  key={donation._id}
                  className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition-all"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-4">
                      <div className="bg-gradient-to-r from-green-400 to-green-500 w-12 h-12 rounded-full flex items-center justify-center">
                        <span className="text-white text-xl">💰</span>
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900">
                          ₹{donation.amount.toLocaleString()}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {new Date(donation.createdAt).toLocaleDateString('en-IN', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(donation.paymentStatus)}`}>
                        <span className="mr-1">{getStatusIcon(donation.paymentStatus)}</span>
                        {donation.paymentStatus.charAt(0).toUpperCase() + donation.paymentStatus.slice(1)}
                      </div>
                      {donation.receiptNumber && (
                        <p className="text-xs text-gray-500 mt-1">
                          Receipt: {donation.receiptNumber}
                        </p>
                      )}
                    </div>
                  </div>

                  {donation.message && (
                    <div className="bg-gray-50 rounded-lg p-3 mb-3">
                      <p className="text-sm text-gray-700">
                        <span className="font-medium">Message:</span> {donation.message}
                      </p>
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="font-medium text-gray-700">Payment Method:</span>
                      <p className="text-gray-600 capitalize">
                        {donation.paymentMethod || 'N/A'}
                      </p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Transaction ID:</span>
                      <p className="text-gray-600 font-mono text-xs">
                        {donation.razorpayPaymentId || 'N/A'}
                      </p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Status:</span>
                      <p className="text-gray-600">
                        {donation.isAnonymous ? 'Anonymous' : 'Public'} Donation
                      </p>
                    </div>
                  </div>

                  {donation.paymentStatus === 'failed' && donation.failureReason && (
                    <div className="mt-3 bg-red-50 border border-red-200 rounded-lg p-3">
                      <p className="text-sm text-red-700">
                        <span className="font-medium">Failure Reason:</span> {donation.failureReason}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Impact Message */}
        <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl shadow-lg p-6 mt-6 text-white text-center">
          <h3 className="text-2xl font-bold mb-2">Thank You for Your Support! 🙏</h3>
          <p className="text-orange-100">
            Your donations help us cover operational costs and support our agents in rescuing food and feeding those in need.
          </p>
        </div>
      </div>
    </div>
  );
};

export default MyMoneyDonations;
