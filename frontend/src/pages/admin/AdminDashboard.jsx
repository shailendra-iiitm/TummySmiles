import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";
import { toast } from "react-hot-toast";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("donations");
  const [donations, setDonations] = useState([]);
  const [agents, setAgents] = useState([]);
  const [donors, setDonors] = useState([]);
  const [stats, setStats] = useState({});
  const [collectedDonations, setCollectedDonations] = useState([]);
  const [statusFilter, setStatusFilter] = useState("all");
  const [suggestedAgents, setSuggestedAgents] = useState({});

  const fetchDonations = useCallback(async () => {
    try {
      const endpoint =
        statusFilter === "all"
          ? "/admin/donations"
          : `/admin/donations?status=${statusFilter}`;

      const res = await api.get(endpoint);
      setDonations(res.data);
    } catch (error) {
      console.error('Failed to fetch donations:', error);
      toast.error("Failed to fetch donations");
    }
  }, [statusFilter]);

  const fetchAgents = useCallback(async () => {
    try {
      const res = await api.get("/admin/agents");
      setAgents(res.data);
    } catch (error) {
      console.error('Failed to load agents:', error);
      toast.error("Failed to load agents");
    }
  }, []);

  const fetchDonors = useCallback(async () => {
    try {
      const res = await api.get("/admin/donors");
      setDonors(res.data);
    } catch (error) {
      console.error('Failed to load donors:', error);
      toast.error("Failed to load donors");
    }
  }, []);

  const fetchStats = useCallback(async () => {
    try {
      const res = await api.get("/admin/stats");
      setStats(res.data);
    } catch (error) {
      console.error('Failed to load stats:', error);
      toast.error("Failed to load stats");
    }
  }, []);

  const fetchCollectedDonations = useCallback(async () => {
    try {
      const res = await api.get("/admin/donations/collected");
      setCollectedDonations(res.data);
    } catch (error) {
      console.error('Failed to load collected donations:', error);
      toast.error("Failed to load collected donations");
    }
  }, []);

  const blockUser = async (userId) => {
    try {
      await api.patch(`/admin/user/${userId}/block`);
      toast.success("User blocked successfully");
      fetchDonors(); // Refresh the list
      fetchAgents();
    } catch (error) {
      console.error('Failed to block user:', error);
      toast.error("Failed to block user");
    }
  };

  const unblockUser = async (userId) => {
    try {
      await api.patch(`/admin/user/${userId}/unblock`);
      toast.success("User unblocked successfully");
      fetchDonors(); // Refresh the list
      fetchAgents();
    } catch (error) {
      console.error('Failed to unblock user:', error);
      toast.error("Failed to unblock user");
    }
  };

  const deleteUser = async (userId) => {
    if (window.confirm("Are you sure you want to delete this user? This action cannot be undone.")) {
      try {
        await api.delete(`/admin/user/${userId}`);
        toast.success("User deleted successfully");
        fetchDonors(); // Refresh the list
        fetchAgents();
      } catch (error) {
        console.error('Failed to delete user:', error);
        toast.error("Failed to delete user");
      }
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await api.patch(`/admin/donation/${id}/status`, { status });
      toast.success(`Marked as ${status}`);
      fetchDonations();
    } catch (error) {
      console.error('Failed to update status:', error);
      toast.error("Failed to update status");
    }
  };

  const assignAgent = async (donationId, agentId) => {
    try {
      await api.patch(`/admin/donation/${donationId}/assign-agent`, { agentId });
      toast.success("Agent assigned");
      fetchDonations();
    } catch (error) {
      console.error('Failed to assign agent:', error);
      toast.error("Failed to assign agent");
    }
  };

  const fetchSuggestedAgents = async (donationId) => {
    try {
      console.log('Fetching suggested agents for donation:', donationId);
      const donation = donations.find(d => d._id === donationId);
      console.log('Full donation object:', donation);
      console.log('Available donation fields:', donation ? Object.keys(donation) : 'No donation found');
      console.log('pickupLocation:', donation?.pickupLocation);
      console.log('location:', donation?.location);
      
      const res = await api.get(`/admin/donation/${donationId}/suggested-agents`);
      setSuggestedAgents(prev => ({
        ...prev,
        [donationId]: res.data.suggestedAgents
      }));
    } catch (error) {
      console.error('Failed to fetch suggested agents:', error);
      console.error('Error response:', error.response?.data);
      toast.error(`Failed to get suggestions: ${error.response?.data?.msg || error.message}`);
    }
  };

  const deleteDonation = async (id) => {
    try {
      await api.delete(`/admin/donation/${id}`);
      toast.success("Donation deleted");
      fetchDonations();
    } catch (error) {
      console.error('Delete failed:', error);
      toast.error("Delete failed");
    }
  };

  useEffect(() => {
    fetchDonations();
    if (activeTab === 'assign' || activeTab === 'users') {
      fetchAgents();
    }
    if (activeTab === 'users') {
      fetchDonors();
    }
    if (activeTab === 'stats') {
      fetchStats();
      fetchCollectedDonations();
    }
  }, [activeTab, statusFilter, fetchDonations, fetchAgents, fetchDonors, fetchStats, fetchCollectedDonations]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 border-t-4 border-orange-500">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                Admin Dashboard
              </h1>
              <p className="text-gray-600 mt-1">Manage donations, agents, and platform statistics</p>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                to="/admin/profile"
                className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-4 py-2 rounded-lg font-semibold transition-all transform hover:scale-105 shadow-lg flex items-center space-x-2"
              >
                <span>👑</span>
                <span>Profile</span>
              </Link>
              <div className="bg-gradient-to-br from-orange-100 to-red-100 p-4 rounded-xl">
                <span className="text-2xl">👑</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-xl shadow-lg mb-6 overflow-hidden">
          <div className="flex border-b border-gray-200">
            {["donations", "assign", "users", "stats"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 px-6 py-4 text-center font-medium transition-all duration-200 ${
                  activeTab === tab
                    ? "bg-gradient-to-r from-orange-500 to-red-500 text-white border-b-2 border-orange-600"
                    : "text-gray-600 hover:text-orange-600 hover:bg-orange-50"
                }`}
              >
                <div className="flex items-center justify-center space-x-2">
                  <span>
                    {tab === "donations" ? "🍽️" : tab === "assign" ? "👥" : tab === "users" ? "👤" : "📊"}
                  </span>
                  <span className="capitalize">
                    {tab === "donations" ? "Manage Donations" : 
                     tab === "assign" ? "Assign Agents" : 
                     tab === "users" ? "Manage Users" : "View Stats"}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* ----------------- Donations Tab ----------------- */}
        {activeTab === "donations" && (
          <>
            <div className="flex gap-2 items-center mt-4">
              <label>Filter by status:</label>
              <select
                className="border px-2 py-1"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">All</option>
                <option value="pending">Pending</option>
                <option value="accepted">Accepted</option>
                <option value="agent_rejected">Agent Rejected</option>
                <option value="not_found">Not Found</option>
                <option value="rejected">Rejected</option>
                <option value="collected">Collected</option>
              </select>
            </div>

            <div className="space-y-4 mt-4">
              {donations.length === 0 ? (
                <p>No donations found</p>
              ) : (
                donations.map((d) => (
                  <div
                    key={d._id}
                    className="border rounded p-4 shadow space-y-1"
                  >
                    <h3 className="font-bold">{d.foodType}</h3>
                    <p>Quantity: {d.quantity}</p>
                    <p>Status: <span className="font-semibold">{d.status}</span></p>
                    <p>Donor: {d.donor?.name}</p>
                    {d.agent && <p>Agent: {d.agent?.name}</p>}

                    <div className="flex flex-wrap gap-2 mt-2">
                      {d.status === "pending" && (
                        <>
                          <button
                            onClick={() => updateStatus(d._id, "accepted")}
                            className="bg-green-600 text-white px-3 py-1 rounded"
                          >
                            Accept
                          </button>
                          <button
                            onClick={() => updateStatus(d._id, "rejected")}
                            className="bg-red-600 text-white px-3 py-1 rounded"
                          >
                            Reject
                          </button>
                        </>
                      )}
                      <button
                        onClick={() => deleteDonation(d._id)}
                        className="bg-gray-600 text-white px-3 py-1 rounded"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </>
        )}

        {/* ----------------- Assign Tab ----------------- */}
        {activeTab === "assign" && (
          <>
            <h2 className="text-xl font-semibold mb-4 mt-4">
              🎯 Assign Agents to Donations (Smart Distance-Based Suggestions)
            </h2>
            <div className="space-y-6">
              {donations
                .filter((d) =>
                  ["accepted", "agent_rejected", "not_found"].includes(d.status) && (!d.agent || d.status !== "accepted")
                )
                .map((d) => (
                  <div
                    key={d._id}
                    className="border-2 border-gray-200 p-6 rounded-xl shadow-lg bg-gradient-to-r from-orange-50 to-red-50"
                  >
                    <div className="grid md:grid-cols-2 gap-4">
                      {/* Donation Info */}
                      <div>
                        <h3 className="font-bold text-lg text-orange-700 mb-2">🍽️ {d.foodType}</h3>
                        <div className="space-y-1 text-gray-700">
                          <p><span className="font-semibold">Quantity:</span> {d.quantity}</p>
                          <p><span className="font-semibold">Donor:</span> {d.donor?.name}</p>
                          <p><span className="font-semibold">Status:</span> 
                            <span className={`ml-1 px-2 py-1 rounded text-sm font-semibold ${
                              d.status === 'accepted' ? 'bg-green-100 text-green-800' :
                              d.status === 'agent_rejected' ? 'bg-red-100 text-red-800' :
                              'bg-yellow-100 text-yellow-800'
                            }`}>
                              {d.status}
                            </span>
                          </p>
                          {(d.pickupLocation || d.location) && (
                            <p><span className="font-semibold">📍 Location:</span> {
                              d.pickupAddress || 
                              (d.pickupLocation ? `${d.pickupLocation.lat}, ${d.pickupLocation.lng}` : 
                               d.location ? `${d.location.lat}, ${d.location.lng}` : 'No coordinates')
                            }</p>
                          )}
                        </div>
                      </div>

                      {/* Agent Assignment */}
                      <div>
                        <div className="mb-3">
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Assign Agent:
                          </label>
                          <select
                            className="w-full border-2 border-gray-300 px-3 py-2 rounded-lg focus:border-orange-500 focus:outline-none"
                            onChange={(e) => assignAgent(d._id, e.target.value)}
                          >
                            <option value="">🎯 Select Agent</option>
                            {agents.map((a) => (
                              <option key={a._id} value={a._id}>
                                {a.name} {a.location ? `(Has Location)` : `(No Location)`}
                              </option>
                            ))}
                          </select>
                        </div>

                        {/* Suggested Agents Button */}
                        {((d.pickupLocation && d.pickupLocation.lat && d.pickupLocation.lng) || 
                          (d.location && d.location.lat && d.location.lng)) && (
                          <div>
                            <button
                              onClick={() => fetchSuggestedAgents(d._id)}
                              className="w-full bg-blue-500 text-white px-3 py-2 rounded-lg hover:bg-blue-600 transition-colors text-sm font-semibold"
                            >
                              🧭 Find Nearest Agents
                            </button>
                            
                            {/* Display Suggested Agents */}
                            {suggestedAgents[d._id] && (
                              <div className="mt-3 bg-white rounded-lg p-3 border">
                                <h4 className="font-semibold text-sm text-gray-700 mb-2">
                                  📍 Nearest Available Agents:
                                </h4>
                                <div className="space-y-2 max-h-32 overflow-y-auto">
                                  {suggestedAgents[d._id].slice(0, 5).map((agent) => (
                                    <div
                                      key={agent._id}
                                      className="flex justify-between items-center p-2 bg-gray-50 rounded cursor-pointer hover:bg-gray-100"
                                      onClick={() => assignAgent(d._id, agent._id)}
                                    >
                                      <span className="text-sm font-medium">{agent.name}</span>
                                      <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                                        {agent.distance} km away
                                      </span>
                                    </div>
                                  ))}
                                  {suggestedAgents[d._id].length === 0 && (
                                    <p className="text-sm text-gray-500">No agents found with location data</p>
                                  )}
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                        
                        {(!((d.pickupLocation && d.pickupLocation.lat && d.pickupLocation.lng) || 
                           (d.location && d.location.lat && d.location.lng))) && (
                          <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                            <p className="text-sm text-yellow-800">
                              ⚠️ This donation has no location data. Smart suggestions unavailable.
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </>
        )}

        {/* ----------------- Users Tab ----------------- */}
        {activeTab === "users" && (
          <>
            <div className="grid md:grid-cols-2 gap-6">
              {/* Donors Management */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-xl font-bold mb-4 text-orange-600">👥 Manage Donors</h3>
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {donors.map((donor) => (
                    <div
                      key={donor._id}
                      className="p-4 border rounded-lg hover:bg-orange-50 transition-colors"
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <h4 className="font-semibold">{donor.name}</h4>
                          <p className="text-gray-600">{donor.email}</p>
                          <div className="text-sm text-gray-500 space-y-1 mt-1">
                            <p>Status: {donor.isBlocked ? "🔴 Blocked" : "🟢 Active"}</p>
                            <p>Total Donations: {donor.totalDonations || 0}</p>
                            <p>Completed: {donor.completedDonations || 0}</p>
                            <p>Pending: {donor.pendingDonations || 0}</p>
                          </div>
                        </div>
                        <div className="flex flex-col space-y-2">
                          {!donor.isBlocked ? (
                            <button
                              onClick={() => blockUser(donor._id)}
                              className="bg-yellow-500 text-white px-3 py-1 rounded text-sm hover:bg-yellow-600 transition-colors"
                            >
                              Block
                            </button>
                          ) : (
                            <button
                              onClick={() => unblockUser(donor._id)}
                              className="bg-green-500 text-white px-3 py-1 rounded text-sm hover:bg-green-600 transition-colors"
                            >
                              Unblock
                            </button>
                          )}
                          <button
                            onClick={() => deleteUser(donor._id)}
                            className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600 transition-colors"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                  {donors.length === 0 && (
                    <p className="text-gray-500 text-center py-4">No donors found</p>
                  )}
                </div>
              </div>

              {/* Agents Management */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-xl font-bold mb-4 text-blue-600">🚗 Manage Agents</h3>
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {agents.map((agent) => (
                    <div
                      key={agent._id}
                      className="p-4 border rounded-lg hover:bg-blue-50 transition-colors"
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <h4 className="font-semibold flex items-center space-x-2">
                            <span>{agent.name}</span>
                            <span className={`h-2 w-2 rounded-full ${
                              agent.agentStatus === 'active' ? 'bg-green-500 animate-pulse' : 'bg-gray-400'
                            }`}></span>
                          </h4>
                          <p className="text-gray-600">{agent.email}</p>
                          <div className="text-sm text-gray-500 space-y-1 mt-1">
                            <p>Status: {agent.isBlocked ? "🔴 Blocked" : "🟢 Active"}</p>
                            <p>Working Status: <span className={`font-semibold ${
                              agent.agentStatus === 'active' ? 'text-green-600' : 'text-gray-600'
                            }`}>{agent.agentStatus || 'inactive'}</span></p>
                            <p>Total Deliveries: {agent.totalDeliveries || 0}</p>
                            <p>Active Deliveries: {agent.activeDeliveries || 0}</p>
                            <p>Today: {agent.todayHours || 0}h | Month: {agent.monthlyHours || 0}h</p>
                            {agent.location && (
                              <p>📍 Location: Available</p>
                            )}
                          </div>
                        </div>
                        <div className="flex flex-col space-y-2">
                          {!agent.isBlocked ? (
                            <button
                              onClick={() => blockUser(agent._id)}
                              className="bg-yellow-500 text-white px-3 py-1 rounded text-sm hover:bg-yellow-600 transition-colors"
                            >
                              Block
                            </button>
                          ) : (
                            <button
                              onClick={() => unblockUser(agent._id)}
                              className="bg-green-500 text-white px-3 py-1 rounded text-sm hover:bg-green-600 transition-colors"
                            >
                              Unblock
                            </button>
                          )}
                          <button
                            onClick={() => deleteUser(agent._id)}
                            className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600 transition-colors"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                  {agents.length === 0 && (
                    <p className="text-gray-500 text-center py-4">No agents found</p>
                  )}
                </div>
              </div>
            </div>
          </>
        )}

        {/* ----------------- Stats Tab ----------------- */}
        {activeTab === "stats" && (
          <>
            {/* Main Stats Cards */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-xl p-6 shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-100">Total Donations</p>
                    <p className="text-3xl font-bold">{stats.totalDonations || 0}</p>
                    <p className="text-xs text-blue-200 mt-1">Today: {stats.todayDonations || 0}</p>
                  </div>
                  <span className="text-4xl opacity-80">🍽️</span>
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-xl p-6 shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-green-100">Completed</p>
                    <p className="text-3xl font-bold">{stats.completedDonations || 0}</p>
                    <p className="text-xs text-green-200 mt-1">Rate: {stats.completionRate || 0}%</p>
                  </div>
                  <span className="text-4xl opacity-80">✅</span>
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 text-white rounded-xl p-6 shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-yellow-100">Pending</p>
                    <p className="text-3xl font-bold">{stats.pendingDonations || 0}</p>
                    <p className="text-xs text-yellow-200 mt-1">This Week: {stats.weeklyDonations || 0}</p>
                  </div>
                  <span className="text-4xl opacity-80">⏳</span>
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-xl p-6 shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-purple-100">Active Agents</p>
                    <p className="text-3xl font-bold">{stats.activeAgents || 0}</p>
                    <p className="text-xs text-purple-200 mt-1">Total: {stats.totalAgents || 0}</p>
                  </div>
                  <span className="text-4xl opacity-80">👥</span>
                </div>
              </div>
            </div>

            {/* Detailed Status Breakdown */}
            <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
              <div className="bg-white rounded-lg p-4 shadow border-l-4 border-orange-500">
                <p className="text-sm text-gray-600">Accepted</p>
                <p className="text-2xl font-bold text-orange-600">{stats.acceptedDonations || 0}</p>
                <p className="text-xs text-gray-500">By Admin</p>
              </div>
              <div className="bg-white rounded-lg p-4 shadow border-l-4 border-blue-500">
                <p className="text-sm text-gray-600">Agent Accepted</p>
                <p className="text-2xl font-bold text-blue-600">{stats.agentAcceptedDonations || 0}</p>
                <p className="text-xs text-gray-500">In Progress</p>
              </div>
              <div className="bg-white rounded-lg p-4 shadow border-l-4 border-teal-500">
                <p className="text-sm text-gray-600">Collected</p>
                <p className="text-2xl font-bold text-teal-600">{stats.collectedDonations || 0}</p>
                <p className="text-xs text-gray-500">Picked Up</p>
              </div>
              <div className="bg-white rounded-lg p-4 shadow border-l-4 border-red-500">
                <p className="text-sm text-gray-600">Rejected</p>
                <p className="text-2xl font-bold text-red-600">{stats.totalRejectedDonations || 0}</p>
                <p className="text-xs text-gray-500">All Types</p>
              </div>
              <div className="bg-white rounded-lg p-4 shadow border-l-4 border-indigo-500">
                <p className="text-sm text-gray-600">Total Users</p>
                <p className="text-2xl font-bold text-indigo-600">{stats.totalUsers || 0}</p>
                <p className="text-xs text-gray-500">Platform Wide</p>
              </div>
            </div>

            {/* Rejection Breakdown */}
            <div className="grid md:grid-cols-3 gap-4 mb-6">
              <div className="bg-white rounded-lg p-4 shadow border-l-4 border-red-400">
                <p className="text-sm text-gray-600">Admin Rejected</p>
                <p className="text-2xl font-bold text-red-500">{stats.rejectedDonations || 0}</p>
              </div>
              <div className="bg-white rounded-lg p-4 shadow border-l-4 border-red-500">
                <p className="text-sm text-gray-600">Agent Rejected</p>
                <p className="text-2xl font-bold text-red-600">{stats.agentRejectedDonations || 0}</p>
              </div>
              <div className="bg-white rounded-lg p-4 shadow border-l-4 border-red-600">
                <p className="text-sm text-gray-600">Not Found</p>
                <p className="text-2xl font-bold text-red-700">{stats.notFoundDonations || 0}</p>
              </div>
            </div>

            {/* Recent Collected Donations */}
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              {/* Summary Stats */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-xl font-bold mb-4 text-gray-800">📊 Donation Flow Summary</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                    <span className="text-blue-800 font-semibold">📝 Pending (Awaiting Review)</span>
                    <span className="text-2xl font-bold text-blue-600">{stats.pendingDonations || 0}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-orange-50 rounded-lg">
                    <span className="text-orange-800 font-semibold">✅ Accepted (Ready for Agent)</span>
                    <span className="text-2xl font-bold text-orange-600">{stats.acceptedDonations || 0}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                    <span className="text-green-800 font-semibold">🚗 In Progress (Agent Working)</span>
                    <span className="text-2xl font-bold text-green-600">{(stats.agentAcceptedDonations || 0) + (stats.collectedDonations || 0)}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-emerald-50 rounded-lg">
                    <span className="text-emerald-800 font-semibold">🎉 Delivered (Complete)</span>
                    <span className="text-2xl font-bold text-emerald-600">{stats.completedDonations || 0}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
                    <span className="text-red-800 font-semibold">❌ All Rejections</span>
                    <span className="text-2xl font-bold text-red-600">{stats.totalRejectedDonations || 0}</span>
                  </div>
                </div>
              </div>

              {/* Agent Performance */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-xl font-bold mb-4 text-gray-800">👥 Agent Workforce</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                    <span className="text-green-800 font-semibold">🟢 Active Agents</span>
                    <span className="text-2xl font-bold text-green-600">{stats.activeAgents || 0}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-800 font-semibold">👨‍💼 Total Agents</span>
                    <span className="text-2xl font-bold text-gray-600">{stats.totalAgents || 0}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                    <span className="text-blue-800 font-semibold">📈 Utilization Rate</span>
                    <span className="text-2xl font-bold text-blue-600">{stats.agentUtilization || 0}%</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
                    <span className="text-purple-800 font-semibold">👥 Total Donors</span>
                    <span className="text-2xl font-bold text-purple-600">{stats.totalDonors || 0}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-yellow-50 rounded-lg">
                    <span className="text-yellow-800 font-semibold">🚫 Blocked Users</span>
                    <span className="text-2xl font-bold text-yellow-600">{stats.blockedUsers || 0}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Collected Donations */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-bold mb-4 text-green-600">🎉 Recently Collected Donations</h3>
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {collectedDonations.map((donation) => (
                  <div
                    key={donation._id}
                    className="p-4 border rounded-lg bg-green-50 border-green-200"
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <h4 className="font-semibold text-green-800">{donation.foodType}</h4>
                        <p className="text-gray-600">Quantity: {donation.quantity}</p>
                        <p className="text-gray-600">Donor: {donation.donor?.name}</p>
                        <p className="text-gray-600">Agent: {donation.agent?.name}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-500">
                          Collected: {new Date(donation.collectedAt || donation.updatedAt).toLocaleDateString()}
                        </p>
                        <span className="bg-green-200 text-green-800 px-2 py-1 rounded-full text-sm">
                          ✅ Completed
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
                {collectedDonations.length === 0 && (
                  <p className="text-gray-500 text-center py-4">No collected donations found</p>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
