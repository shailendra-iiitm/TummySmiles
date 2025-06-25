import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../contexts/AuthContext';


const MyDonations = () => {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [donations, setDonations] = useState([]);
  const [error, setError] = useState('');

  const fetchDonations = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/donor/mine', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setDonations(res.data);
    } catch {
      setError('Failed to fetch donations');
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/donor/donation/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setDonations(prev => prev.filter(d => d._id !== id));
    } catch {
      alert('Failed to delete donation');
    }
  };

  useEffect(() => {
    fetchDonations();
  }, []);

  return (
    <div className="min-h-screen p-6 bg-white">
      <h2 className="text-xl font-bold mb-4">📦 My Donations</h2>

      {error && <p className="text-red-600 mb-4">{error}</p>}

      {donations.length === 0 ? (
        <p>No donations found.</p>
      ) : (
        <div className="space-y-4">
          {donations.map((d) => (
            <div
              key={d._id}
              className="border p-4 rounded shadow-md flex flex-col md:flex-row justify-between items-start md:items-center"
            >
              <div>
                <p><strong>Food:</strong> {d.foodType}</p>
                <p><strong>Qty:</strong> {d.quantity}</p>
                <p><strong>Status:</strong> {d.status}</p>
              </div>
              <div className="mt-2 md:mt-0 space-x-2">
                <button
                  onClick={() => navigate(`/donor/edit/${d._id}`)}
                  className="bg-yellow-500 text-white px-2 py-1 rounded mr-2 hover:bg-yellow-600"
                >
                  Edit
                </button>

                <button
                  onClick={() => handleDelete(d._id)}
                  className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
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

export default MyDonations;
