import React, { useEffect, useState } from "react";
import { fetchReports } from "../services/api";

export default function Report() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    loadReports();
  }, []);

  const loadReports = async () => {
    setLoading(true);
    setError("");

    try {
      const user = JSON.parse(localStorage.getItem("user"));

      if (!user || !user.id) {
        setError("User not found. Please login again.");
        setLoading(false);
        return;
      }

      const res = await fetchReports(user.id);

      setReports(res.data || []);
    } catch (error) {
      console.log(error);
      setError("Failed to load reports");
    } finally {
      setLoading(false);
    }
  };

  const handlePDFDownload = () => {
  const user = JSON.parse(localStorage.getItem("user"));

  if (!user || !user.id) {
    alert("Please login again");
    return;
  }

  window.open(
    `http://127.0.0.1:5000/api/pdf/export/${user.id}`,
    "_blank"
  );
};

  return (
    <div className="cyber-bg">
      <div className="page-wrapper">

        <div className="dashboard-header">

          <div>
            <h1 className="dashboard-title">
              Audit Reports
            </h1>

            <p className="cyber-subtitle">
              Security findings, risk insights, and compliance recommendations
            </p>
          </div>

          <button
            onClick={handlePDFDownload}
            className="cyber-btn glow-pulse"
          >
            Export PDF Report
          </button>

        </div>

        {error && (
          <div className="cyber-alert mb-lg">
            {error}
          </div>
        )}

        {loading && (
          <div className="cyber-card center-text">
            Loading reports...
          </div>
        )}

        {!loading && reports.length === 0 && (
          <div className="cyber-card center-text fade-up">
            <h2 className="cyber-section-title">
              No Reports Found
            </h2>

            <p className="cyber-subtitle">
              Run an assessment to generate your first audit report.
            </p>
          </div>
        )}

        <div className="mt-lg">
          {reports.map((item) => (
            <div
              key={item.id}
              className="cyber-card report-item fade-up"
            >
              <h2 className="cyber-section-title">
                Security Finding
              </h2>

              <div className="cyber-grid">

                <div>
                  <p className="cyber-subtitle">
                    Weakness
                  </p>

                  <p className="text-red-400 font-semibold">
                    {item.weakness}
                  </p>
                </div>

                <div>
                  <p className="cyber-subtitle">
                    Severity
                  </p>

                  <span className="cyber-badge">
                    {item.severity}
                  </span>
                </div>

                <div>
                  <p className="cyber-subtitle">
                    Recommendation
                  </p>

                  <p className="text-gray-300">
                    {item.recommendation}
                  </p>
                </div>

              </div>

            </div>
          ))}
        </div>

      </div>
    </div>
  );
}