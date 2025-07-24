import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";
import { toast } from "react-hot-toast";
import AdminChatManagement from "../../components/admin/AdminChatManagement";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("donations");
  const [donations, setDonations] = useState([]);
  const [agents, setAgents] = useState([]);
  const [donors, setDonors] = useState([]);
  const [stats, setStats] = useState({});
  const [collectedDonations, setCollectedDonations] = useState([]);
  const [statusFilter, setStatusFilter] = useState("all");
  const [suggestedAgents, setSuggestedAgents] = useState({});
  const [supportTickets, setSupportTickets] = useState([]);
  const [supportStats, setSupportStats] = useState({});
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [showTicketModal, setShowTicketModal] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [newStatus, setNewStatus] = useState('');
  const [moneyDonations, setMoneyDonations] = useState([]);
  const [moneyDonationStats, setMoneyDonationStats] = useState({});

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

  const fetchSupportTickets = useCallback(async () => {
    try {
      const res = await api.get("/support/tickets");
      setSupportTickets(res.data.tickets);
    } catch (error) {
      console.error('Failed to load support tickets:', error);
      toast.error("Failed to load support tickets");
    }
  }, []);

  const fetchSupportStats = useCallback(async () => {
    try {
      const res = await api.get("/support/stats");
      setSupportStats(res.data);
    } catch (error) {
      console.error('Failed to load support statistics:', error);
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

  const fetchMoneyDonations = useCallback(async () => {
    try {
      const res = await api.get("/payment/admin/all");
      setMoneyDonations(res.data.donations || []);
    } catch (error) {
      console.error('Failed to load money donations:', error);
      toast.error("Failed to load money donations");
    }
  }, []);

  const fetchMoneyDonationStats = useCallback(async () => {
    try {
      const res = await api.get("/payment/admin/analytics");
      setMoneyDonationStats(res.data.analytics || {});
    } catch (error) {
      console.error('Failed to load money donation stats:', error);
      toast.error("Failed to load money donation stats");
    }
  }, []);

  const updateSupportTicket = async (ticketId, updateData) => {
    try {
      const response = await api.put(`/support/ticket/${ticketId}`, updateData);
      toast.success(response.data.message || "Support ticket updated successfully");
      fetchSupportTickets();
      if (showTicketModal && selectedTicket && selectedTicket._id === ticketId) {
        // Refresh selected ticket data
        const updatedTicket = await api.get(`/support/ticket/${ticketId}`);
        setSelectedTicket(updatedTicket.data);
      }
    } catch (error) {
      console.error('Failed to update support ticket:', error);
      toast.error(error.response?.data?.message || "Failed to update support ticket");
    }
  };

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

  const handleTicketDetails = async (ticket) => {
    try {
      const response = await api.get(`/support/ticket/${ticket._id}`);
      setSelectedTicket(response.data);
      setNewStatus(ticket.status);
      setShowTicketModal(true);
    } catch (error) {
      console.error('Failed to load ticket details:', error);
      toast.error("Failed to load ticket details");
    }
  };

  const handleTicketStatusUpdate = async () => {
    if (!selectedTicket || !newStatus) return;
    
    const updateData = { status: newStatus };
    if (newComment.trim()) {
      updateData.adminComment = newComment.trim();
    }
    
    await updateSupportTicket(selectedTicket._id, updateData);
    setNewComment('');
    setShowTicketModal(false);
  };

  const handleAddComment = async () => {
    if (!selectedTicket || !newComment.trim()) return;
    
    await updateSupportTicket(selectedTicket._id, {
      adminComment: newComment.trim()
    });
    setNewComment('');
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
    if (activeTab === 'support') {
      fetchSupportTickets();
      fetchSupportStats();
    }
    if (activeTab === 'money') {
      fetchMoneyDonations();
      fetchMoneyDonationStats();
    }
  }, [activeTab, statusFilter, fetchDonations, fetchAgents, fetchDonors, fetchStats, fetchCollectedDonations, fetchSupportTickets, fetchSupportStats, fetchMoneyDonations, fetchMoneyDonationStats]);

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
            {["donations", "assign", "users", "money", "support", "chat", "stats"].map((tab) => (
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
                    {tab === "donations" ? "🍽️" : 
                     tab === "assign" ? "👥" : 
                     tab === "users" ? "👤" : 
                     tab === "money" ? "💰" : 
                     tab === "support" ? "🎫" : 
                     tab === "chat" ? "💬" : "📊"}
                  </span>
                  <span className="capitalize">
                    {tab === "donations" ? "Manage Donations" : 
                     tab === "assign" ? "Assign Agents" : 
                     tab === "users" ? "Manage Users" : 
                     tab === "money" ? "Money Donations" : 
                     tab === "support" ? "Ticket Management" :
                     tab === "chat" ? "Chat Support" :
                     tab === "stats" ? "View Stats" : "View Stats"}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* ----------------- Donations Tab ----------------- */}
        {activeTab === "donations" && (
          <>
            <div className="flex gap-4 items-center mb-6">
              <label className="text-gray-700 font-semibold">Filter by status:</label>
              <select
                className="border-2 border-gray-300 px-4 py-2 rounded-lg focus:border-orange-500 focus:outline-none bg-white shadow-sm"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">🔍 All Donations</option>
                <option value="pending">⏳ Pending</option>
                <option value="accepted">✅ Accepted</option>
                <option value="agent_rejected">❌ Agent Rejected</option>
                <option value="not_found">🔍 Not Found</option>
                <option value="rejected">❌ Rejected</option>
                <option value="collected">📦 Collected</option>
                <option value="delivered">🎉 Delivered</option>
              </select>
            </div>

            <div className="grid gap-6">
              {donations.length === 0 ? (
                <div className="bg-white rounded-xl shadow-lg p-8 text-center">
                  <div className="text-6xl mb-4">🍽️</div>
                  <h3 className="text-xl font-semibold text-gray-700 mb-2">No donations found</h3>
                  <p className="text-gray-500">Try adjusting your filter or check back later</p>
                </div>
              ) : (
                donations.map((d) => (
                  <div
                    key={d._id}
                    className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border-l-4 border-orange-500"
                  >
                    <div className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-3">
                            <span className="text-2xl">🍽️</span>
                            <h3 className="text-xl font-bold text-gray-800">{d.foodType}</h3>
                            <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                              d.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                              d.status === 'accepted' ? 'bg-blue-100 text-blue-800' :
                              d.status === 'delivered' ? 'bg-green-100 text-green-800' :
                              d.status === 'collected' ? 'bg-teal-100 text-teal-800' :
                              d.status === 'rejected' || d.status === 'agent_rejected' ? 'bg-red-100 text-red-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {d.status.replace('_', ' ').toUpperCase()}
                            </span>
                          </div>
                          
                          <div className="grid md:grid-cols-2 gap-4 text-sm">
                            <div className="space-y-2">
                              <p className="flex items-center">
                                <span className="font-semibold text-gray-600 w-20">Quantity:</span>
                                <span className="text-gray-800">{d.quantity}</span>
                              </p>
                              <p className="flex items-center">
                                <span className="font-semibold text-gray-600 w-20">Donor:</span>
                                <span className="text-gray-800">{d.donor?.name}</span>
                              </p>
                              {d.agent && (
                                <p className="flex items-center">
                                  <span className="font-semibold text-gray-600 w-20">Agent:</span>
                                  <span className="text-gray-800">{d.agent?.name}</span>
                                </p>
                              )}
                            </div>
                            <div className="space-y-2">
                              <p className="flex items-center">
                                <span className="font-semibold text-gray-600 w-24">Created:</span>
                                <span className="text-gray-800">{new Date(d.createdAt).toLocaleDateString()}</span>
                              </p>
                              {d.pickupAddress && (
                                <p className="flex items-start">
                                  <span className="font-semibold text-gray-600 w-24 mt-1">📍 Address:</span>
                                  <span className="text-gray-800 text-xs">{d.pickupAddress}</span>
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2 pt-4 border-t border-gray-100">
                        {d.status === "pending" && (
                          <>
                            <button
                              onClick={() => updateStatus(d._id, "accepted")}
                              className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-semibold transition-colors flex items-center space-x-2"
                            >
                              <span>✅</span>
                              <span>Accept</span>
                            </button>
                            <button
                              onClick={() => updateStatus(d._id, "rejected")}
                              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-semibold transition-colors flex items-center space-x-2"
                            >
                              <span>❌</span>
                              <span>Reject</span>
                            </button>
                          </>
                        )}
                        <button
                          onClick={() => deleteDonation(d._id)}
                          className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg font-semibold transition-colors flex items-center space-x-2"
                        >
                          <span>🗑️</span>
                          <span>Delete</span>
                        </button>
                      </div>
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
        {/* ----------------- Support Tickets Tab ----------------- */}
        {activeTab === "support" && (
          <>
            {/* Support Stats Cards */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
              <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-xl p-6 shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-purple-100">Total Tickets</p>
                    <p className="text-3xl font-bold">{supportStats.totalTickets || 0}</p>
                  </div>
                  <span className="text-4xl opacity-80">🎫</span>
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-yellow-500 to-orange-500 text-white rounded-xl p-6 shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-yellow-100">Open Tickets</p>
                    <p className="text-3xl font-bold">{supportStats.statusStats?.open || 0}</p>
                  </div>
                  <span className="text-4xl opacity-80">🔓</span>
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-blue-500 to-indigo-500 text-white rounded-xl p-6 shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-100">In Progress</p>
                    <p className="text-3xl font-bold">{supportStats.statusStats?.in_progress || 0}</p>
                  </div>
                  <span className="text-4xl opacity-80">⏳</span>
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-green-500 to-emerald-500 text-white rounded-xl p-6 shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-green-100">Avg Response</p>
                    <p className="text-3xl font-bold">{supportStats.avgResponseHours || 0}h</p>
                  </div>
                  <span className="text-4xl opacity-80">⚡</span>
                </div>
              </div>
            </div>

            {/* Support Tickets Table */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white p-6">
                <h2 className="text-2xl font-bold flex items-center">
                  <span className="mr-3">🎫</span>
                  Support Tickets Management
                </h2>
              </div>
              
              <div className="p-6">
                {supportTickets && supportTickets.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="min-w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ticket ID</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Subject</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Priority</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Created</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {supportTickets.map((ticket) => (
                          <tr key={ticket._id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 text-sm font-medium text-gray-900">
                              {ticket.ticketId}
                            </td>
                            <td className="px-6 py-4">
                              <div className="text-sm font-medium text-gray-900">{ticket.subject}</div>
                              <div className="text-sm text-gray-500 truncate max-w-xs">
                                {ticket.message}
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="text-sm font-medium text-gray-900">{ticket.name}</div>
                              <div className="text-sm text-gray-500">{ticket.email}</div>
                            </td>
                            <td className="px-6 py-4">
                              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                ticket.category === 'technical' ? 'bg-red-100 text-red-800' :
                                ticket.category === 'donation' ? 'bg-blue-100 text-blue-800' :
                                ticket.category === 'agent' ? 'bg-green-100 text-green-800' :
                                ticket.category === 'partnership' ? 'bg-purple-100 text-purple-800' :
                                'bg-gray-100 text-gray-800'
                              }`}>
                                {ticket.category}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                ticket.priority === 'urgent' ? 'bg-red-100 text-red-800' :
                                ticket.priority === 'high' ? 'bg-orange-100 text-orange-800' :
                                ticket.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                                'bg-gray-100 text-gray-800'
                              }`}>
                                {ticket.priority}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                ticket.status === 'resolved' ? 'bg-green-100 text-green-800' :
                                ticket.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                                ticket.status === 'under_review' ? 'bg-purple-100 text-purple-800' :
                                ticket.status === 'closed' ? 'bg-gray-100 text-gray-800' :
                                'bg-yellow-100 text-yellow-800'
                              }`}>
                                {ticket.status.replace('_', ' ').toUpperCase()}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-500">
                              {new Date(ticket.createdAt).toLocaleDateString()}
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex space-x-2">
                                <button
                                  onClick={() => handleTicketDetails(ticket)}
                                  className="bg-indigo-500 text-white px-3 py-1 rounded text-xs hover:bg-indigo-600 transition-colors"
                                >
                                  Details
                                </button>
                                {ticket.status === 'open' && (
                                  <>
                                    <button
                                      onClick={() => updateSupportTicket(ticket._id, { status: 'in_progress' })}
                                      className="bg-blue-500 text-white px-3 py-1 rounded text-xs hover:bg-blue-600 transition-colors"
                                    >
                                      Start
                                    </button>
                                    <button
                                      onClick={() => updateSupportTicket(ticket._id, { status: 'under_review' })}
                                      className="bg-purple-500 text-white px-3 py-1 rounded text-xs hover:bg-purple-600 transition-colors"
                                    >
                                      Review
                                    </button>
                                  </>
                                )}
                                {ticket.status === 'in_progress' && (
                                  <>
                                    <button
                                      onClick={() => updateSupportTicket(ticket._id, { status: 'under_review' })}
                                      className="bg-purple-500 text-white px-3 py-1 rounded text-xs hover:bg-purple-600 transition-colors"
                                    >
                                      Review
                                    </button>
                                    <button
                                      onClick={() => updateSupportTicket(ticket._id, { status: 'resolved' })}
                                      className="bg-green-500 text-white px-3 py-1 rounded text-xs hover:bg-green-600 transition-colors"
                                    >
                                      Resolve
                                    </button>
                                  </>
                                )}
                                {ticket.status === 'under_review' && (
                                  <>
                                    <button
                                      onClick={() => updateSupportTicket(ticket._id, { status: 'in_progress' })}
                                      className="bg-blue-500 text-white px-3 py-1 rounded text-xs hover:bg-blue-600 transition-colors"
                                    >
                                      Progress
                                    </button>
                                    <button
                                      onClick={() => updateSupportTicket(ticket._id, { status: 'resolved' })}
                                      className="bg-green-500 text-white px-3 py-1 rounded text-xs hover:bg-green-600 transition-colors"
                                    >
                                      Resolve
                                    </button>
                                  </>
                                )}
                                {ticket.status === 'resolved' && (
                                  <button
                                    onClick={() => updateSupportTicket(ticket._id, { status: 'closed' })}
                                    className="bg-gray-500 text-white px-3 py-1 rounded text-xs hover:bg-gray-600 transition-colors"
                                  >
                                    Close
                                  </button>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <span className="text-6xl mb-4 block">🎫</span>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">No Support Tickets</h3>
                    <p className="text-gray-500">All support tickets will appear here when users submit them.</p>
                  </div>
                )}
              </div>
            </div>
          </>
        )}

        {/* ----------------- Money Donations Management Tab ----------------- */}
        {activeTab === "money" && (
          <>
            {/* Money Donation Stats Cards */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
              <div className="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-xl p-6 shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-green-100">Total Money Donations</p>
                    <p className="text-3xl font-bold">{moneyDonationStats.totalStats?.reduce((acc, stat) => acc + (stat.count || 0), 0) || 0}</p>
                  </div>
                  <span className="text-4xl opacity-80">💰</span>
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-yellow-500 to-orange-500 text-white rounded-xl p-6 shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-yellow-100">Total Amount Collected</p>
                    <p className="text-3xl font-bold">₹{moneyDonationStats.totalStats?.find(stat => stat._id === 'completed')?.totalAmount?.toLocaleString() || 0}</p>
                  </div>
                  <span className="text-4xl opacity-80">💳</span>
                </div>
              </div>

              <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-xl p-6 shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-100">Completed Donations</p>
                    <p className="text-3xl font-bold">{moneyDonationStats.totalStats?.find(stat => stat._id === 'completed')?.count || 0}</p>
                  </div>
                  <span className="text-4xl opacity-80">✅</span>
                </div>
              </div>

              <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-xl p-6 shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-purple-100">Failed Donations</p>
                    <p className="text-3xl font-bold">{moneyDonationStats.totalStats?.find(stat => stat._id === 'failed')?.count || 0}</p>
                  </div>
                  <span className="text-4xl opacity-80">❌</span>
                </div>
              </div>
            </div>

            {/* Money Donations Table */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white p-6">
                <h3 className="text-xl font-bold">💰 Money Donations Management</h3>
                <p className="text-green-100 mt-1">Manage and track all monetary contributions</p>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Donor Details
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Amount
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Payment ID
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {moneyDonations.length === 0 ? (
                      <tr>
                        <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
                          <div className="flex flex-col items-center">
                            <span className="text-6xl mb-4">💰</span>
                            <p className="text-lg font-medium">No money donations found</p>
                            <p className="text-sm">Money donations will appear here once users start contributing</p>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      moneyDonations.map((donation) => (
                        <tr key={donation._id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-10 w-10">
                                <div className="h-10 w-10 rounded-full bg-gradient-to-r from-green-400 to-blue-500 flex items-center justify-center">
                                  <span className="text-white font-medium">
                                    {donation.donorName?.charAt(0)?.toUpperCase() || 'U'}
                                  </span>
                                </div>
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">
                                  {donation.isAnonymous ? 'Anonymous Donor' : donation.donorName}
                                </div>
                                <div className="text-sm text-gray-500">
                                  {donation.isAnonymous ? 'Hidden' : donation.donorEmail}
                                </div>
                                <div className="text-xs text-gray-400">
                                  {donation.isAnonymous ? 'Hidden' : donation.donorPhone}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-lg font-bold text-green-600">
                              ₹{donation.amount?.toLocaleString()}
                            </div>
                            <div className="text-xs text-gray-500">
                              {donation.currency || 'INR'}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              donation.paymentStatus === 'completed' 
                                ? 'bg-green-100 text-green-800' 
                                : donation.paymentStatus === 'failed'
                                ? 'bg-red-100 text-red-800'
                                : donation.paymentStatus === 'pending'
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-gray-100 text-gray-800'
                            }`}>
                              {donation.paymentStatus === 'completed' ? '✅ Completed' : 
                               donation.paymentStatus === 'failed' ? '❌ Failed' : 
                               donation.paymentStatus === 'pending' ? '⏳ Pending' : 
                               donation.paymentStatus}
                            </span>
                            {donation.paymentMethod && (
                              <div className="text-xs text-gray-500 mt-1">
                                via {donation.paymentMethod}
                              </div>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            <div>{new Date(donation.createdAt).toLocaleDateString()}</div>
                            <div className="text-xs text-gray-500">
                              {new Date(donation.createdAt).toLocaleTimeString()}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-mono text-gray-900">
                              {donation.receiptNumber || 'N/A'}
                            </div>
                            {donation.razorpayPaymentId && (
                              <div className="text-xs text-gray-500 truncate max-w-32">
                                {donation.razorpayPaymentId}
                              </div>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <button
                              onClick={() => {
                                navigator.clipboard.writeText(donation.receiptNumber || donation._id);
                                toast.success('Receipt number copied!');
                              }}
                              className="text-blue-600 hover:text-blue-900 mr-3"
                            >
                              📋 Copy Receipt
                            </button>
                            {donation.message && (
                              <button
                                onClick={() => {
                                  toast.info(`Message: ${donation.message}`);
                                }}
                                className="text-green-600 hover:text-green-900"
                              >
                                💬 View Message
                              </button>
                            )}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Monthly Trend Chart */}
            {moneyDonationStats.monthlyTrend && moneyDonationStats.monthlyTrend.length > 0 && (
              <div className="bg-white rounded-xl shadow-lg p-6 mt-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">📈 Monthly Money Donation Trends</h3>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {moneyDonationStats.monthlyTrend.map((trend, index) => (
                    <div key={index} className="bg-gradient-to-r from-blue-50 to-green-50 p-4 rounded-lg">
                      <div className="text-sm text-gray-600">
                        {trend._id.month}/{trend._id.year}
                      </div>
                      <div className="text-lg font-bold text-green-600">
                        ₹{trend.totalAmount.toLocaleString()}
                      </div>
                      <div className="text-sm text-gray-500">
                        {trend.count} donations
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Top Donors */}
            {moneyDonationStats.topDonors && moneyDonationStats.topDonors.length > 0 && (
              <div className="bg-white rounded-xl shadow-lg p-6 mt-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">🏆 Top Money Donors</h3>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {moneyDonationStats.topDonors.map((donor, index) => (
                    <div key={index} className="bg-gradient-to-r from-yellow-50 to-orange-50 p-4 rounded-lg border border-yellow-200">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-lg font-bold text-gray-900">
                            {donor.donorName || 'Anonymous'}
                          </div>
                          <div className="text-2xl font-bold text-orange-600">
                            ₹{donor.totalAmount.toLocaleString()}
                          </div>
                          <div className="text-sm text-gray-500">
                            {donor.donationCount} donations
                          </div>
                        </div>
                        <div className="text-3xl">
                          {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : '🏅'}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        {/* ----------------- Chat Management Tab ----------------- */}
        {activeTab === "chat" && (
          <AdminChatManagement />
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

      {/* Ticket Detail Modal */}
      {showTicketModal && selectedTicket && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-6 rounded-t-xl">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold">Ticket #{selectedTicket.ticketId}</h2>
                  <p className="text-indigo-100 mt-1">{selectedTicket.subject}</p>
                </div>
                <button
                  onClick={() => setShowTicketModal(false)}
                  className="text-white hover:text-indigo-200 text-2xl font-bold"
                >
                  ×
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-6">
              {/* Ticket Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">Contact Info</h3>
                    <div className="mt-2 space-y-1">
                      <p className="text-gray-900">{selectedTicket.name}</p>
                      <p className="text-gray-600">{selectedTicket.email}</p>
                      {selectedTicket.phone && (
                        <p className="text-gray-600">{selectedTicket.phone}</p>
                      )}
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">Category & Priority</h3>
                    <div className="mt-2 flex space-x-3">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                        {selectedTicket.category}
                      </span>
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                        selectedTicket.priority === 'high' ? 'bg-red-100 text-red-800' :
                        selectedTicket.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {selectedTicket.priority.charAt(0).toUpperCase() + selectedTicket.priority.slice(1)} Priority
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">Status & Dates</h3>
                    <div className="mt-2 space-y-2">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-600">Current Status:</span>
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                          selectedTicket.status === 'resolved' ? 'bg-green-100 text-green-800' :
                          selectedTicket.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                          selectedTicket.status === 'under_review' ? 'bg-purple-100 text-purple-800' :
                          selectedTicket.status === 'closed' ? 'bg-gray-100 text-gray-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {selectedTicket.status.replace('_', ' ').toUpperCase()}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">
                        Created: {new Date(selectedTicket.createdAt).toLocaleString()}
                      </p>
                      {selectedTicket.updatedAt !== selectedTicket.createdAt && (
                        <p className="text-sm text-gray-600">
                          Updated: {new Date(selectedTicket.updatedAt).toLocaleString()}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div>
                <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-3">Description</h3>
                <div className="bg-gray-50 rounded-lg p-4 border">
                  <p className="text-gray-700 whitespace-pre-wrap">{selectedTicket.description}</p>
                </div>
              </div>

              {/* Admin Comments */}
              {selectedTicket.adminComments && selectedTicket.adminComments.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-3">Admin Comments & Updates</h3>
                  <div className="space-y-3 max-h-48 overflow-y-auto">
                    {selectedTicket.adminComments.map((comment, index) => (
                      <div key={index} className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-indigo-800">Admin Update</span>
                          <span className="text-sm text-indigo-600">
                            {new Date(comment.createdAt).toLocaleString()}
                          </span>
                        </div>
                        <p className="text-indigo-700">{comment.comment}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Section */}
              <div className="border-t pt-6">
                <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-4">Ticket Actions</h3>
                
                {/* Status Update */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Update Status</label>
                    <select
                      value={newStatus}
                      onChange={(e) => setNewStatus(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    >
                      <option value="open">Open</option>
                      <option value="in_progress">In Progress</option>
                      <option value="under_review">Under Review</option>
                      <option value="resolved">Resolved</option>
                      <option value="closed">Closed</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Add Comment (Optional)</label>
                    <textarea
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      placeholder="Add an internal comment or update for the user..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      rows="3"
                    />
                  </div>

                  <div className="flex space-x-3">
                    <button
                      onClick={handleTicketStatusUpdate}
                      className="flex-1 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors font-medium"
                    >
                      Update Ticket
                    </button>
                    {newComment.trim() && (
                      <button
                        onClick={handleAddComment}
                        className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                      >
                        Add Comment Only
                      </button>
                    )}
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="mt-6 pt-4 border-t">
                  <h4 className="text-sm font-medium text-gray-700 mb-3">Quick Actions</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedTicket.status === 'open' && (
                      <>
                        <button
                          onClick={() => {
                            updateSupportTicket(selectedTicket._id, { status: 'in_progress' });
                            setNewStatus('in_progress');
                          }}
                          className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm hover:bg-blue-200 transition-colors"
                        >
                          Start Working
                        </button>
                        <button
                          onClick={() => {
                            updateSupportTicket(selectedTicket._id, { status: 'under_review' });
                            setNewStatus('under_review');
                          }}
                          className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm hover:bg-purple-200 transition-colors"
                        >
                          Put Under Review
                        </button>
                      </>
                    )}
                    {selectedTicket.status === 'in_progress' && (
                      <>
                        <button
                          onClick={() => {
                            updateSupportTicket(selectedTicket._id, { status: 'under_review' });
                            setNewStatus('under_review');
                          }}
                          className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm hover:bg-purple-200 transition-colors"
                        >
                          Move to Review
                        </button>
                        <button
                          onClick={() => {
                            updateSupportTicket(selectedTicket._id, { status: 'resolved' });
                            setNewStatus('resolved');
                          }}
                          className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm hover:bg-green-200 transition-colors"
                        >
                          Mark Resolved
                        </button>
                      </>
                    )}
                    {selectedTicket.status === 'under_review' && (
                      <>
                        <button
                          onClick={() => {
                            updateSupportTicket(selectedTicket._id, { status: 'in_progress' });
                            setNewStatus('in_progress');
                          }}
                          className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm hover:bg-blue-200 transition-colors"
                        >
                          Back to Progress
                        </button>
                        <button
                          onClick={() => {
                            updateSupportTicket(selectedTicket._id, { status: 'resolved' });
                            setNewStatus('resolved');
                          }}
                          className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm hover:bg-green-200 transition-colors"
                        >
                          Mark Resolved
                        </button>
                      </>
                    )}
                    {selectedTicket.status === 'resolved' && (
                      <button
                        onClick={() => {
                          updateSupportTicket(selectedTicket._id, { status: 'closed' });
                          setNewStatus('closed');
                        }}
                        className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm hover:bg-gray-200 transition-colors"
                      >
                        Close Ticket
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default   AdminDashboard;
