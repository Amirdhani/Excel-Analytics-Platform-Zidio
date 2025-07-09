import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "react-toastify";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: ""
  });

  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await axios.post("http://localhost:3000/api/auth/register", formData);
      toast.success("Registration successful!");
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Background with reduced brightness */}
      <div className="absolute inset-0 bg-[url('/bg-excel.jpg')] bg-cover bg-center bg-no-repeat brightness-50 z-0"></div>

      {/* Foreground Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen space-y-10 px-4">
        
        {/* Animated Heading */}
        <motion.h1
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-3xl md:text-4xl font-bold text-amber-100 drop-shadow-lg text-center"
        >
          Welcome To Excel Analytics Platform
        </motion.h1>

        {/* Animated Form Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3 }}
          className="bg-green-700 p-8 rounded-2xl shadow-lg w-full max-w-md"
        >
          <h2 className="text-2xl font-semibold text-center text-amber-100 mb-6">Register</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 placeholder-amber-100 text-green-200 bg-transparent"
            />
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 placeholder-amber-100 text-green-200 bg-transparent"
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 placeholder-amber-100 text-green-200 bg-transparent"
            />

            {error && <p className="text-red-500 text-sm">{error}</p>}

            <button
              type="submit"
              className="w-full bg-green-950 text-amber-100 py-2 rounded-lg hover:bg-green-800 transition"
            >
              Register
            </button>

            <div className="flex items-center">
              <div className="flex-grow border-t border-amber-200"></div>
              <span className="mx-3 text-amber-100 text-sm relative -top-1">or</span>
              <div className="flex-grow border-t border-amber-200"></div>
            </div>

            <button
              type="button"
              onClick={() => navigate("/login")}
              className="w-full bg-green-950 text-amber-100 py-2 rounded-lg hover:bg-green-800 transition"
            >
              Already have an account? Login
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default Register;