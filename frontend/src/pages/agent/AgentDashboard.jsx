import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import DonationMap from "@/components/common/DonationMap";
import RoutePreviewWithStats from "@/components/common/RoutePreviewWithStats";

const AgentDashboard = () => {
  const [assigned, setAssigned] = useState([]);
  const [history, setHistory] = useState([]);
  const [showRoute, setShowRoute] = useState(false);
  const [selectedDonation, setSelectedDonation] = useState(null);
  const [agentLocation, setAgentLocation] = useState(null);
  
  const token = localStorage.getItem("token");
  const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  // Get agent's current location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setAgentLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          console.error("Error getting location:", error);
          toast.error("Could not get your location");
        }
      );
    }
  }, []);

  const fetchAgentLocation = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/agent/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.data?.agentLocation) {
        setAgentLocation(res.data.agentLocation);
      }
    } catch {
      toast.error("Agent location not found");
    }
  };

  useEffect(() => {
    fetchAssigned();
    fetchHistory();
    fetchAgentLocation();
  }, []);

  const fetchAssigned = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/agent/assigned`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAssigned(res.data);
    } catch {
      toast.error("Error loading assigned donations");
    }
  };

  const fetchHistory = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/agent/history`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setHistory(res.data);
    } catch {
      toast.error("Error loading history");
    }
  };

  const handleStatus = async (id, action) => {
    let url = `${BASE_URL}/api/agent/${action}/${id}`;
    try {
      await axios.put(url, {}, { headers: { Authorization: `Bearer ${token}` } });
      toast.success(`Marked as ${action.replace("-", " ")}`);
      fetchAssigned();
      fetchHistory();
    } catch {
      toast.error(`Failed to ${action}`);
    }
  };

  const handleShowRoute = (donation) => {
    if (!agentLocation) {
      toast.error("Agent location not available");
      return;
    }
    if (!donation.pickupLocation?.lat || !donation.pickupLocation?.lng) {
      toast.error("Pickup location not available");
      return;
    }
    setSelectedDonation(donation);
    setShowRoute(true);
  };

  // Early return if agent location is unavailable
  if (!agentLocation) return <p className="text-red-600">Agent location unavailable.</p>;

  return (
    <div className="p-6 space-y-8">
      <h2 className="text-2xl font-bold">Assigned Donations</h2>

      {assigned.length === 0 ? (
        <p>No active assignments.</p>
      ) : (
        assigned.map((d) => (
          <div key={d._id} className="border p-4 rounded shadow space-y-2">
            <h3 className="font-semibold">{d.foodType}</h3>
            <p className="text-gray-600">Quantity: {d.quantity}</p>
            <p className="text-sm text-gray-500">Donor: {d.donor?.name}</p>
            <p className="text-sm text-gray-500">Pickup Address: {d.pickupAddress}</p>
            <p>Status: {d.status}</p>

            {/* Add DonationMap for pickup location */}
            {d.pickupLocation && d.pickupLocation.lat && d.pickupLocation.lng && (
              <div className="mt-4">
                <h4 className="font-medium mb-2">Pickup Location:</h4>
                <DonationMap lat={d.pickupLocation.lat} lng={d.pickupLocation.lng} />
                
                {/* Conditional View Route Button */}
                {d.pickupLocation?.lat && d.pickupLocation?.lng ? (
                  <button onClick={() => handleShowRoute(d)}
                    className="mt-2 bg-purple-600 text-white px-3 py-1 rounded hover:bg-purple-700"
                  >
                    View Route
                  </button>

                ) : (
                  <p className="text-sm text-red-600 mt-2">No pickup coordinates.</p>
                )}
              </div>
            )}

            {d.status === "accepted" && (
              <div className="flex gap-2">
                <button
                  onClick={() => handleStatus(d._id, "accept")}
                  className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                >
                  Accept
                </button>
                <button
                  onClick={() => handleStatus(d._id, "reject")}
                  className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                >
                  Reject
                </button>
              </div>
            )}

            {d.status === "agent_accepted" && (
              <div className="flex gap-2">
                <button
                  onClick={() => handleStatus(d._id, "collect")}
                  className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                >
                  Mark as Collected
                </button>
                <button
                  onClick={() => handleStatus(d._id, "not-found")}
                  className="bg-yellow-600 text-white px-3 py-1 rounded hover:bg-yellow-700"
                >
                  Not Found
                </button>
              </div>
            )}
          </div>
        ))
      )}

      <h2 className="text-2xl font-bold mt-10">Pickup History</h2>
      {history.length === 0 ? (
        <p>No pickups yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {history.map((d) => (
            <div key={d._id} className="p-4 bg-gray-100 border rounded">
              <h4 className="font-semibold">{d.foodType}</h4>
              <p>Quantity: {d.quantity}</p>
              <p className="text-sm text-gray-600">Donor: {d.donor?.name}</p>
              <p className="text-green-700 text-sm">Status: {d.status}</p>
              
              {/* Add DonationMap for history items too */}
              {d.pickupLocation && d.pickupLocation.lat && d.pickupLocation.lng && (
                <div className="mt-2">
                  <h5 className="font-medium text-sm mb-1">Pickup Location:</h5>
                  <DonationMap lat={d.pickupLocation.lat} lng={d.pickupLocation.lng} />
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Enhanced Responsive Route Preview Modal */}
      {showRoute && selectedDonation && (
        <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex items-center justify-center p-4">
          <div className="bg-white p-4 rounded shadow w-full max-w-3xl max-h-[90vh] overflow-auto relative">
            <h3 className="text-lg font-bold mb-2">Route to Pickup Location</h3>
            <p className="text-sm text-gray-600 mb-4">
              From your location to: {selectedDonation.pickupAddress}
            </p>

            <RoutePreviewWithStats
              from={agentLocation}
              to={selectedDonation.pickupLocation}
            />

            <button
              onClick={() => setShowRoute(false)}
              className="absolute top-2 right-2 text-white bg-red-600 px-2 py-1 rounded hover:bg-red-700"
            >
              ✕
            </button>

            {/* Additional action buttons */}
            <div className="flex gap-2 mt-4">
              <button 
                onClick={() => {
                  const googleMapsUrl = `https://www.google.com/maps/dir/${agentLocation.lat},${agentLocation.lng}/${selectedDonation.pickupLocation.lat},${selectedDonation.pickupLocation.lng}`;
                  window.open(googleMapsUrl, '_blank');
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Open in Google Maps
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AgentDashboard;
