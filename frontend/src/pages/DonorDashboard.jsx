import React from 'react';
import Navbar from '../components/Navbar';

const DonorDashboard = () => {
  return (
  <>
      <Navbar />
      <div className="p-4">
        <h2 className="text-xl font-bold">Donor Dashboard</h2>
        <p>You can donate food and view your donation history here.</p>
      </div>
    </>
  );
};
export default DonorDashboard;
