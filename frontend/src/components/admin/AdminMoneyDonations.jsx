import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import api from '../../services/api';

const AdminMoneyDonations = () => {
  const [donations, setDonations] = useState([]);
  const [analytics, setAnalytics] = useState({});
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    const fetchDataWrapper = async () => {
      try {
        const [donationsResponse, analyticsResponse] = await Promise.all([
          api.get(`/admin/money-donations?status=${filter === 'all' ? '' : filter}`),
          api.get('/admin/money-donations/analytics')
        ]);

        setDonations(donationsResponse.data.donations);
        setAnalytics(analyticsResponse.data.analytics);
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch money donations:', error);
        toast.error('Failed to fetch money donations data');
        setLoading(false);
      }
    };

    fetchDataWrapper();
  }, [filter]);

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
      <div className="bg-white rounded-xl shadow-lg p-8 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
        <p className="text-gray-600">Loading money donations...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Analytics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Collected</p>
              <p className="text-3xl font-bold text-green-600">
                ₹{analytics.totalStats?.find(s => s._id === 'completed')?.totalAmount?.toLocaleString() || 0}
              </p>
            </div>
            <div className="bg-green-100 p-3 rounded-full">
              <span className="text-2xl">💰</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Donations</p>
              <p className="text-3xl font-bold text-blue-600">
                {analytics.totalStats?.reduce((acc, curr) => acc + curr.count, 0) || 0}
              </p>
            </div>
            <div className="bg-blue-100 p-3 rounded-full">
              <span className="text-2xl">📊</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-purple-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Success Rate</p>
              <p className="text-3xl font-bold text-purple-600">
                {analytics.totalStats?.length > 0 
                  ? Math.round(((analytics.totalStats.find(s => s._id === 'completed')?.count || 0) / analytics.totalStats.reduce((acc, curr) => acc + curr.count, 0)) * 100)
                  : 0}%
              </p>
            </div>
            <div className="bg-purple-100 p-3 rounded-full">
              <span className="text-2xl">📈</span>
            </div>
          </div>
        </div>
      </div>

      {/* Top Donors */}
      {analytics.topDonors?.length > 0 && (
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-bold mb-4 text-gray-800">🏆 Top Donors</h3>
          <div className="grid gap-4">
            {analytics.topDonors.slice(0, 5).map((donor, index) => (
              <div key={donor._id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${
                    index === 0 ? 'bg-yellow-500' : index === 1 ? 'bg-gray-400' : index === 2 ? 'bg-orange-600' : 'bg-blue-500'
                  }`}>
                    {index + 1}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{donor.donorName}</p>
                    <p className="text-sm text-gray-600">{donor.donationCount} donations</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-green-600">₹{donor.totalAmount.toLocaleString()}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Donations List */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-800">💰 Money Donations</h3>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          >
            <option value="all">All Status</option>
            <option value="completed">Completed</option>
            <option value="pending">Pending</option>
            <option value="failed">Failed</option>
            <option value="refunded">Refunded</option>
          </select>
        </div>

        {donations.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">💰</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No money donations found</h3>
            <p className="text-gray-600">No donations match the current filter.</p>
          </div>
        ) : (
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {donations.map((donation) => (
              <div
                key={donation._id}
                className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-4">
                    <div className="bg-gradient-to-r from-green-400 to-green-500 w-12 h-12 rounded-full flex items-center justify-center">
                      <span className="text-white text-xl">💰</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">
                        ₹{donation.amount.toLocaleString()}
                      </h4>
                      <p className="text-sm text-gray-600">
                        {donation.isAnonymous ? 'Anonymous Donor' : donation.donorName}
                      </p>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(donation.paymentStatus)}`}>
                      <span className="mr-1">{getStatusIcon(donation.paymentStatus)}</span>
                      {donation.paymentStatus.charAt(0).toUpperCase() + donation.paymentStatus.slice(1)}
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(donation.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                {donation.message && (
                  <div className="bg-blue-50 rounded-lg p-3 mb-3">
                    <p className="text-sm text-blue-800">
                      <span className="font-medium">Message:</span> {donation.message}
                    </p>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-gray-700">Donor:</span>
                    <p className="text-gray-600">{donation.donor?.name}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Email:</span>
                    <p className="text-gray-600">{donation.donorEmail}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Payment Method:</span>
                    <p className="text-gray-600 capitalize">{donation.paymentMethod || 'N/A'}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Receipt:</span>
                    <p className="text-gray-600 font-mono text-xs">{donation.receiptNumber}</p>
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
    </div>
  );
};

export default AdminMoneyDonations;
