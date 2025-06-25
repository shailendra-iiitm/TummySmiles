import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";

const AdminDashboard = () => {
  const [donations, setDonations] = useState([]);
  const [agents, setAgents] = useState([]);
  const [statusFilter, setStatusFilter] = useState("all");
  const [assigningId, setAssigningId] = useState(null);
  const token = localStorage.getItem("token");

  const fetchDonations = async () => {
    try {
      const endpoint =
        statusFilter === "all"
          ? "/api/admin/donations"
          : `/api/admin/donations?status=${statusFilter}`;
      const res = await axios.get(`http://localhost:5000${endpoint}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setDonations(res.data);
    } catch {
      toast.error("Failed to load donations");
    }
  };

  const fetchAgents = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/admin/agents", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAgents(res.data);
    } catch {
      toast.error("Failed to load agents");
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await axios.put(
        `http://localhost:5000/api/admin/donations/${id}/status`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success(`Donation marked as ${status}`);
      fetchDonations();
    } catch {
      toast.error("Failed to update status");
    }
  };

  const assignAgent = async (donationId, agentId) => {
    try {
      await axios.put(
        `http://localhost:5000/api/admin/donations/${donationId}/assign`,
        { agentId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Agent assigned with drop location");
      setAssigningId(null);
      fetchDonations();
    } catch {
      toast.error("Assignment failed");
    }
  };

  const deleteDonation = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/admin/donations/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Donation deleted");
      fetchDonations();
    } catch {
      toast.error("Delete failed");
    }
  };

  useEffect(() => {
    fetchDonations();
    fetchAgents();
  }, [statusFilter]);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Admin Dashboard</h2>

      <div className="flex gap-4 mb-6 items-center">
        <label className="text-sm font-medium">Filter by status:</label>
        <select
          className="border px-3 py-1 rounded"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="all">All</option>
          <option value="pending">Pending</option>
          <option value="accepted">Accepted</option>
          <option value="collected">Collected</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      {donations.length === 0 ? (
        <p>No donations found.</p>
      ) : (
        <div className="space-y-6">
          {donations.map((d) => (
            <div key={d._id} className="border rounded p-4 shadow space-y-2">
              <h3 className="font-semibold">{d.foodType}</h3>
              <p className="text-gray-600">Quantity: {d.quantity}</p>
              <p className="text-sm text-gray-500">
                Donor: {d.donor?.name || "N/A"}
              </p>
              <p>Status: <span className="font-semibold">{d.status}</span></p>
              {d.agent && (
                <p className="text-sm text-blue-600">
                  Assigned to: {d.agent?.name || "Unknown"}
                </p>
              )}

              <div className="flex flex-wrap gap-2 mt-2">
                {d.status === "pending" && (
                  <>
                    <button
                      onClick={() => updateStatus(d._id, "accepted")}
                      className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                    >
                      Accept
                    </button>
                    <button
                      onClick={() => updateStatus(d._id, "rejected")}
                      className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                    >
                      Reject
                    </button>
                  </>
                )}

                {d.status === "accepted" && !d.agent && (
                  <div className="flex gap-2 items-center">
                    <select
                      className="border px-2 py-1 rounded"
                      onChange={(e) =>
                        assignAgent(d._id, e.target.value)
                      }
                    >
                      <option value="">Assign agent</option>
                      {agents.map((a) => (
                        <option key={a._id} value={a._id}>
                          {a.name}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                <button
                  onClick={() => deleteDonation(d._id)}
                  className="bg-gray-600 text-white px-3 py-1 rounded hover:bg-gray-700"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
