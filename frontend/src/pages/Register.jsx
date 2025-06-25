import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-hot-toast";

const Register = () => {
  const [role, setRole] = useState(""); // role selection shown first
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    password: "",
    confirmPassword: "",
    role: "",
    pincode: "",
  });

  const navigate = useNavigate();

  const handleRoleChange = (e) => {
    const selectedRole = e.target.value;
    setRole(selectedRole);
    setFormData((prev) => ({
      ...prev,
      role: selectedRole,
    }));
  };

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  const { role, pincode, password, confirmPassword } = formData;

  if ((role === "donor" || role === "agent") && !pincode) {
    return toast.error("Pincode is required for donors and agents.");
  }

  if (password !== confirmPassword) {
    return toast.error("Passwords do not match!");
  }

  try {
    await axios.post("http://localhost:5000/api/auth/register", formData);
    toast.success("Registration successful!");
    navigate("/login");
  } catch (err) {
    toast.error(err?.response?.data?.message || "Registration failed");
  }
};


  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-3xl font-semibold mb-6 text-center text-gray-800">Register</h2>

        {/* Role Selection First */}
        <div className="mb-4">
          <label className="block mb-1 text-sm font-medium text-gray-700">Select Role</label>
          <select
            name="role"
            value={role}
            onChange={handleRoleChange}
            required
            className="w-full p-2 border rounded-md bg-white text-gray-700"
          >
            <option value="" disabled>Select your role</option>
            <option value="donor">Donor</option>
            <option value="agent">Agent</option>
          </select>
        </div>

        {/* Show rest of form only after role is chosen */}
        {role && (
          <>
            <div className="mb-4">
              <label className="block mb-1 text-sm font-medium text-gray-700">Full Name</label>
              <input
                name="name"
                type="text"
                required
                placeholder="Enter your name"
                onChange={handleChange}
                className="w-full p-2 border rounded-md"
              />
            </div>

            <div className="mb-4">
              <label className="block mb-1 text-sm font-medium text-gray-700">Email (optional)</label>
              <input
                name="email"
                type="email"
                placeholder="Enter email"
                onChange={handleChange}
                className="w-full p-2 border rounded-md"
              />
            </div>

            <div className="mb-4">
              <label className="block mb-1 text-sm font-medium text-gray-700">Phone Number</label>
              <input
                name="phone"
                type="text"
                required
                placeholder="Enter phone number"
                onChange={handleChange}
                className="w-full p-2 border rounded-md"
              />
            </div>

            <div className="mb-4">
              <label className="block mb-1 text-sm font-medium text-gray-700">Address (optional)</label>
              <input
                name="address"
                type="text"
                placeholder="Enter address"
                onChange={handleChange}
                className="w-full p-2 border rounded-md"
              />
            </div>

            <div className="mb-4">
              <label className="block mb-1 text-sm font-medium text-gray-700">Password</label>
              <input
                name="password"
                type="password"
                required
                placeholder="Enter password"
                onChange={handleChange}
                className="w-full p-2 border rounded-md"
              />
            </div>

            <div className="mb-4">
            <label className="block mb-1 text-sm font-medium text-gray-700">Confirm Password</label>
            <input
              name="confirmPassword"
              type="password"
              required
              placeholder="Re-enter password"
              onChange={handleChange}
              className="w-full p-2 border rounded-md"
              />
            </div>


            {(role === "donor" || role === "agent") && (
              <div className="mb-6">
                <label className="block mb-1 text-sm font-medium text-gray-700">Pincode</label>
                <input
                  name="pincode"
                  type="text"
                  required
                  placeholder="Enter your pincode"
                  value={formData.pincode}
                  onChange={handleChange}
                  className="w-full p-2 border rounded-md"
                />
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-green-600 text-white font-medium py-2 px-4 rounded-md hover:bg-green-700 transition"
            >
              Register
            </button>
          </>
        )}
      </form>
    </div>
  );
};

export default Register;
