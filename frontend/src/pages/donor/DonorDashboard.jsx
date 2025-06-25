import { Link } from 'react-router-dom';

const DonorDashboard = () => {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-2xl font-bold mb-6">Welcome, Donor 👋</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link
          to="/donor/create"
          className="block bg-green-500 hover:bg-green-600 text-white p-4 rounded shadow"
        >
          🍱 Create a Donation
        </Link>

        <Link
          to="/donor/my-donations"
          className="block bg-blue-500 hover:bg-blue-600 text-white p-4 rounded shadow"
        >
          📦 View My Donations
        </Link>

        <Link
          to="/donor/profile"
          className="block bg-yellow-500 hover:bg-yellow-600 text-white p-4 rounded shadow"
        >
          👤 Update Profile
        </Link>
      </div>
    </div>
  );
};

export default DonorDashboard;
