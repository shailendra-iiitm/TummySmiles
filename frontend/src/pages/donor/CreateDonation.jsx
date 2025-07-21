import { useState, useEffect } from 'react';
import api from '../../services/api';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';

const CreateDonation = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    foodType: '',
    quantity: '',
    pickupAddress: '',
    pickupLocation: {
      lat: '',
      lng: ''
    }
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [locationError, setLocationError] = useState('');

  // Auto-detect location on component mount
  useEffect(() => {
    getCurrentLocation();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by this browser');
      toast.error('Geolocation not supported');
      return;
    }

    setIsGettingLocation(true);
    setLocationError('');

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setFormData(prev => ({
          ...prev,
          pickupLocation: {
            lat: latitude.toFixed(6),
            lng: longitude.toFixed(6)
          }
        }));
        
        // Also try to get address from coordinates
        reverseGeocode(latitude, longitude);
        
        setIsGettingLocation(false);
        toast.success('📍 Location detected automatically!');
      },
      (error) => {
        console.error('Geolocation error:', error);
        setIsGettingLocation(false);
        
        switch(error.code) {
          case error.PERMISSION_DENIED:
            setLocationError('Location access denied. Please enter coordinates manually.');
            toast.error('Location access denied');
            break;
          case error.POSITION_UNAVAILABLE:
            setLocationError('Location information unavailable. Please enter coordinates manually.');
            toast.error('Location unavailable');
            break;
          case error.TIMEOUT:
            setLocationError('Location request timed out. Please try again.');
            toast.error('Location timeout');
            break;
          default:
            setLocationError('Unknown location error. Please enter coordinates manually.');
            toast.error('Location error');
            break;
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000
      }
    );
  };

  const reverseGeocode = async (lat, lng) => {
    try {
      // Using OpenStreetMap Nominatim for reverse geocoding (free service)
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&addressdetails=1`
      );
      
      if (response.ok) {
        const data = await response.json();
        if (data.display_name) {
          setFormData(prev => ({
            ...prev,
            pickupAddress: data.display_name
          }));
          toast.success('📍 Address auto-filled from location!');
        }
      }
    } catch (error) {
      console.error('Reverse geocoding failed:', error);
      // Don't show error to user as this is optional
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'lat' || name === 'lng') {
      setFormData((prev) => ({
        ...prev,
        pickupLocation: {
          ...prev.pickupLocation,
          [name]: value
        }
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      await api.post('/donor/create', formData);
      setSuccess('Donation created successfully!');
      toast.success('🎉 Donation created successfully!');
      setTimeout(() => navigate('/donor/dashboard'), 1500);
    } catch (err) {
      console.error('Failed to create donation:', err);
      const errorMessage = err.response?.data?.msg || 'Failed to create donation';
      setError(errorMessage);
      toast.error(`❌ ${errorMessage}`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 p-4 md:p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 border-t-4 border-orange-500">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent mb-2">
            🍱 Create New Donation
          </h1>
          <p className="text-gray-600">
            Share your extra food with those in need. We'll automatically detect your location to help with pickup!
          </p>
        </div>

        {/* Location Permission Info */}
        <div className="bg-blue-100 border border-blue-300 rounded-lg p-4 mb-6">
          <div className="flex items-center space-x-2">
            <span className="text-2xl">📍</span>
            <div>
              <h3 className="font-semibold text-blue-800">Location Detection</h3>
              <p className="text-blue-700 text-sm">
                We'll automatically detect your location for easier pickup. Please allow location access when prompted, 
                or you can enter coordinates manually.
              </p>
            </div>
          </div>
        </div>

        {/* Main Form */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          {error && (
            <div className="bg-red-100 border border-red-300 text-red-700 px-4 py-3 rounded mb-4">
              ❌ {error}
            </div>
          )}
          {success && (
            <div className="bg-green-100 border border-green-300 text-green-700 px-4 py-3 rounded mb-4">
              ✅ {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Food Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Food Type *
              </label>
              <input
                type="text"
                name="foodType"
                placeholder="e.g., Cooked Rice, Vegetables, Bread"
                value={formData.foodType}
                onChange={handleChange}
                required
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
              />
            </div>

            {/* Quantity */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Quantity *
              </label>
              <input
                type="text"
                name="quantity"
                placeholder="e.g., 5 plates, 2kg, Feeds 10 people"
                value={formData.quantity}
                onChange={handleChange}
                required
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
              />
            </div>

            {/* Pickup Address */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Pickup Address *
              </label>
              <input
                type="text"
                name="pickupAddress"
                placeholder="Address will be auto-filled if location is detected"
                value={formData.pickupAddress}
                onChange={handleChange}
                required
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
              />
            </div>

            {/* Location Detection Section */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-semibold text-blue-800">📍 Pickup Location</h3>
                <button
                  type="button"
                  onClick={getCurrentLocation}
                  disabled={isGettingLocation}
                  className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                    isGettingLocation 
                      ? 'bg-gray-400 cursor-not-allowed' 
                      : 'bg-blue-500 hover:bg-blue-600 text-white hover:scale-105'
                  }`}
                >
                  {isGettingLocation ? (
                    <>
                      <div className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Getting Location...
                    </>
                  ) : (
                    <>🎯 Detect My Location</>
                  )}
                </button>
              </div>
              
              {locationError && (
                <div className="bg-red-100 border border-red-300 text-red-700 px-3 py-2 rounded mb-3">
                  ⚠️ {locationError}
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Latitude
                  </label>
                  <input
                    type="number"
                    step="any"
                    name="lat"
                    placeholder="e.g., 28.6139"
                    value={formData.pickupLocation.lat}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Longitude
                  </label>
                  <input
                    type="number"
                    step="any"
                    name="lng"
                    placeholder="e.g., 77.2090"
                    value={formData.pickupLocation.lng}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                  />
                </div>
              </div>
              
              {formData.pickupLocation.lat && formData.pickupLocation.lng && (
                <div className="mt-3 p-3 bg-green-100 border border-green-300 rounded-lg">
                  <p className="text-green-800 text-sm">
                    ✅ Location set: {formData.pickupLocation.lat}, {formData.pickupLocation.lng}
                  </p>
                  <p className="text-green-700 text-xs mt-1">
                    💡 Tip: You can manually edit these coordinates if needed
                  </p>
                </div>
              )}
            </div>

            {/* Submit Button */}
            <div className="flex space-x-4 pt-4">
              <button
                type="submit"
                className="flex-1 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-8 py-4 rounded-xl font-semibold transition-all transform hover:scale-105 shadow-lg"
              >
                🎉 Submit Donation
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
        </div>
      </div>
    </div>
  );
};

export default CreateDonation;
