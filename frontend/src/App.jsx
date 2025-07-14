import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from 'react-toastify';
import { Toaster } from "react-hot-toast";
import 'react-toastify/dist/ReactToastify.css';

import Register from "./components/Register";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";
import Admin from "./components/Admin";

import Upload from "./pages/UploadPage";
import History from "./pages/History";
import AdminDashboard from "./pages/AdminDashboard";
import AdminChartView from "./pages/AdminChartView";


function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/" element={<Navigate to="/register" />} />

        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/upload" element={<Upload />} />
        <Route path="/history" element={<History />} />
        <Route path="/admin/view/:id" element={<AdminChartView />} />

        <Route path="/admin" element={
            <Admin>
              <AdminDashboard />
            </Admin>
          }
        />
      </Routes>

      <Toaster position="top-right" />

      <ToastContainer />
    </BrowserRouter>
  );
}

export default App;