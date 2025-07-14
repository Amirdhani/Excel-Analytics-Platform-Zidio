import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { useNavigate, useSearchParams  } from "react-router-dom";
import { FaUsers, FaUpload, FaChartPie, FaChartBar, FaChartLine, FaFileAlt } from "react-icons/fa";
import { BiScatterChart } from "react-icons/bi";


const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [uploads, setUploads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [viewMode, setViewMode] = useState(""); // "", "users", "uploads", "charts"
  const [searchParams, setSearchParams] = useSearchParams();
  const fileOnlyUploads = uploads.filter((u) => !u.chartType);
  const navigate = useNavigate();

  useEffect(() => {
  const allowedModes = ["users", "uploads", "charts", "uploadedFiles", "bar", "line", "pie", "scatter"];
  const incomingMode = searchParams.get("viewMode");

  if (incomingMode && allowedModes.includes(incomingMode)) {
    setViewMode(incomingMode);
  } else {
    setViewMode(""); // Always go to dashboard by default
  }

  fetchStats();
  fetchUsers();
  fetchUploads();
}, []); // ✅ Only run once on mount



  const fetchStats = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/admin/stats`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setStats(res.data);
    } catch (err) {
      console.error("Error fetching stats:", err.response?.data || err.message);
      setError("Failed to load stats.");
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/admin/users`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUsers(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Error fetching users:", err.response?.data || err.message);
      setError("Failed to load users.");
    }
  };

  const fetchUploads = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/analysis`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUploads(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Error fetching uploads:", err);
    }
  };

  const deleteUser = async (id) => {
  try {
    const token = localStorage.getItem("token");

    // Optimistically remove the user from UI
    setUsers((prevUsers) => prevUsers.filter((user) => user._id !== id));
    setStats((prevStats) => ({
      ...prevStats,
      totalUsers: (prevStats?.totalUsers || 1) - 1, // decrease count
    }));

    await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/api/admin/users/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    toast.success("User deleted successfully");
    // Optionally re-fetch in background if you want backend sync
    // fetchUsers();

  } catch (err) {
    toast.error("Failed to delete user.");
  }
};

  const handleViewModeChange = (mode) => {
    setSearchParams({ viewMode: mode });
    setViewMode(mode);
  };


  return (
    <div className="p-6 text-white bg-slate-900 min-h-screen">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-bold">Admin Dashboard</h2>
        <button
          onClick={() => {
            localStorage.clear();
            navigate("/login");
          }}
          className="bg-red-700 hover:bg-red-800 text-white px-4 py-2 rounded"
        >
          Logout
        </button>
      </div>

      {error && <div className="text-red-500 mb-4">{error}</div>}

      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          {/* ✅ Stat Cards */}
          <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
            {/* Total Users */}
            <div
              onClick={() => handleViewModeChange("users")}
              className="cursor-pointer bg-slate-800 p-6 rounded-xl flex items-center gap-4 shadow hover:bg-slate-700"
            >
              <div className="bg-green-700 p-4 rounded-full text-white text-2xl">
                <FaUsers />
              </div>
              <div>
                <p className="text-gray-300">Total Users</p>
                <h4 className="text-xl font-bold">{stats?.totalUsers ?? 0}</h4>
              </div>
            </div>

            {/* Total Uploads */}
            <div
              onClick={() => {
                handleViewModeChange("uploads");
                fetchUploads();
              }}
              className="cursor-pointer bg-slate-800 p-6 rounded-xl flex items-center gap-4 shadow hover:bg-slate-700"
            >
              <div className="bg-blue-700 p-4 rounded-full text-white text-2xl">
                <FaUpload />
              </div>
              <div>
                <p className="text-gray-300">Total Uploads</p>
                <h4 className="text-xl font-bold">{stats?.totalUploads ?? 0}</h4>
              </div>
            </div>

            {/* Most Used Chart */}
            <div
              onClick={() => handleViewModeChange("charts")}
              className="cursor-pointer bg-slate-800 p-6 rounded-xl flex items-center gap-4 shadow hover:bg-slate-700"
            >
              <div className="bg-purple-700 p-4 rounded-full text-white text-2xl">
                <FaChartPie />
              </div>
              <div>
                <p className="text-gray-300">Top Chart Type</p>
                <div className="text-xl font-bold">
                  {(() => {
                    const charts = stats?.mostUsedCharts ?? [];
                    if (charts.length === 0) 
                      return "N/A (0)";

                    const topCount = charts[0].count;
                    const topCharts = charts.filter(c => c.count === topCount);

                    return topCharts.length === 1
                      ? `${topCharts[0]._id} (${topCharts[0].count})`
                      : `N/A (${topCount})`;
                  })()}

                </div>
              </div>
            </div>

            {/* Charts Generated (based on upload count) */}
            <div
              onClick={() => handleViewModeChange("uploadedFiles")}
              className="cursor-pointer bg-slate-800 p-6 rounded-xl flex items-center gap-4 shadow hover:bg-slate-700"
            >
              <div className="bg-yellow-700 p-4 rounded-full text-white text-2xl">
                <FaFileAlt />
              </div>
              <div>
                <p className="text-gray-300">Files Uploaded Only</p>
                <h4 className="text-xl font-bold">{fileOnlyUploads.length}</h4>
              </div>
            </div>

          </section>

          {/* Detailed Views */}
          {viewMode === "users" && (
            <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
              <h3 className="text-2xl text-center uppercase font-semibold mb-4">All Users</h3>
              {users.length > 0 ? (
                <div className="flex justify-center overflow-x-auto">
                    <table className="w-2xl border border-gray-700 rounded overflow-hidden">
                    <thead className="bg-slate-800">
                        <tr>
                        <th className="border text-amber-100 px-4 py-2">Name</th>
                        <th className="border text-amber-100 px-4 py-2">Email</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.filter(user => user.role !== 'admin').map((user) => (
                        <tr key={user._id} className="hover:bg-slate-800">
                            <td className="text-center text-amber-100 border px-4 py-2">{user.name}</td>
                            <td className="text-center text-amber-100 border pr-1 py-2">{user.email}</td>
                        </tr>
                        ))}
                    </tbody>
                    </table>
                </div>
              ) : (
                <p className="text-gray-400">No users found.</p>
              )}
              <button
                onClick={() => {
                  setSearchParams({});
                  setViewMode("");
                }}
                className="mt-4 ms-103 bg-slate-700 hover:bg-slate-800 text-white px-4 py-2 rounded"
              >
                Back to Dashboard
              </button>
            </motion.section>
          )}

          {viewMode === "uploads" && (
            <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <h3 className="text-2xl text-center uppercase font-semibold mb-4">All Uploads</h3>

                {uploads.length > 0 ? (
                <div className="flex justify-center overflow-x-auto">
                    <table className="w-4xl border border-gray-700 rounded overflow-hidden text-sm">
                    <thead className="bg-slate-800 text-amber-100">
                        <tr>
                        <th className="px-6 py-3 text-center border">Filename</th>
                        <th className="px-6 py-3 text-center border">Uploaded By</th>
                        <th className="px-6 py-3 text-center border">Date</th>
                        <th className="px-6 py-3 text-center border">Time</th>
                        </tr>
                    </thead>
                    <tbody>
                        {uploads.map((upload) => {
                        const date = new Date(upload.createdAt);
                        const formattedDate = date.toLocaleDateString("en-GB", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                        });
                        const formattedTime = date.toLocaleTimeString("en-US", {
                            hour: "2-digit",
                            minute: "2-digit",
                            hour12: true,
                        });

                        return (
                            <tr key={upload._id} className="hover:bg-slate-800 text-amber-50">
                            <td className="text-center px-6 py-3 border">{upload.filename || "N/A"}</td>
                            <td className="text-center px-6 py-3 border">{upload.user?.email || "N/A"}</td>
                            <td className="text-center px-6 py-3 border">{formattedDate}</td>
                            <td className="text-center px-6 py-3 border">{formattedTime}</td>
                            </tr>
                        );
                        })}
                    </tbody>
                    </table>
                </div>
                ) : (
                <p className="text-gray-400">No uploads found.</p>
                )}
                <button
                  onClick={() => {
                    setSearchParams({});
                    setViewMode("");
                  }}
                  className="ms-74 mt-4 bg-slate-700 hover:bg-slate-800 text-white px-4 py-2 rounded"
                >
                  Back to Dashboard
                </button>
            </motion.section>
       )}


       {viewMode === "uploadedFiles" && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h3 className="text-2xl text-center uppercase font-semibold mb-4">Files Only Uploaded</h3>

            {fileOnlyUploads.length > 0 ? (
              <div className="flex justify-center overflow-x-auto">
                <table className="min-w-2xl border border-gray-700 rounded overflow-hidden text-sm">
                  <thead className="bg-slate-800 text-amber-100">
                    <tr>
                      <th className="px-6 py-3 text-center border">Filename</th>
                      <th className="px-6 py-3 text-center border">Uploaded Date</th>
                      <th className="px-6 py-3 text-center border">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {fileOnlyUploads.map((upload) => {
                      const date = new Date(upload.createdAt);
                      const formattedDate = date.toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      });

                      return (
                        <tr key={upload._id} className="hover:bg-slate-800 text-amber-50">
                          <td className="text-center px-6 py-3 border">{upload.filename || "N/A"}</td>
                          <td className="text-center px-6 py-3 border">{formattedDate}</td>
                          <td className="text-center px-6 py-3 border">
                            <button
                              onClick={() =>
                                navigate(`/admin/view/${upload._id}?from=uploadedFiles`)
                              }
                              className="bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1 rounded"
                            >
                              View
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-center text-gray-400">No uploaded files found.</p>
            )}

            <button
              onClick={() => {
                setSearchParams({});
                setViewMode("");
              }}
              className="mt-6 ms-103 bg-slate-700 hover:bg-slate-800 text-white px-4 py-2 rounded"
            >
              Back to Dashboard
            </button>
          </motion.section>
        )}



        {viewMode === "charts" && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h3 className="text-2xl text-center uppercase font-semibold mb-6">Chart Usage Details</h3>

            {stats?.mostUsedCharts?.length > 0 ? (
              <div className="flex flex-wrap gap-12 justify-center">
                {stats.mostUsedCharts
                  .filter((chart) => ["bar", "line", "pie", "scatter"].includes(chart._id))
                  .map((chart, i) => (
                    <motion.div
                      key={i}
                      whileHover={{ scale: 1.05 }}
                      onClick={() => handleViewModeChange(chart._id)}
                      className="mt-5 flex flex-col items-center justify-center cursor-pointer"
                    >
                      {/* Icon Circle with Badge */}
                      <div className="relative">
                        {/* Icon circle */}
                        <div className="w-50 h-50 rounded-full bg-indigo-700 flex items-center justify-center text-blue-200 text-8xl shadow-md">
                          {chart._id === "bar" && <FaChartBar />}
                          {chart._id === "line" && <FaChartLine />}
                          {chart._id === "pie" && <FaChartPie />}
                          {chart._id === "scatter" && <BiScatterChart />}
                        </div>

                        {/* Count badge on the edge */}
                        <span className="absolute top-2 right-2 bg-red-600 text-white text-xs font-semibold rounded-full px-4 py-2 shadow">
                          {chart.count}
                        </span>
                      </div>

                      {/* Chart label below icon */}
                      <p className="text-gray-300 capitalize mt-3 text-lg font-medium">{chart._id} Chart</p>
                    </motion.div>
                  ))}
              </div>
            ) : (
             <p className="text-gray-400">No chart data available.</p>
            )}

            <div className="flex justify-center">
              <button
                onClick={() => {
                  setSearchParams({});
                  setViewMode("");
                }}
                className="mt-12 bg-slate-700 hover:bg-slate-800 text-white px-4 py-2 rounded"
              >
                Back to Dashboard
              </button>
            </div>
          </motion.section>
        )}



          {["bar", "line", "pie", "scatter"].includes(viewMode) && (() => {
            const chartUploads = uploads.filter((u) => u.chartType === viewMode);
            const count2D = chartUploads.filter((u) => (u.mode?.toUpperCase?.() ?? "2D") === "2D").length;
            const count3D = chartUploads.filter((u) => (u.mode?.toUpperCase?.() ?? "2D") === "3D").length;


            return (
              <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <h3 className="text-2xl text-center font-semibold mb-4 capitalize">{viewMode} Charts</h3>

                {/* ✅ Summary for 2D / 3D */}
                <div className="flex justify-center gap-12 mb-8">
                  <div className="bg-slate-800 text-white p-6 rounded-lg shadow text-center">
                    <h4 className="text-lg font-bold">2D Charts</h4>
                    <p className="text-2xl text-green-400 font-bold">{count2D}</p>
                  </div>
                  <div className="bg-slate-800 text-white p-6 rounded-lg shadow text-center">
                    <h4 className="text-lg font-bold">3D Charts</h4>
                    <p className="text-2xl text-yellow-400 font-bold">{count3D}</p>
                  </div>
                  <div className="bg-slate-800 text-white p-6 rounded-lg shadow text-center">
                    <h4 className="text-lg font-bold">Total</h4>
                    <p className="text-2xl text-blue-400 font-bold">{chartUploads.length}</p>
                  </div>
                </div>

                {/* ✅ Table of charts */}
                <div className="flex justify-center overflow-x-auto">
                  <table className="w-3xl justify-center border border-gray-700 rounded overflow-hidden text-sm">
                    <thead className="bg-slate-800">
                      <tr>
                        <th className="border px-2 py-1 text-center">User</th>
                        <th className="border px-2 py-1 text-center">X Axis</th>
                        <th className="border px-2 py-1 text-center">Y Axis</th>
                        <th className="border px-2 py-1 text-center">Chart Mode</th>
                        <th className="border px-2 py-1 text-center">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {chartUploads.map((u) => (
                        <tr key={u._id} className="hover:bg-slate-800 text-white">
                          <td className="border text-center px-2 py-1">{u.user?.email}</td>
                          <td className="border text-center px-2 py-1">{u.selectedX}</td>
                          <td className="border text-center px-2 py-1">{u.selectedY}</td>
                          <td className="border text-center px-2 py-1">{u.mode?.toUpperCase?.() ?? "2D"}</td>
                          <td className="border text-center px-2 py-1">
                            <button
                              onClick={() =>
                                navigate(`/admin/view/${u._id}?from=${viewMode}`, {
                                  state: { fromChartType: u.chartType },
                                })
                              }
                              className="bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1 mt-2 rounded"
                            >
                              View
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <button
                  onClick={() => {
                    setSearchParams({ viewMode: "charts" });
                    setViewMode("charts");
                  }}
                  className="ms-90 mt-4 bg-slate-700 hover:bg-slate-800 text-white px-4 py-2 rounded"
                >
                  Back to Chart Summary
                </button>
              </motion.section>
            );
          })()}



          {/* Show Manage Users only when not viewing detailed lists */}
          {viewMode === "" && (
            <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
              <h3 className="text-2xl text-center uppercase font-semibold mb-4">User & Admin Accounts</h3>
              {users.length > 0 ? (
                <div className="flex justify-center">
                  <table className="w-4xl border border-gray-700 rounded overflow-hidden">
                    <thead className="bg-slate-800">
                      <tr>
                        <th className="border px-4 py-2">Name</th>
                        <th className="border px-4 py-2">Email</th>
                        <th className="border px-4 py-2">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((user) => (
                        <tr key={user._id} className="hover:bg-slate-800">
                          <td className="text-center border px-4 py-2">{user.name}</td>
                          <td className="text-center border px-4 py-2">{user.email}</td>
                          <td className="text-center border px-4 py-2">
                            {user.role === "admin" ? (
                              <span className="text-gray-400 italic">Admin</span>
                            ) : (
                              <button
                                onClick={() => deleteUser(user._id)}
                                className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded"
                              >
                                Delete
                              </button>
                            )}
                          </td>

                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-gray-400">No users found.</p>
              )}
            </motion.section>
          )}
        </>
      )}
    </div>
  );
};

export default AdminDashboard;
