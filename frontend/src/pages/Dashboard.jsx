import React from "react";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));

  const cards = [
    {
      title: "Start Security Assessment",
      description: "Begin answering audit readiness questions",
      path: "/questionnaire"
    },
    {
      title: "View Reports",
      description: "Check weaknesses, findings and recommendations",
      path: "/report"
    },
    {
      title: "Compliance Mapping",
      description: "Map findings with ISO 27001, NIST, PCI-DSS standards",
      path: "/compliance"
    }
  ];

  if (user?.role === "admin") {
    cards.push({
      title: "Admin Panel",
      description: "Manage users, questions and security operations",
      path: "/admin"
    });
  }

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <div className="cyber-bg">

      <div className="page-wrapper fade-up">

        <div className="dashboard-header">

          <div>
            <h1 className="cyber-title">
              Security Audit Dashboard
            </h1>

            <p className="cyber-subtitle">
              Monitor assessments, compliance status and cyber risk readiness
            </p>
          </div>

          <button
            onClick={handleLogout}
            className="cyber-btn cyber-btn-danger"
            style={{ width: "180px" }}
          >
            Logout
          </button>

        </div>

        <div className="cyber-grid">

          {cards.map((card, index) => (
            <div
              key={index}
              className="cyber-card glow-pulse float-card"
            >
              <h2 className="cyber-section-title">
                {card.title}
              </h2>

              <p className="cyber-subtitle">
                {card.description}
              </p>

              <button
                onClick={() => navigate(card.path)}
                className="cyber-btn"
              >
                Open Module
              </button>
            </div>
          ))}

        </div>

        <div className="mt-lg">

          <div className="cyber-grid">

            <div className="cyber-stat-box">
              <div className="cyber-stat-number">
                {cards.length}
              </div>
              <div className="cyber-stat-label">
                Active Modules
              </div>
            </div>

            <div className="cyber-stat-box">
              <div className="cyber-stat-number">
                Secure
              </div>
              <div className="cyber-stat-label">
                Threat Monitoring Status
              </div>
            </div>

            <div className="cyber-stat-box">
              <div className="cyber-stat-number">
                Live
              </div>
              <div className="cyber-stat-label">
                Compliance Engine
              </div>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}