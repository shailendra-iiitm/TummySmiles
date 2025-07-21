import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { toast } from 'react-hot-toast';

const AgentStatus = () => {
  const [agentStatus, setAgentStatus] = useState('inactive');
  const [workingStats, setWorkingStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [currentSession, setCurrentSession] = useState(null);

  useEffect(() => {
    fetchWorkingStats();
  }, []);

  const fetchWorkingStats = async () => {
    try {
      const res = await api.get('/agent/working-stats');
      setWorkingStats(res.data);
      setAgentStatus(res.data.agentStatus);
      
      // Check if there's an active session today
      const today = new Date().toDateString();
      const todaySession = res.data.recentSessions?.find(session => {
        const sessionDate = new Date(session.date).toDateString();
        return sessionDate === today && !session.endTime;
      });
      setCurrentSession(todaySession);
    } catch (error) {
      console.error('Failed to fetch working stats:', error);
      toast.error('Failed to load working statistics');
    }
  };

  const updateAgentStatus = async (status) => {
    setLoading(true);
    try {
      await api.patch('/agent/status', { status });
      setAgentStatus(status);
      toast.success(`Status updated to ${status}`);
      fetchWorkingStats();
    } catch (error) {
      console.error('Failed to update status:', error);
      toast.error('Failed to update status');
    } finally {
      setLoading(false);
    }
  };

  const updateWorkingTime = async (action) => {
    setLoading(true);
    try {
      await api.patch('/agent/working-time', { action });
      toast.success(`Working time ${action} recorded`);
      fetchWorkingStats();
    } catch (error) {
      console.error('Failed to update working time:', error);
      toast.error(`Failed to ${action} working time`);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const formatHours = (hours) => {
    return `${Math.round(hours * 100) / 100} hours`;
  };

  if (!workingStats) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Status Control Panel */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">📊 Agent Status & Working Time</h2>
        
        {/* Current Status Display */}
        <div className="mb-6 p-4 rounded-lg border-2" style={{
          backgroundColor: agentStatus === 'active' ? '#f0f9ff' : '#fef3f2',
          borderColor: agentStatus === 'active' ? '#3b82f6' : '#ef4444'
        }}>
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">Current Status</h3>
              <p className="flex items-center space-x-2 mt-1">
                <span className={`h-3 w-3 rounded-full ${
                  agentStatus === 'active' ? 'bg-green-500 animate-pulse' : 'bg-red-500'
                }`}></span>
                <span className="font-medium capitalize">{agentStatus}</span>
              </p>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => updateAgentStatus('active')}
                disabled={loading || agentStatus === 'active'}
                className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                  agentStatus === 'active'
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-green-500 text-white hover:bg-green-600'
                }`}
              >
                🟢 Go Active
              </button>
              <button
                onClick={() => updateAgentStatus('inactive')}
                disabled={loading || agentStatus === 'inactive'}
                className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                  agentStatus === 'inactive'
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-red-500 text-white hover:bg-red-600'
                }`}
              >
                🔴 Go Inactive
              </button>
            </div>
          </div>
        </div>

        {/* Working Time Controls */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Session Controls */}
          <div className="bg-blue-50 rounded-lg p-4">
            <h4 className="font-semibold text-blue-800 mb-3">⏰ Working Session</h4>
            <div className="space-y-2">
              {!currentSession ? (
                <button
                  onClick={() => updateWorkingTime('start')}
                  disabled={loading}
                  className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  🚀 Start Working
                </button>
              ) : (
                <div className="space-y-2">
                  {currentSession.status === 'working' && (
                    <>
                      <button
                        onClick={() => updateWorkingTime('break')}
                        disabled={loading}
                        className="w-full bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 transition-colors disabled:opacity-50"
                      >
                        ☕ Take Break
                      </button>
                      <button
                        onClick={() => updateWorkingTime('end')}
                        disabled={loading}
                        className="w-full bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50"
                      >
                        🏁 End Session
                      </button>
                    </>
                  )}
                  {currentSession.status === 'break' && (
                    <>
                      <button
                        onClick={() => updateWorkingTime('resume')}
                        disabled={loading}
                        className="w-full bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50"
                      >
                        🔄 Resume Working
                      </button>
                      <button
                        onClick={() => updateWorkingTime('end')}
                        disabled={loading}
                        className="w-full bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50"
                      >
                        🏁 End Session
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Today's Stats */}
          <div className="bg-green-50 rounded-lg p-4">
            <h4 className="font-semibold text-green-800 mb-3">📈 Today's Summary</h4>
            <div className="space-y-2 text-sm">
              <p><span className="font-medium">Hours Worked:</span> {formatHours(workingStats.todayHours)}</p>
              <p><span className="font-medium">Current Session:</span> {
                currentSession 
                  ? `${currentSession.status} since ${new Date(currentSession.startTime).toLocaleTimeString()}`
                  : 'No active session'
              }</p>
            </div>
          </div>
        </div>
      </div>

      {/* Statistics Dashboard */}
      <div className="grid md:grid-cols-3 gap-6">
        {/* Today */}
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100">Today</p>
              <p className="text-2xl font-bold">{formatHours(workingStats.todayHours)}</p>
            </div>
            <span className="text-3xl opacity-80">📅</span>
          </div>
        </div>

        {/* This Month */}
        <div className="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100">This Month</p>
              <p className="text-2xl font-bold">{formatHours(workingStats.monthlyHours)}</p>
            </div>
            <span className="text-3xl opacity-80">📊</span>
          </div>
        </div>

        {/* Total Time */}
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100">Total Time</p>
              <p className="text-2xl font-bold">{formatTime(workingStats.totalWorkingTime)}</p>
            </div>
            <span className="text-3xl opacity-80">⏱️</span>
          </div>
        </div>
      </div>

      {/* Recent Sessions */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-xl font-bold mb-4 text-gray-800">📋 Recent Working Sessions</h3>
        <div className="space-y-3 max-h-60 overflow-y-auto">
          {workingStats.recentSessions && workingStats.recentSessions.length > 0 ? (
            workingStats.recentSessions.slice(-7).reverse().map((session, index) => (
              <div key={index} className="border rounded-lg p-3 hover:bg-gray-50">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">
                      {new Date(session.date).toLocaleDateString()}
                    </p>
                    <p className="text-sm text-gray-600">
                      {session.startTime && (
                        <>Started: {new Date(session.startTime).toLocaleTimeString()}</>
                      )}
                      {session.endTime && (
                        <> - Ended: {new Date(session.endTime).toLocaleTimeString()}</>
                      )}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${
                      session.status === 'finished' ? 'bg-green-100 text-green-800' :
                      session.status === 'working' ? 'bg-blue-100 text-blue-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {session.status}
                    </span>
                    {session.totalHours && (
                      <p className="text-sm font-medium mt-1">
                        {formatHours(session.totalHours)}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-center py-4">No recent sessions</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AgentStatus;
