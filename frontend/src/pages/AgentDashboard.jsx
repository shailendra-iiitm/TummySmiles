import React from 'react';
import Navbar from '../components/Navbar';

const AgentDashboard = () => {
  return (
    <>
      <Navbar />
      <div className="p-4">
        <h2 className="text-xl font-bold">Agent Dashboard</h2>
        <p>View your assigned collections and mark them as completed.</p>
      </div>
    </>
  );
};

export default AgentDashboard;
