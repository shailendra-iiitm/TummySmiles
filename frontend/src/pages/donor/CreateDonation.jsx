import { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const CreateDonation = () => {
  const { token } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    foodType: '',
    quantity: '',
    pickupAddress: '',
    pickupLocation: {
      lat: '',
      lng: ''
    }
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'lat' || name === 'lng') {
      setFormData((prev) => ({
        ...prev,
        pickupLocation: {
          ...prev.pickupLocation,
          [name]: value
        }
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      await axios.post('http://localhost:5000/api/donor/create', formData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setSuccess('Donation created successfully!');
      setTimeout(() => navigate('/donor/my-donations'), 1000);
    } catch (err) {
      setError(err.response?.data?.msg || 'Failed to create donation');
    }
  };

  return (
    <div className="min-h-screen p-6 bg-white">
      <h2 className="text-xl font-bold mb-4">🍱 Create a Donation</h2>

      {error && <p className="text-red-600 mb-2">{error}</p>}
      {success && <p className="text-green-600 mb-2">{success}</p>}

      <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
        <input
          type="text"
          name="foodType"
          placeholder="Food Type"
          value={formData.foodType}
          onChange={handleChange}
          required
          className="w-full p-2 border rounded"
        />

        <input
          type="text"
          name="quantity"
          placeholder="Quantity"
          value={formData.quantity}
          onChange={handleChange}
          required
          className="w-full p-2 border rounded"
        />

        <input
          type="text"
          name="pickupAddress"
          placeholder="Pickup Address"
          value={formData.pickupAddress}
          onChange={handleChange}
          required
          className="w-full p-2 border rounded"
        />

        <div className="grid grid-cols-2 gap-4">
          <input
            type="number"
            name="lat"
            placeholder="Latitude"
            value={formData.pickupLocation.lat}
            onChange={handleChange}
            className="p-2 border rounded"
          />
          <input
            type="number"
            name="lng"
            placeholder="Longitude"
            value={formData.pickupLocation.lng}
            onChange={handleChange}
            className="p-2 border rounded"
          />
        </div>

        <button
          type="submit"
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Submit Donation
        </button>
      </form>
    </div>
  );
};

export default CreateDonation;
