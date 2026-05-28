import React from "react";
import {
  BrowserRouter,
  Routes,
  Route
} from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Questionnaire from "./pages/Questionnaire";
import Report from "./pages/Report";
import Compliance from "./pages/Compliance";
import AdminPanel from "./pages/AdminPanel";

export default function App() {
  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <BrowserRouter>
      <Routes>

        <Route path="/" element={<Login />} />

        <Route
          path="/register"
          element={<Register />}
        />

        <Route
          path="/dashboard"
          element={<Dashboard />}
        />

        <Route
          path="/questionnaire"
          element={<Questionnaire />}
        />

        <Route
          path="/report"
          element={<Report />}
        />

        <Route
          path="/compliance"
          element={<Compliance />}
        />

        <Route
          path="/admin"
          element={
            user?.role === "admin"
              ? <AdminPanel />
              : <Login />
          }
        />

      </Routes>
    </BrowserRouter>
  );
}