import api from "../../services/api";
import { toast } from "react-hot-toast";
import { useState, useEffect } from "react";

const AgentLocation = () => {
  const [loading, setLoading] = useState(false);
  const [currentLocation, setCurrentLocation] = useState({
    lat: '',
    lng: '',
    address: ''
  });
  const [locationError, setLocationError] = useState('');
  const [autoDetecting, setAutoDetecting] = useState(false);

  // Auto-detect location on component mount
  useEffect(() => {
    detectLocation();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const detectLocation = () => {
    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by this browser');
      toast.error('Geolocation not supported');
      return;
    }

    setAutoDetecting(true);
    setLocationError('');

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        
        setCurrentLocation({
          lat: latitude.toFixed(6),
          lng: longitude.toFixed(6),
          address: 'Loading address...'
        });
        
        // Get address from coordinates
        await reverseGeocode(latitude, longitude);
        
        setAutoDetecting(false);
        toast.success('📍 Current location detected!');
      },
      (error) => {
        console.error('Geolocation error:', error);
        setAutoDetecting(false);
        
        switch(error.code) {
          case error.PERMISSION_DENIED:
            setLocationError('Location access denied. Please allow location access.');
            toast.error('Location access denied');
            break;
          case error.POSITION_UNAVAILABLE:
            setLocationError('Location information unavailable.');
            toast.error('Location unavailable');
            break;
          case error.TIMEOUT:
            setLocationError('Location request timed out. Please try again.');
            toast.error('Location timeout');
            break;
          default:
            setLocationError('Unknown location error.');
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
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&addressdetails=1`
      );
      
      if (response.ok) {
        const data = await response.json();
        setCurrentLocation(prev => ({
          ...prev,
          address: data.display_name || 'Address not found'
        }));
      }
    } catch (error) {
      console.error('Reverse geocoding failed:', error);
      setCurrentLocation(prev => ({
        ...prev,
        address: 'Could not get address'
      }));
    }
  };

  const sendCurrentLocation = async () => {
    if (!currentLocation.lat || !currentLocation.lng) {
      toast.error('Please detect your location first');
      return;
    }

    setLoading(true);

    try {
      const response = await api.patch('/agent/location', { 
        lat: parseFloat(currentLocation.lat), 
        lng: parseFloat(currentLocation.lng),
        address: currentLocation.address || ''
      });
      toast.success(`✅ Location sent successfully!`);
      console.log('Location update response:', response.data);
    } catch (err) {
      console.error("Location update error:", err);
      toast.error(`Failed to send location: ${err.response?.data?.msg || err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-4 md:p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 border-t-4 border-blue-500">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">
            📍 Location Management
          </h1>
          <p className="text-gray-600">
            Share your current location to help with pickup assignments and route optimization.
          </p>
        </div>

        {/* Current Location Display */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Current Location</h2>
            <button
              onClick={detectLocation}
              disabled={autoDetecting}
              className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                autoDetecting 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-blue-500 hover:bg-blue-600 text-white hover:scale-105'
              }`}
            >
              {autoDetecting ? (
                <>
                  <div className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Detecting...
                </>
              ) : (
                <>🔄 Refresh Location</>
              )}
            </button>
          </div>

          {locationError && (
            <div className="bg-red-100 border border-red-300 text-red-700 px-4 py-3 rounded mb-4">
              ⚠️ {locationError}
            </div>
          )}

          {currentLocation.lat && currentLocation.lng ? (
            <div className="space-y-4">
              {/* Location Details */}
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h3 className="font-semibold text-green-800 mb-2">📍 Location Detected</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Latitude</p>
                    <p className="font-mono text-lg">{currentLocation.lat}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Longitude</p>
                    <p className="font-mono text-lg">{currentLocation.lng}</p>
                  </div>
                </div>
                <div className="mt-4">
                  <p className="text-sm text-gray-600">Address</p>
                  <p className="text-sm text-gray-800">{currentLocation.address}</p>
                </div>
              </div>

              {/* Send Location Button */}
              <button
                onClick={sendCurrentLocation}
                disabled={loading}
                className={`w-full py-4 rounded-lg font-semibold text-white transition-all ${
                  loading
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 hover:scale-105 shadow-lg'
                }`}
              >
                {loading ? (
                  <>
                    <div className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Sending Location...
                  </>
                ) : (
                  <>🚀 Send Location to Server</>
                )}
              </button>
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="bg-gray-100 rounded-full p-6 w-24 h-24 mx-auto mb-4 flex items-center justify-center">
                <span className="text-4xl">📍</span>
              </div>
              <p className="text-gray-600 mb-4">
                {autoDetecting ? 'Detecting your location...' : 'Location not detected yet'}
              </p>
              {!autoDetecting && (
                <button
                  onClick={detectLocation}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold transition-all hover:scale-105"
                >
                  🎯 Detect My Location
                </button>
              )}
            </div>
          )}
        </div>

        {/* Info Section */}
        <div className="bg-blue-100 border border-blue-300 rounded-lg p-6">
          <h3 className="font-semibold text-blue-800 mb-2">💡 Why Share Location?</h3>
          <ul className="space-y-2 text-blue-700 text-sm">
            <li className="flex items-center">
              <span className="text-green-500 mr-2">✅</span>
              Helps assign nearby donation pickups efficiently
            </li>
            <li className="flex items-center">
              <span className="text-green-500 mr-2">✅</span>
              Reduces travel time and improves delivery speed
            </li>
            <li className="flex items-center">
              <span className="text-green-500 mr-2">✅</span>
              Enables better route planning for multiple pickups
            </li>
            <li className="flex items-center">
              <span className="text-green-500 mr-2">✅</span>
              Location is only shared with the admin system for assignments
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AgentLocation;
// This component allows agents to send their current GPS location to the server.
// It uses the Geolocation API to get the user's coordinates and sends them via a PATCH request