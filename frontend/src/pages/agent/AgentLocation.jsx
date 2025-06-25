import axios from "axios";
import { toast } from "react-hot-toast";
import { useState } from "react";

const AgentLocation = () => {
  const token = localStorage.getItem("token");
  const [loading, setLoading] = useState(false);
  const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  const sendLocation = async () => {
    if (!navigator.geolocation) {
      return toast.error("Geolocation not supported by your browser.");
    }

    setLoading(true);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          await axios.patch(
            `${BASE_URL}/api/agent/location`,
            { lat: latitude, lng: longitude },
            { headers: { Authorization: `Bearer ${token}` } }
          );
          toast.success(`Location sent: (${latitude.toFixed(4)}, ${longitude.toFixed(4)})`);
        } catch (err) {
          console.error("Location update error:", err);
          toast.error("Failed to send location to server");
        } finally {
          setLoading(false);
        }
      },
      (error) => {
        console.error("Geolocation error:", error);
        toast.error("Permission denied or failed to get GPS location");
        setLoading(false);
      }
    );
  };

  return (
    <div className="p-6 max-w-md mx-auto text-center">
      <h2 className="text-2xl font-semibold mb-4">Send Your Current Location</h2>
      <p className="text-gray-600 mb-6">
        Share your current GPS location to help with pickup assignments.
      </p>
      <button
        onClick={sendLocation}
        className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
        disabled={loading}
      >
        {loading ? "Sending..." : "Send Location"}
      </button>
    </div>
  );
};

export default AgentLocation;
// This component allows agents to send their current GPS location to the server.
// It uses the Geolocation API to get the user's coordinates and sends them via a PATCH request