import { useEffect, useState, useCallback } from "react";
import api from "../../services/api";
import { toast } from "react-hot-toast";

const AgentProfile = () => {
  const [profile, setProfile] = useState({ name: "", address: "" });
  const [loading, setLoading] = useState(false);

  const fetchProfile = useCallback(async () => {
    try {
      const res = await api.get("/agent/profile");
      setProfile({ name: res.data.name, address: res.data.address || "" });
    } catch (error) {
      console.error('Failed to load profile:', error);
      toast.error("Failed to load profile");
    }
  }, []);

  const updateProfile = async () => {
    setLoading(true);
    try {
      await api.put("/agent/profile", profile);
      toast.success("Profile updated");
    } catch (error) {
      console.error('Update failed:', error);
      toast.error("Update failed");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  return (
    <div className="p-6 max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-4">My Profile</h2>
      <label className="block mb-2 font-medium">Name</label>
      <input
        type="text"
        className="w-full border px-3 py-2 rounded mb-4"
        value={profile.name}
        onChange={(e) => setProfile({ ...profile, name: e.target.value })}
      />
      <label className="block mb-2 font-medium">Address</label>
      <input
        type="text"
        className="w-full border px-3 py-2 rounded mb-4"
        value={profile.address}
        onChange={(e) => setProfile({ ...profile, address: e.target.value })}
      />
      <button
        onClick={updateProfile}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
        disabled={loading}
      >
        {loading ? "Updating..." : "Update Profile"}
      </button>
    </div>
  );
};

export default AgentProfile;
