import { useEffect, useState } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import ChartRenderer from "../components/ChartRenderer"; 

const AdminChartView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const from = searchParams.get("from");

  const [record, setRecord] = useState(null);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;

  const totalPages = Math.ceil((record?.chartData?.length || 0) / rowsPerPage);
  const paginatedData = record?.chartData?.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  useEffect(() => {
    const fetchChart = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/admin/analysis/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setRecord(res.data);
        setCurrentPage(1);

        if (!res.data.chartData || res.data.chartData.length === 0) {
          setError("No chart data available.");
        } else {
          setError("");
        }
      } catch (err) {
        setError("Failed to load chart.");
      }
    };

    fetchChart();
  }, [id]);

  const handleBack = () => {
    if (from) {
      navigate(`/admin?viewMode=${from}`);
    } else {
      navigate("/admin");
    }
  };

  const generateChart = () => {
    if (!record?.chartData?.length) return null;

    return (
      <ChartRenderer
        data={record.chartData}
        xKey={record.selectedX}
        yKey={record.selectedY}
        chartType={record.chartType}
        mode={record.mode}
      />
    );
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white p-6">
      {error && <p className="text-red-500">{error}</p>}

      {!record ? (
        <p>Loading data...</p>
      ) : (
        <>
          <h2 className="text-3xl text-center font-bold mb-4 mt-4">
            User: {record.user?.email}
          </h2>

          {from === "uploadedFiles" || !record?.chartType ? (
            <>
              <h3 className="text-xl font-semibold text-center mb-2">File Preview</h3>
              <div className="overflow-x-auto bg-white text-black rounded-xl p-4 max-w-6xl mx-auto mb-4">
                {record.chartData?.length ? (
                  <table className="min-w-full text-sm">
                    <thead className="bg-slate-200">
                      <tr>
                        {Object.keys(record.chartData[0]).map((col, idx) => (
                          <th
                            key={idx}
                            className="px-4 py-2 border text-left font-semibold"
                          >
                            {col}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {paginatedData.map((row, i) => (
                        <tr key={i} className="hover:bg-slate-100">
                          {Object.values(row).map((val, idx) => (
                            <td key={idx} className="px-4 py-2 border">
                              {val}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                    {record.chartData?.length > rowsPerPage && (
                      <tfoot>
                        <tr>
                          <td colSpan={Object.keys(record.chartData[0]).length}>
                            <div className="flex justify-between items-center mt-2 px-4 py-2 bg-slate-100 text-black">
                              <button
                                disabled={currentPage === 1}
                                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                                className={`px-3 py-1 rounded bg-slate-700 hover:bg-slate-800 text-white ${
                                  currentPage === 1 ? "opacity-50 cursor-not-allowed" : ""
                                }`}
                              >
                                ← Previous
                              </button>
                              <span className="font-semibold">
                                Page {currentPage} of {totalPages}
                              </span>
                              <button
                                disabled={currentPage === totalPages}
                                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                                className={`px-3 py-1 rounded bg-slate-700 hover:bg-slate-800 text-white ${
                                  currentPage === totalPages ? "opacity-50 cursor-not-allowed" : ""
                                }`}
                              >
                                Next →
                              </button>
                            </div>
                          </td>
                        </tr>
                      </tfoot>
                    )}
                  </table>
                ) : (
                  <p className="text-gray-600">No data found in file.</p>
                )}
              </div>
            </>
          ) : (
            <>
              <p className="mb-4 text-center">
                X Axis: <span className="font-semibold">{record.selectedX}</span> &nbsp;&nbsp;
                Y Axis: <span className="font-semibold">{record.selectedY}</span>
              </p>
              <div className="bg-white p-6 rounded-xl text-black mb-6 max-w-4xl w-full h-[500px] mx-auto">
                <div className="flex justify-center items-center h-full">
                  {generateChart()}
                </div>
              </div>
            </>
          )}

          <button
            onClick={handleBack}
            className="mt-2 ms-162 bg-slate-700 hover:bg-slate-800 text-white px-4 py-2 rounded"
          >
            ⬅ Back to {from === "uploadedFiles" ? "Uploaded Files" : from ? `${from} Charts` : "Dashboard"}
          </button>
        </>
      )}
    </div>
  );
};

export default AdminChartView;