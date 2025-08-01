import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../services/api';

const EditDonation = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    foodType: '',
    quantity: '',
    pickupAddress: ''
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const fetchDonation = async () => {
      try {
        const res = await api.get(`/donor/donation/${id}`);
        setFormData({
          foodType: res.data.foodType || '',
          quantity: res.data.quantity || '',
          pickupAddress: res.data.pickupAddress || ''
        });
      } catch (error) {
        console.error('Failed to fetch donation:', error);
        setError('Failed to fetch donation');
      }
    };

    fetchDonation();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.patch(`/donor/donation/${id}`, formData);
      setSuccess('Donation updated successfully');
      setTimeout(() => navigate('/donor/my-donations'), 1500);
    } catch (error) {
      console.error('Failed to update donation:', error);
      setError('Failed to update donation');
    }
  };

  return (
    <div className="min-h-screen p-6 bg-white">
      <h2 className="text-xl font-bold mb-4">✏️ Edit Donation</h2>

      {error && <p className="text-red-600 mb-2">{error}</p>}
      {success && <p className="text-green-600 mb-2">{success}</p>}

      <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
        <input
          type="text"
          name="foodType"
          placeholder="Food Type"
          value={formData.foodType}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />

        <input
          type="text"
          name="quantity"
          placeholder="Quantity"
          value={formData.quantity}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />

        <input
          type="text"
          name="pickupAddress"
          placeholder="Pickup Address"
          value={formData.pickupAddress}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Update Donation
        </button>
      </form>
    </div>
  );
};

export default EditDonation;
