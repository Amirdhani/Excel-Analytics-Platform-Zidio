import { Navigate } from "react-router-dom";

const Admin = ({ children }) => {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  if (!token) {
    // User not logged in
    return <Navigate to="/login" />;
  }

  if (role !== "admin") {
    // Logged in but not admin
    return <Navigate to="/dashboard" />;
  }

  return children;
};

export default Admin;
