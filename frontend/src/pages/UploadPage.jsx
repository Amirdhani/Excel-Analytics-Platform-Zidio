import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import ChartRenderer from "../components/ChartRenderer";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { motion } from "framer-motion";

const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";

const Upload = () => {
  const [file, setFile] = useState(null);
  const [columns, setColumns] = useState([]);
  const [data, setData] = useState([]);
  const [selectedX, setSelectedX] = useState("");
  const [selectedY, setSelectedY] = useState("");
  const [chartType, setChartType] = useState("");
  const [chartMode, setChartMode] = useState(""); // "2d" or "3d"
  const [chartData, setChartData] = useState([]);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(0);
  const rowsPerPage = 10;
  const [webglCanvas, setWebglCanvas] = useState(null);


  const handleFileUpload = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    if (!file) return setError("Please select a file first.");

    try {
      const formData = new FormData();
      formData.append("file", file);
      const token = localStorage.getItem("token");

      const res = await axios.post(`${backendUrl}/api/analysis/upload`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      setColumns(res.data.columns);
      setData(res.data.data);
      setSuccess("File uploaded successfully! Now choose columns and chart type.");
    } catch (err) {
      setError(err.response?.data?.message || "Upload failed");
    }
  };

  const handleChartSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!selectedX || !selectedY || !chartType || !chartMode) {
      setError("Please select all chart options.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("selectedX", selectedX);
      formData.append("selectedY", selectedY);
      formData.append("chartType", chartType);
      formData.append("mode", chartMode); // if your backend needs it
      const token = localStorage.getItem("token");

      const res = await axios.post(`${backendUrl}/api/analysis/upload`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      setChartData(res.data.data);
      setSuccess("Chart generated successfully!");
    } catch (err) {
      setError(err.response?.data?.message || "Chart generation failed");
    }
  };

  const downloadChartAsImage = async () => {
    if (chartMode === "3d") {
      if (!webglCanvas) {
        alert("3D chart is not ready yet.");
        return;
      }

      const tempCanvas = document.createElement("canvas");
      const ctx = tempCanvas.getContext("2d");

      tempCanvas.width = webglCanvas.width;
      tempCanvas.height = webglCanvas.height;

      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);
      ctx.drawImage(webglCanvas, 0, 0);

      const finalURL = tempCanvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.href = finalURL;
      link.download = "3d_chart.png";
      link.click();
    } else {
      // 2D chart - use html2canvas
      const chartElement = document.querySelector("#chart-renderer");
      if (!chartElement) return;

      const canvas = await html2canvas(chartElement, {
        backgroundColor: "#ffffff", // force white background
        scale: 2,
      });

      const imageURL = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.href = imageURL;
      link.download = "2d_chart.png";
      link.click();
    }
  };


  const downloadChartAsPDF = async () => {
    const pdf = new jsPDF("landscape", "mm", "a4");

    if (chartMode === "3d") {
      if (!webglCanvas) {
        alert("3D chart is not ready yet.");
        return;
      }

      requestAnimationFrame(() => {
        const image = webglCanvas.toDataURL("image/png");
        const imgProps = pdf.getImageProperties(image);
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

        pdf.addImage(image, "PNG", 10, 10, pdfWidth - 20, pdfHeight);
        pdf.save("3d_chart.pdf");
      });
    } else {
      const chartElement = document.querySelector("#chart-renderer");
      if (!chartElement) return;

      const canvas = await html2canvas(chartElement, {
        backgroundColor: "#ffffff",
        scale: 2,
      });

      const imgData = canvas.toDataURL("image/png");
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

      pdf.addImage(imgData, "PNG", 10, 10, pdfWidth - 20, pdfHeight);
      pdf.save("2d_chart.pdf");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-900 to-green-700 text-white flex flex-col items-center justify-center px-4">
      <motion.h1
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="text-2xl md:text-4xl font-bold text-amber-100 drop-shadow-lg text-center"
      >
        Upload Excel File
      </motion.h1>

      <motion.form
        onSubmit={handleFileUpload}
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.3 }}
        className="bg-green-800 p-6 rounded-xl shadow-md space-y-4 mt-4 w-full max-w-md"
      >
        <input
          type="file"
          accept=".xls,.xlsx"
          onChange={(e) => setFile(e.target.files[0])}
          className="w-full bg-green-900 border border-green-500 rounded px-3 py-2"
        />
        <button type="submit" className="w-full bg-green-600 hover:bg-green-500 py-2 rounded font-semibold">
          Upload File
        </button>
        {success && <p className="text-green-300 text-sm">{success}</p>}
        {error && <p className="text-red-300 text-sm">{error}</p>}
      </motion.form>

      <div className="fixed top-6 left-6 z-50">
        <button
          onClick={() => navigate("/dashboard")}
          className="bg-green-800 hover:bg-green-700 text-amber-200 font-semibold px-4 py-2 rounded-lg shadow-md"
        >
          ← Back to Dashboard
        </button>
      </div>

      {columns.length > 0 && (
        <motion.form
          onSubmit={handleChartSubmit}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="bg-green-800 p-6 mt-6 rounded-xl shadow-md space-y-4 w-full max-w-md"
        >
          <div>
            <label className="block text-sm text-amber-100 mb-1">Select X-Axis:</label>
            <select
              className="w-full px-3 py-2 rounded bg-green-900 border border-green-500 text-white"
              value={selectedX}
              onChange={(e) => setSelectedX(e.target.value)}
              required
            >
              <option value="">-- Select X Column --</option>
              {columns.map((col, i) => (
                <option key={i} value={col}>{col}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm text-amber-100 mb-1">Select Y-Axis:</label>
            <select
              className="w-full px-3 py-2 rounded bg-green-900 border border-green-500 text-white"
              value={selectedY}
              onChange={(e) => setSelectedY(e.target.value)}
              required
            >
              <option value="">-- Select Y Column --</option>
              {columns.map((col, i) => (
                <option key={i} value={col}>{col}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm text-amber-100 mb-1">Select Chart Mode:</label>
            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => {
                  setChartMode("2d");
                  setChartType("");
                }}
                className={`px-4 py-2 rounded ${
                  chartMode === "2d" ? "bg-amber-600" : "bg-green-700"
                } text-white`}
              >
                2D Chart
              </button>
              <button
                type="button"
                onClick={() => {
                  setChartMode("3d");
                  setChartType("");
                }}
                className={`px-4 py-2 rounded ${
                  chartMode === "3d" ? "bg-amber-600" : "bg-green-700"
                } text-white`}
              >
                3D Chart
              </button>
            </div>
          </div>

          {chartMode && (
            <div>
              <label className="block text-sm text-amber-100 mb-1">Select {chartMode.toUpperCase()} Chart Type:</label>
              <select
                className="w-full px-3 py-2 rounded bg-green-900 border border-green-500 text-white"
                value={chartType}
                onChange={(e) => setChartType(e.target.value)}
                required
              >
                <option value="">-- Select Chart Type --</option>
                <option value="bar">Bar</option>
                <option value="line">Line</option>
                <option value="pie">Pie</option>
                <option value="scatter">Scatter</option>
              </select>
            </div>
          )}

          <button type="submit" className="w-full bg-amber-600 hover:bg-amber-500 py-2 rounded font-semibold">
            Generate Chart
          </button>
        </motion.form>
      )}

      {chartData.length > 0 && (
        <div className="mt-8 w-full max-w-4xl bg-white text-black p-6 rounded-xl shadow-lg">
          <h2 className="text-xl font-bold mb-4 text-center">Chart Preview</h2>
          <div id="chart-renderer">
            <ChartRenderer
              data={chartData}
              xKey={selectedX}
              yKey={selectedY}
              chartType={chartType}
              mode={chartMode}
              onCanvasReady={setWebglCanvas}
            />
          </div>

          <div className="flex justify-center gap-4 mt-2">
            <button
              onClick={downloadChartAsImage}
              className="bg-green-700 text-white px-4 py-2 rounded hover:bg-green-600 transition"
            >
              Download PNG
            </button>
            <button
              onClick={downloadChartAsPDF}
              className="bg-purple-700 text-white px-4 py-2 rounded hover:bg-purple-600 transition"
            >
              Download PDF
            </button>
          </div>
        </div>
      )}

      {data.length > 0 && (
        <div className="mt-10 w-full overflow-auto bg-white rounded-lg shadow p-4 max-w-6xl">
          <h3 className="text-lg font-semibold text-center mb-3 text-gray-800">Raw Data Preview</h3>
          <table className="min-w-full table-auto border border-gray-300">
            <thead className="bg-gray-100">
              <tr>
                {columns.map((col, i) => (
                  <th key={i} className="border px-3 py-1 text-sm text-gray-800">{col}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data
                .slice(currentPage * rowsPerPage, (currentPage + 1) * rowsPerPage)
                .map((row, i) => (
                  <tr key={i} className="hover:bg-gray-50">
                    {columns.map((col, j) => (
                      <td key={j} className="border px-3 py-1 text-xs text-gray-700">
                        {row[col]}
                      </td>
                    ))}
                  </tr>
              ))}
            </tbody>
          </table>

          <div className="flex justify-between items-center mt-4">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 0))}
              disabled={currentPage === 0}
              className={`px-3 py-1 rounded bg-green-600 text-white ${
                currentPage === 0 ? "opacity-50 cursor-not-allowed" : "hover:bg-green-500"
              }`}
            >
              ← Previous
            </button>

            <p className="text-sm text-gray-700">
              Showing {currentPage * rowsPerPage + 1}–{Math.min((currentPage + 1) * rowsPerPage, data.length)} of {data.length} rows
            </p>

            <button
              onClick={() =>
                setCurrentPage((prev) =>
                  (prev + 1) * rowsPerPage < data.length ? prev + 1 : prev
                )
              }
              disabled={(currentPage + 1) * rowsPerPage >= data.length}
              className={`px-3 py-1 rounded bg-green-600 text-white ${
                (currentPage + 1) * rowsPerPage >= data.length
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:bg-green-500"
              }`}
            >
              Next →
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Upload;
