// pages/AdminDashboard.jsx
import React from 'react';
import Navbar from '../components/Navbar';

const AdminDashboard = () => {
   return (
    <>
      <Navbar />
      <div className="p-4">
        <h2 className="text-xl font-bold">Admin Dashboard</h2>
        <p>Manage all food donation requests and assign agents here.</p>
      </div>
    </>
  );
};

export default AdminDashboard;
