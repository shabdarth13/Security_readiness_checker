import React, { useEffect, useState } from "react";
import {
  addQuestion,
  fetchUsers
} from "../services/api";

export default function AdminPanel() {
  const [users, setUsers] = useState([]);

  const [form, setForm] = useState({
    domain: "",
    question: "",
    weight: "",

    iso_standard: "",
    nist_standard: "",
    pci_standard: "",

    soc2_standard: "",
    gdpr_standard: "",
    hipaa_standard: "",
    cobit_standard: ""
  });

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const res = await fetchUsers();
      setUsers(res.data || []);
    } catch (error) {
      console.log(error);
      alert("Failed to load users");
    }
  };

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleAddQuestion = async () => {
    // Basic validation
    if (
      !form.domain ||
      !form.question ||
      !form.weight
    ) {
      alert("Domain, Question and Weight are required");
      return;
    }

    try {
      await addQuestion(form);

      alert("Question + Full Compliance Mapping Added Successfully");

      // Reset form after success
      setForm({
        domain: "",
        question: "",
        weight: "",

        iso_standard: "",
        nist_standard: "",
        pci_standard: "",

        soc2_standard: "",
        gdpr_standard: "",
        hipaa_standard: "",
        cobit_standard: ""
      });

    } catch (error) {
      console.log(error);
      alert("Failed to Add Question");
    }
  };

  return (
    <div className="cyber-bg min-h-screen">
      <div className="page-wrapper">

        {/* Header */}
        <div className="dashboard-header">

          <div>
            <h1 className="dashboard-title">
              Admin Control Center
            </h1>

            <p className="cyber-subtitle">
              Manage users, security questions and compliance mappings
            </p>
          </div>

          <div className="cyber-badge">
            ADMIN ACCESS
          </div>

        </div>

        <div className="grid md:grid-cols-2 gap-8">

          {/* LEFT SIDE → Add Question */}
          <div className="cyber-card fade-up">

            <h2 className="cyber-section-title">
              Add New Security Question
            </h2>

            <input
              type="text"
              name="domain"
              placeholder="Enter Domain"
              value={form.domain}
              onChange={handleChange}
              className="cyber-input"
            />

            <input
              type="text"
              name="question"
              placeholder="Enter Security Question"
              value={form.question}
              onChange={handleChange}
              className="cyber-input"
            />

            <input
              type="number"
              name="weight"
              placeholder="Enter Weight"
              value={form.weight}
              onChange={handleChange}
              className="cyber-input"
            />

            <h3 className="mt-6 mb-3 font-semibold text-cyan-300">
              Compliance Framework Mapping
            </h3>

            <input
              type="text"
              name="iso_standard"
              placeholder="ISO 27001 Mapping"
              value={form.iso_standard}
              onChange={handleChange}
              className="cyber-input"
            />

            <input
              type="text"
              name="nist_standard"
              placeholder="NIST Mapping"
              value={form.nist_standard}
              onChange={handleChange}
              className="cyber-input"
            />

            <input
              type="text"
              name="pci_standard"
              placeholder="PCI-DSS Mapping"
              value={form.pci_standard}
              onChange={handleChange}
              className="cyber-input"
            />

            <input
              type="text"
              name="soc2_standard"
              placeholder="SOC 2 Mapping"
              value={form.soc2_standard}
              onChange={handleChange}
              className="cyber-input"
            />

            <input
              type="text"
              name="gdpr_standard"
              placeholder="GDPR Mapping"
              value={form.gdpr_standard}
              onChange={handleChange}
              className="cyber-input"
            />

            <input
              type="text"
              name="hipaa_standard"
              placeholder="HIPAA Mapping"
              value={form.hipaa_standard}
              onChange={handleChange}
              className="cyber-input"
            />

            <input
              type="text"
              name="cobit_standard"
              placeholder="COBIT Mapping"
              value={form.cobit_standard}
              onChange={handleChange}
              className="cyber-input"
            />

            <button
              onClick={handleAddQuestion}
              className="cyber-btn glow-pulse mt-4"
            >
              Add Question + Full Mapping
            </button>

          </div>

          {/* RIGHT SIDE → Users */}
          <div className="cyber-card fade-up">

            <h2 className="cyber-section-title">
              Registered Users
            </h2>

            {users.length === 0 ? (
              <p className="cyber-subtitle">
                No users found
              </p>
            ) : (
              users.map((user) => (
                <div
                  key={user.id}
                  className="report-item border-b border-cyan-800 pb-4 mb-4"
                >
                  <p>
                    <strong>Name:</strong> {user.name}
                  </p>

                  <p>
                    <strong>Email:</strong> {user.email}
                  </p>

                  <p>
                    <strong>Role:</strong> {user.role}
                  </p>
                </div>
              ))
            )}

          </div>

        </div>

      </div>
    </div>
  );
}