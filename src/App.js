// frontend/src/App.js
import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import axios from "axios";

import StudentRooms from "./pages/StudentRooms";
import TeacherRooms from "./pages/TeacherRooms";
import AdminDashboard from "./pages/AdminDashboard";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ConfirmCode from "./pages/ConfirmCode";
import Unauthorized from "./pages/Unauthorized";
import Landing from "./pages/Landing";
import ProtectedRoute from "./components/ProtectedRoute";
import PublicRoute from "./components/PublicRoute";

function AppWrapper() {
  return (
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );
}

function App() {
  const [user, setUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true); // wait until user is loaded
  const location = useLocation();

  // Load user from localStorage
  useEffect(() => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");
    if (token && userData) {
      setUser(JSON.parse(userData));
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    }
    setLoadingUser(false); // finished loading user
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    delete axios.defaults.headers.common["Authorization"];
    setUser(null);
    window.location.href = "/login";
  };

  const showLogout =
    user &&
    ["/student", "/teacher", "/admin"].some((path) =>
      location.pathname.startsWith(path)
    );

  // Wait until user is loaded before rendering routes
  if (loadingUser) return <div>Loading...</div>;

  return (
    <>
      {showLogout && (
        <button
          onClick={handleLogout}
          style={{
            position: "absolute",
            top: 15,
            right: 15,
            background: "#ff6b6b",
            border: "none",
            padding: "6px 10px",
            borderRadius: "6px",
            color: "#fff",
            cursor: "pointer",
            zIndex: 999,
          }}
        >
          Logout
        </button>
      )}

      <Routes>
        {/* PUBLIC ROUTES */}
        <Route
          path="/login"
          element={
            <PublicRoute user={user}>
              <Login setUser={setUser} />
            </PublicRoute>
          }
        />
        <Route path="/register" element={<PublicRoute user={user}><Register /></PublicRoute>} />
        <Route path="/confirm/:userId" element={<ConfirmCode />} />
        <Route path="/" element={<Landing />} />

        {/* PROTECTED ROUTES */}
        <Route
          path="/student"
          element={
            <ProtectedRoute user={user}>
              {user?.role === "student" ? (
                <StudentRooms user={user} />
              ) : (
                <Navigate to="/unauthorized" replace />
              )}
            </ProtectedRoute>
          }
        />
        <Route
          path="/teacher"
          element={
            <ProtectedRoute user={user}>
              {user?.role === "teacher" ? (
                <TeacherRooms user={user} />
              ) : (
                <Navigate to="/unauthorized" replace />
              )}
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <ProtectedRoute user={user}>
              {user?.isAdmin ? (
                <AdminDashboard user={user} />
              ) : (
                <Navigate to="/unauthorized" replace />
              )}
            </ProtectedRoute>
          }
        />

        {/* UNAUTHORIZED */}
        <Route path="/unauthorized" element={<Unauthorized />} />
      </Routes>
    </>
  );
}

export default AppWrapper;
