import React, { useState } from "react";
import { loginUser } from "../services/api";
import { useNavigate, Link } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: ""
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleLogin = async () => {
    try {
      const res = await loginUser(form);

      alert(res.data.message);

      localStorage.setItem(
        "user",
        JSON.stringify(res.data.user)
      );

      if (res.data.user.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/dashboard");
      }

    } catch (error) {
      console.log(error);
      alert("Login Failed");
    }
  };

  return (
    <div className="cyber-bg">

      <div className="auth-container fade-up">

        <div className="cyber-card glow-pulse">

          <div className="center-text mb-lg">
            <div className="cyber-badge">
              Secure Access Portal
            </div>

            <h1 className="cyber-title mt-lg">
              Security Audit Login
            </h1>

            <p className="cyber-subtitle">
              Access your cyber security assessment dashboard
            </p>
          </div>

          <input
            type="email"
            name="email"
            placeholder="Enter Registered Email"
            onChange={handleChange}
            className="cyber-input"
          />

          <input
            type="password"
            name="password"
            placeholder="Enter Secure Password"
            onChange={handleChange}
            className="cyber-input"
          />

          <button
            onClick={handleLogin}
            className="cyber-btn"
          >
            Secure Login
          </button>

          <div className="center-text mt-lg">
            <p className="cyber-subtitle">
              Don’t have an account?
            </p>

            <Link
              to="/register"
              className="cyber-link"
            >
              Register Here
            </Link>
          </div>

          <div className="mt-lg">
            <div className="cyber-progress">
              <div
                className="cyber-progress-bar"
                style={{ width: "92%" }}
              ></div>
            </div>

            <p className="center-text cyber-subtitle mt-lg">
              Secure Authentication Layer Active
            </p>
          </div>

        </div>

      </div>

    </div>
  );
}