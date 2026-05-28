import React, { useState } from "react";
import { fetchComplianceMapping } from "../services/api";

export default function Compliance() {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleComplianceCheck = async () => {
    setLoading(true);

    try {
      const user = JSON.parse(localStorage.getItem("user"));

      if (!user || !user.id) {
        alert("Please login again");
        setLoading(false);
        return;
      }

      const res = await fetchComplianceMapping(user.id);

      setResults(res.data || []);

      if ((res.data || []).length === 0) {
        alert("No findings found. Complete an assessment first.");
      }

    } catch (error) {
      console.log(error);
      alert("Compliance mapping failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="cyber-bg">
      <div className="page-wrapper fade-up">

        <div className="dashboard-header">
          <div>
            <h1 className="cyber-title">
              Compliance Mapping Center
            </h1>

            <p className="cyber-subtitle">
              Map latest audit findings with ISO 27001, NIST, PCI-DSS, SOC 2, GDPR, HIPAA and COBIT
            </p>
          </div>

          <div className="cyber-badge">
            Compliance Engine
          </div>
        </div>

        <div className="cyber-card glow-pulse float-card">
          <h2 className="cyber-section-title">
            Run Security Compliance Analysis
          </h2>

          <p className="cyber-subtitle">
            This checks compliance mapping only for your latest assessment findings.
          </p>

          <button
            onClick={handleComplianceCheck}
            className="cyber-btn"
          >
            {loading
              ? "Running Analysis..."
              : "Run Compliance Mapping"}
          </button>
        </div>

        <div className="mt-lg">
          {results.length === 0 ? (
            <div className="cyber-card center-text">
              <p className="cyber-subtitle">
                No compliance mapping generated yet
              </p>
            </div>
          ) : (
            results.map((item, index) => (
              <div
                key={item.id || index}
                className="cyber-card report-item fade-up"
              >
                <h2 className="cyber-section-title">
                  Security Finding #{index + 1}
                </h2>

                <p>
                  <strong>Weakness:</strong> {item.weakness}
                </p>

                <p>
                  <strong>Severity:</strong>{" "}
                  <span className="cyber-badge">
                    {item.severity}
                  </span>
                </p>

                <p>
                  <strong>Recommendation:</strong> {item.recommendation}
                </p>

                <div className="mt-lg">
                  <h3 className="cyber-section-title">
                    Mapped Compliance Standards
                  </h3>

                  <div className="cyber-grid">
                    {item.compliance_standards.map((std, i) => (
                      <div
                        key={i}
                        className="cyber-stat-box"
                      >
                        <div className="cyber-stat-label">
                          {std}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
}