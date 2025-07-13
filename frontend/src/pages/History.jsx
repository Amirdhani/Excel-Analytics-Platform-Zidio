import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const History = () => {
  const [history, setHistory] = useState([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [selectedIds, setSelectedIds] = useState([]);
  const [deleteMode, setDeleteMode] = useState(false);
  const [filter, setFilter] = useState("all"); // all | uploaded | generated | 2d | 3d

  const fetchHistory = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:3000/api/files/history", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setHistory(res.data);
    } catch (err) {
      setError("Unable to fetch history");
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const handleCheckboxChange = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleDeleteClick = async () => {
    if (!deleteMode) {
      setDeleteMode(true);
      return;
    }

    if (selectedIds.length === 0) {
      toast.info("Please select at least one file to delete.");
      return;
    }

    const token = localStorage.getItem("token");
    const deletedFiles = [];

    for (let id of selectedIds) {
      try {
        const record = history.find((r) => r._id === id);
        await axios.delete(`http://localhost:3000/api/files/history/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        deletedFiles.push(record.fileName);
      } catch (err) {
        toast.error(`Failed to delete file with ID: ${id}`);
      }
    }

    setHistory((prev) => prev.filter((record) => !selectedIds.includes(record._id)));
    setSelectedIds([]);
    setDeleteMode(false);

    if (deletedFiles.length > 0) {
      toast.success(`Deleted files (${deletedFiles.length})`);
    }
  };

  const filteredHistory = history.filter((record) => {
    if (filter === "uploaded") {
      return !record.selectedX && !record.selectedY && !record.chartType;
    } else if (filter === "generated") {
      return record.selectedX && record.selectedY && record.chartType;
    } else if (filter === "2d") {
      return (
        record.mode?.toLowerCase() === "2d" &&
        record.filename &&
        record.selectedX &&
        record.selectedY &&
        record.chartType
      );
    } else if (filter === "3d") {
      return record.mode === "3d";
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-900 to-green-700 text-white p-6">
      <h1 className="text-3xl font-bold text-center mb-6">Upload & Chart History</h1>
      {error && <p className="text-red-300 text-center">{error}</p>}

      {history.length === 0 ? (
        <p className="text-center text-amber-100">No uploads found yet.</p>
      ) : (
        <div className="overflow-x-auto max-w-6xl mx-auto bg-white text-black rounded-xl shadow">
          <div className="p-4 flex flex-wrap gap-4 justify-center">
            <button
              onClick={() => navigate("/dashboard")}
              className="bg-green-800 hover:bg-green-700 text-amber-200 font-semibold px-4 py-2 rounded-lg shadow-md"
            >
              ← Back to Dashboard
            </button>

            <button
              onClick={handleDeleteClick}
              className={`${
                deleteMode ? "bg-red-700" : "bg-red-600"
              } hover:bg-red-500 text-white px-4 py-2 rounded-xl`}
            >
              {deleteMode ? "Confirm Delete" : "Delete Files"}
            </button>

            <button
              onClick={() => setFilter("uploaded")}
              className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-xl"
            >
              Uploaded Files
            </button>

            <button
              onClick={() => setFilter("generated")}
              className="bg-purple-600 hover:bg-purple-500 text-white px-4 py-2 rounded-xl"
            >
              Generated Charts
            </button>

            <button
              onClick={() => setFilter("2d")}
              className="bg-yellow-600 hover:bg-yellow-500 text-white px-4 py-2 rounded-xl"
            >
              2D Charts
            </button>

            <button
              onClick={() => setFilter("3d")}
              className="bg-pink-600 hover:bg-pink-500 text-white px-4 py-2 rounded-xl"
            >
              3D Charts
            </button>

            <button
              onClick={() => setFilter("all")}
              className="bg-gray-600 hover:bg-gray-500 text-white px-4 py-2 rounded-xl"
            >
              Show All
            </button>
          </div>

          <table className="min-w-full border-collapse">
            <thead className="bg-gray-200">
              <tr>
                {deleteMode && (
                  <th className="border px-2 py-2 text-center w-10">Select</th>
                )}
                <th className="border px-4 py-2 text-center">Filename</th>
                <th className="border px-4 py-2 text-center">X-Axis</th>
                <th className="border px-4 py-2 text-center">Y-Axis</th>
                <th className="border px-4 py-2 text-center">Chart Type</th>
                <th className="border px-4 py-2 text-center">Chart Mode</th>
                <th className="border px-4 py-2 text-center">Uploaded Date</th>
                <th className="border px-4 py-2 text-center">Uploaded Time</th>
              </tr>
            </thead>
            <tbody>
              {filteredHistory.map((record) => (
                <tr key={record._id} className="hover:bg-gray-100">
                  {deleteMode && (
                    <td className="border px-2 py-2 text-center w-10">
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(record._id)}
                        onChange={() => handleCheckboxChange(record._id)}
                        className="w-4 h-4"
                      />
                    </td>
                  )}
                  <td className="border text-center px-4 py-2">{record.filename}</td>
                  <td className="border text-center px-4 py-2">{record.selectedX || "-"}</td>
                  <td className="border text-center px-4 py-2">{record.selectedY || "-"}</td>
                  <td className="border text-center px-4 py-2 capitalize">
                    {record.chartType || "-"}
                  </td>
                  <td className="border text-center px-4 py-2 uppercase">
                    {record.mode || "-"}
                  </td>
                  <td className="border text-center px-4 py-2">
                    {new Date(record.createdAt).toLocaleDateString("en-IN", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </td>
                  <td className="border text-center px-4 py-2">
                    {new Date(record.createdAt).toLocaleTimeString("en-IN", {
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: true,
                    })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default History;