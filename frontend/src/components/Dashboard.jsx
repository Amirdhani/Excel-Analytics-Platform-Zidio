import { useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";

const Dashboard = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) navigate("/login");
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-[url('/bg-excel.jpg')] bg-cover bg-center bg-no-repeat brightness-50 z-0"></div>

      {/* Navbar */}
      <div className="relative z-20 bg-green-900 bg-opacity-80 py-4 px-8 flex justify-between items-center text-amber-100 shadow-md">
        <h1 className="text-xl font-bold">Excel Analytics</h1>
        <nav className="space-x-6">
          <Link to="/dashboard" className="hover:text-white transition">Dashboard</Link>
          <Link to="/upload" className="hover:text-white transition">Upload</Link>
          <Link to="/history" className="hover:text-white transition">History</Link>
          <button onClick={handleLogout} className="hover:text-red-400 transition">Logout</button>
        </nav>
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-start min-h-screen pt-50 space-y-10">
        <motion.h1
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-5xl font-bold text-amber-100 drop-shadow-lg text-center"
        >
          Welcome to your Excel Analytics Platform
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-xl text-green-100 text-center max-w-2xl"
        >
           You can upload Excel files, view analysis history, and explore interactive visualizations.
        </motion.p>
      </div>
    </div>
  );
};

export default Dashboard;