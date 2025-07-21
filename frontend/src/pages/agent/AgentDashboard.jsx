import { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";
import { toast } from "react-hot-toast";
import DonationMap from "../../components/common/DonationMap";
import RoutePreviewWithStats from "../../components/common/RoutePreviewWithStats";

const AgentDashboard = () => {
  const [assigned, setAssigned] = useState([]);
  const [history, setHistory] = useState([]);
  const [showRoute, setShowRoute] = useState(false);
  const [selectedDonation, setSelectedDonation] = useState(null);
  const [agentLocation, setAgentLocation] = useState(null);
  const [profile, setProfile] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [updatedProfile, setUpdatedProfile] = useState({ name: "", address: "" });

  const fetchAssigned = useCallback(async () => {
    try {
      const res = await api.get('/agent/assigned');
      setAssigned(res.data);
    } catch (error) {
      console.error('Error loading assigned donations:', error);
      toast.error("Error loading assigned donations");
    }
  }, []);

  const fetchHistory = useCallback(async () => {
    try {
      const res = await api.get('/agent/history');
      setHistory(res.data);
    } catch (error) {
      console.error('Error loading history:', error);
      toast.error("Error loading history");
    }
  }, []);

  const fetchProfile = useCallback(async () => {
    try {
      const res = await api.get('/agent/profile');
      setProfile(res.data);
      setUpdatedProfile({ name: res.data.name, address: res.data.address });
    } catch (error) {
      console.error('Failed to fetch profile:', error);
      toast.error("Failed to fetch profile");
    }
  }, []);

  const updateProfile = async () => {
    try {
      await api.patch('/agent/profile', updatedProfile);
      toast.success("Profile updated");
      setEditMode(false);
      fetchProfile();
    } catch (error) {
      console.error('Failed to update profile:', error);
      toast.error("Failed to update profile");
    }
  };

  const handleStatus = async (id, action) => {
    try {
      await api.patch(`/agent/pickup/${id}/${action}`, {});
      toast.success(`Marked as ${action.replace("-", " ")}`);
      fetchAssigned();
      fetchHistory();
    } catch (error) {
      console.error(`${action} error:`, error);
      toast.error(`Failed to ${action.replace("-", " ")}`);
    }
  };

  const handleShowRoute = (donation) => {
    console.log("Agent loc:", agentLocation);
    console.log("Pickup loc:", donation.pickupLocation);
    if (!agentLocation) return toast.error("Agent location not available");
    if (!donation.pickupLocation?.lat || !donation.pickupLocation?.lng)
      return toast.error("Pickup location not available");

    setSelectedDonation(donation);
    setShowRoute(true);
  };

  const getLiveAgentLocation = useCallback(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setAgentLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        () => toast.error("Could not get your location")
      );
    }
  }, []);

  useEffect(() => {
    fetchAssigned();
    fetchHistory();
    fetchProfile();
    getLiveAgentLocation();
  }, [fetchAssigned, fetchHistory, fetchProfile, getLiveAgentLocation]);
  return (
    <div className="p-6 space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold">👤 Agent Dashboard</h2>
        <div className="flex gap-4">
          <Link
            to="/agent/status"
            className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-6 py-3 rounded-lg font-semibold transition-all transform hover:scale-105 shadow-lg flex items-center space-x-2"
          >
            <span>⏱️</span>
            <span>Work Status</span>
          </Link>
          <Link
            to="/agent/location"
            className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-all transform hover:scale-105 shadow-lg flex items-center space-x-2"
          >
            <span>📍</span>
            <span>Update Location</span>
          </Link>
        </div>
      </div>
      <h2 className="text-3xl font-bold">👤 Agent Dashboard</h2>

      {/* Profile Section */}
      <div className="p-4 border rounded bg-white shadow">
        <h3 className="text-xl font-semibold mb-2">My Profile</h3>
        {editMode ? (
          <>
            <input
              type="text"
              value={updatedProfile.name}
              onChange={(e) => setUpdatedProfile({ ...updatedProfile, name: e.target.value })}
              placeholder="Name"
              className="border p-2 w-full mb-2 rounded"
            />
            <input
              type="text"
              value={updatedProfile.address}
              onChange={(e) => setUpdatedProfile({ ...updatedProfile, address: e.target.value })}
              placeholder="Address"
              className="border p-2 w-full mb-2 rounded"
            />
            <button
              onClick={updateProfile}
              className="bg-green-600 text-white px-3 py-1 rounded mr-2"
            >
              Save
            </button>
            <button
              onClick={() => setEditMode(false)}
              className="bg-gray-400 text-white px-3 py-1 rounded"
            >
              Cancel
            </button>
          </>
        ) : (
          <>
            <p><strong>Name:</strong> {profile?.name}</p>
            <p><strong>Phone:</strong> {profile?.phone}</p>
            <p><strong>Address:</strong> {profile?.address}</p>
            <button
              onClick={() => setEditMode(true)}
              className="mt-2 bg-blue-600 text-white px-3 py-1 rounded"
            >
              Edit Profile
            </button>
          </>
        )}
      </div>

      {/* Assigned Donations */}
      <h3 className="text-2xl font-semibold">Assigned Donations</h3>
      {assigned.length === 0 ? (
        <p>No active assignments.</p>
      ) : (
        assigned.map((d) => (
          <div key={d._id} className="border p-4 rounded shadow space-y-2">
            <h4 className="font-semibold">{d.foodType}</h4>
            <p>Quantity: {d.quantity}</p>
            <p>Donor: {d.donor?.name}</p>
            <p>Pickup Address: {d.pickupAddress}</p>
            <p>Status: {d.status}</p>

            {d.pickupLocation && (
              <div className="mt-2">
                <DonationMap lat={d.pickupLocation.lat} lng={d.pickupLocation.lng} />
                <button
                  onClick={() => handleShowRoute(d)}
                  className="mt-2 bg-purple-600 text-white px-3 py-1 rounded"
                >
                  View Route
                </button>
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

            {d.status === "collected" && (
              <button
                onClick={() => handleStatus(d._id, "deliver")}
                className="bg-indigo-600 text-white px-3 py-1 rounded"
              >
                Mark as Delivered
              </button>
            )}
          </div>
        ))
      )}

      {/* Pickup History */}
      <h3 className="text-2xl font-semibold mt-10">Pickup History</h3>
      {history.length === 0 ? (
        <p>No history yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {history.map((d) => (
            <div key={d._id} className="p-4 bg-gray-100 border rounded">
              <h4 className="font-semibold">{d.foodType}</h4>
              <p>Quantity: {d.quantity}</p>
              <p>Status: {d.status}</p>
              <p>Donor: {d.donor?.name}</p>
              <p className="text-sm text-gray-600">Updated: {new Date(d.updatedAt).toLocaleString()}</p>
              {d.pickupLocation && (
                <DonationMap lat={d.pickupLocation.lat} lng={d.pickupLocation.lng} />
              )}
            </div>
          ))}
        </div>
      )}

      {/* Route Modal */}
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
              className="absolute top-2 right-2 text-white bg-red-600 px-2 py-1 rounded"
            >
              ✕
            </button>
            <div className="flex gap-2 mt-4">
              <button
                onClick={() =>
                  window.open(
                    `https://www.google.com/maps/dir/${agentLocation.lat},${agentLocation.lng}/${selectedDonation.pickupLocation.lat},${selectedDonation.pickupLocation.lng}`,
                    "_blank"
                  )
                }
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
