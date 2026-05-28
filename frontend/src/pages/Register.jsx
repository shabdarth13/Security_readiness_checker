import React, { useState } from "react";
import { registerUser } from "../services/api";
import { useNavigate, Link } from "react-router-dom";

export default function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: ""
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleRegister = async () => {
    if (!form.name || !form.email || !form.password) {
      alert("Please fill all fields");
      return;
    }

    setLoading(true);

    try {
      await registerUser(form);

      alert("Registration successful. Please login.");
      navigate("/");

    } catch (error) {
      console.log(error);
      alert("Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="cyber-bg">

      <div className="auth-container fade-up">

        <div className="cyber-card glow-pulse">

          <div className="center-text mb-lg">
            <div className="cyber-badge">
              User Registration
            </div>

            <h1 className="cyber-title mt-lg">
              Create Account
            </h1>

            <p className="cyber-subtitle">
              Register as a normal user to access security assessment
            </p>
          </div>

          <input
            type="text"
            name="name"
            placeholder="Enter Full Name"
            value={form.name}
            onChange={handleChange}
            className="cyber-input"
          />

          <input
            type="email"
            name="email"
            placeholder="Enter Email"
            value={form.email}
            onChange={handleChange}
            className="cyber-input"
          />

          <input
            type="password"
            name="password"
            placeholder="Enter Password"
            value={form.password}
            onChange={handleChange}
            className="cyber-input"
          />

          <button
            onClick={handleRegister}
            disabled={loading}
            className={`cyber-btn ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {loading ? "Creating Account..." : "Register"}
          </button>

          <div className="center-text mt-lg">
            <p className="cyber-subtitle">
              Already have an account?
            </p>

            <Link
              to="/"
              className="cyber-link"
            >
              Login Here
            </Link>
          </div>

        </div>

      </div>

    </div>
  );
}