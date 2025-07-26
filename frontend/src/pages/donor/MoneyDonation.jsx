import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import api from '../../services/api';

const MoneyDonation = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    amount: '',
    donorName: '',
    donorEmail: '',
    donorPhone: '',
    message: '',
    isAnonymous: false
  });

  const predefinedAmounts = [100, 500, 1000, 2000, 5000, 10000];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const selectAmount = (amount) => {
    setFormData(prev => ({ ...prev, amount: amount.toString() }));
  };

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePayment = async (e) => {
    e.preventDefault();
    
    if (!formData.amount || parseFloat(formData.amount) < 1) {
      toast.error('Please enter a valid amount (minimum ₹1)');
      return;
    }

    if (!formData.donorName || !formData.donorEmail || !formData.donorPhone) {
      toast.error('Please fill all required fields');
      return;
    }

    setLoading(true);

    try {
      // Load Razorpay script
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        toast.error('Failed to load payment gateway');
        setLoading(false);
        return;
      }

      console.log('Creating payment order with data:', formData);
      
      // Create payment order
      const orderResponse = await api.post('/payment/create-order', formData);
      console.log('Order response:', orderResponse.data);
      
      // Check if this is a test response
      if (orderResponse.data.test) {
        if (orderResponse.data.message === 'Database operations successful!') {
          toast.success('✅ Database test successful! Ready for Razorpay integration.');
        } else {
          toast.success('✅ Payment endpoint working! Test successful.');
        }
        console.log('Test response received:', orderResponse.data);
        setLoading(false);
        return;
      }
      
      // Only try to destructure order data if not a test response
      const { order, donationId, key } = orderResponse.data;
      
      if (!order || !order.amount) {
        throw new Error('Invalid order response from server');
      }

      // Razorpay options
      const options = {
        key,
        amount: order.amount,
        currency: order.currency,
        name: 'Tummy Smiles',
        description: 'Food Donation Support',
        order_id: order.id,
        receipt: order.receipt,
        image: '/food.svg', // Your app logo
        theme: {
          color: '#f97316'
        },
        prefill: {
          name: formData.donorName,
          email: formData.donorEmail,
          contact: formData.donorPhone
        },
        handler: async (response) => {
          try {
            // Verify payment
            await api.post('/payment/verify', {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              donationId
            });

            toast.success('🎉 Payment successful! Thank you for your donation!');
            navigate('/donor/money-donations');
          } catch (error) {
            console.error('Payment verification failed:', error);
            toast.error('Payment verification failed');
          }
        },
        modal: {
          ondismiss: async () => {
            try {
              await api.post('/payment/failure', {
                donationId,
                error: { description: 'Payment cancelled by user' }
              });
            } catch (error) {
              console.error('Failed to record payment cancellation:', error);
            }
            toast.error('Payment cancelled');
            setLoading(false);
          }
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();

    } catch (error) {
      console.error('Payment initiation failed - Full error:', error);
      console.error('Error response:', error.response);
      console.error('Error response data:', error.response?.data);
      console.error('Error status:', error.response?.status);
      
      const errorMessage = error.response?.data?.msg || error.response?.data?.error || error.message || 'Payment failed';
      toast.error(`Payment failed: ${errorMessage}`);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 p-4 md:p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 border-t-4 border-orange-500">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent mb-2">
            💰 Support Our Mission
          </h1>
          <p className="text-gray-600">
            Help us meet our agent expenditures and operational costs. Your financial support helps us rescue more food and feed more people.
          </p>
        </div>

        {/* Impact Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-xl p-6 shadow-lg border-l-4 border-green-500">
            <div className="text-2xl font-bold text-green-600">₹50</div>
            <div className="text-sm text-gray-600">Feeds 5 people</div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-lg border-l-4 border-blue-500">
            <div className="text-2xl font-bold text-blue-600">₹200</div>
            <div className="text-sm text-gray-600">Covers agent fuel cost</div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-lg border-l-4 border-purple-500">
            <div className="text-2xl font-bold text-purple-600">₹500</div>
            <div className="text-sm text-gray-600">Full day operations</div>
          </div>
        </div>

        {/* Main Form */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <form onSubmit={handlePayment} className="space-y-6">
            {/* Amount Selection */}
            <div>
              <label className="block text-lg font-semibold text-gray-700 mb-4">
                Select Donation Amount *
              </label>
              
              {/* Predefined amounts */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-4">
                {predefinedAmounts.map((amount) => (
                  <button
                    key={amount}
                    type="button"
                    onClick={() => selectAmount(amount)}
                    className={`p-4 rounded-xl border-2 transition-all font-semibold ${
                      formData.amount === amount.toString()
                        ? 'border-orange-500 bg-orange-50 text-orange-700'
                        : 'border-gray-200 hover:border-orange-300 hover:bg-orange-50'
                    }`}
                  >
                    ₹{amount.toLocaleString()}
                  </button>
                ))}
              </div>

              {/* Custom amount */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Or enter custom amount
                </label>
                <input
                  type="number"
                  name="amount"
                  placeholder="Enter amount (₹)"
                  value={formData.amount}
                  onChange={handleChange}
                  min="1"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                />
              </div>
            </div>

            {/* Donor Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  name="donorName"
                  placeholder="Your full name"
                  value={formData.donorName}
                  onChange={handleChange}
                  required
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  name="donorEmail"
                  placeholder="your.email@example.com"
                  value={formData.donorEmail}
                  onChange={handleChange}
                  required
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number *
              </label>
              <input
                type="tel"
                name="donorPhone"
                placeholder="10-digit phone number"
                value={formData.donorPhone}
                onChange={handleChange}
                required
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
              />
            </div>

            {/* Message */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Message (Optional)
              </label>
              <textarea
                name="message"
                placeholder="Share why you're supporting us..."
                value={formData.message}
                onChange={handleChange}
                rows="3"
                maxLength="500"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all resize-none"
              />
            </div>

            {/* Anonymous option */}
            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                name="isAnonymous"
                id="isAnonymous"
                checked={formData.isAnonymous}
                onChange={handleChange}
                className="w-4 h-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
              />
              <label htmlFor="isAnonymous" className="text-sm text-gray-700">
                Make this donation anonymous
              </label>
            </div>

            {/* Submit Button */}
            <div className="flex space-x-4 pt-4">
              <button
                type="submit"
                disabled={loading}
                className={`flex-1 px-8 py-4 rounded-xl font-semibold transition-all transform hover:scale-105 shadow-lg ${
                  loading
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white'
                }`}
              >
                {loading ? (
                  <>
                    <div className="inline-block animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Processing...
                  </>
                ) : (
                  <>🎉 Donate ₹{formData.amount ? parseInt(formData.amount).toLocaleString() : '0'}</>
                )}
              </button>
              
              <button
                type="button"
                onClick={() => navigate('/donor/dashboard')}
                className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-4 rounded-xl font-semibold transition-all transform hover:scale-105 shadow-lg"
              >
                Cancel
              </button>
            </div>
          </form>

          {/* Security Note */}
          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center space-x-2">
              <span className="text-2xl">🔒</span>
              <div>
                <h3 className="font-semibold text-blue-800">Secure Payment</h3>
                <p className="text-blue-700 text-sm">
                  Your payment is processed securely through Razorpay. We don't store your card details.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MoneyDonation;
