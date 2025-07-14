import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });

  const [success, setSuccess] = useState("");
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
  setSuccess("");

  try {
    const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/auth/login`, formData);

    localStorage.setItem("token", res.data.token);
    localStorage.setItem("role", res.data.user.role);
    localStorage.setItem("userName", res.data.user.name);

    setSuccess("Login successful!");

    if (res.data.user.role === "admin") {
      navigate("/admin");
    } else {
      navigate("/dashboard");
    }
  } catch (err) {
    setError(err.response?.data?.message || "Login failed");
  }
};


  return (
    <div className="relative min-h-screen overflow-hidden">
      <div className="absolute inset-0 bg-[url('/bg-excel.jpg')] bg-cover bg-center bg-no-repeat brightness-50 z-0"></div>

      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen space-y-10 px-4">
        <motion.h1
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-3xl md:text-4xl font-bold text-amber-100 drop-shadow-lg text-center"
        >
          Welcome Back to Excel Analytics
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3 }}
          className="bg-green-700 p-8 rounded-2xl shadow-lg w-full max-w-md"
        >
          <h2 className="text-2xl font-semibold text-center text-amber-100 mb-6">Login</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
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

            {error && <p className="text-amber-900 text-sm">{error}</p>}

            <button
              type="submit"
              className="w-full bg-green-950 text-amber-100 py-2 rounded-lg hover:bg-green-800 transition"
            >
              Login
            </button>

            <div className="flex items-center">
              <div className="flex-grow border-t border-amber-200"></div>
              <span className="mx-3 text-amber-100 text-sm relative -top-1">or</span>
              <div className="flex-grow border-t border-amber-200"></div>
            </div>

            <button
              type="button"
              onClick={() => navigate("/register")}
              className="w-full bg-green-950 text-amber-100 py-2 rounded-lg hover:bg-green-800 transition"
            >
              Don't have an account? Register  
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;