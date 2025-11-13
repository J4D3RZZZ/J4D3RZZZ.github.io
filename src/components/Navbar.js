// frontend/src/components/Navbar.js
import React, { useEffect, useState } from "react";

export default function Navbar() {
  const [user, setUser] = useState(null);
  const [showAdmin, setShowAdmin] = useState(false);
  const [loadingUser, setLoadingUser] = useState(true); // track if user info is loaded

  useEffect(() => {
    try {
      const u = JSON.parse(localStorage.getItem("user"));
      setUser(u || null);

      const saved = localStorage.getItem("showAdmin");
      setShowAdmin(saved === "true");
    } catch (e) {
      setUser(null);
      setShowAdmin(false);
    } finally {
      setLoadingUser(false); // finished loading user
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("showAdmin");
    window.location.href = "/login";
  };

  const toggleAdminView = () => {
    const newVal = !showAdmin;
    setShowAdmin(newVal);
    localStorage.setItem("showAdmin", newVal ? "true" : "false");
  };

  // Wait until user is loaded
  if (loadingUser) return null;

  return (
    <nav
      style={{
        display: "flex",
        alignItems: "center",
        gap: "12px",
        padding: "10px 20px",
        background: "#222",
        color: "#fff",
      }}
    >
      <a href="/" style={{ color: "#fff", textDecoration: "none" }}>
        Home
      </a>

      {user && <span>Welcome, {user.username}</span>}

      {/* Admin toggle - only if server-side isAdmin === true */}
      {user?.isAdmin && (
        <>
          <label
            style={{
              marginLeft: 12,
              display: "flex",
              alignItems: "center",
              gap: 4,
            }}
          >
            <input
              type="checkbox"
              checked={showAdmin}
              onChange={toggleAdminView}
            />
            Show Admin
          </label>
          {showAdmin && (
            <a
              href="/admin"
              style={{ marginLeft: 8, color: "#fff", textDecoration: "none" }}
            >
              Admin Dashboard
            </a>
          )}
        </>
      )}

      <div style={{ marginLeft: "auto" }}>
        {user ? (
          <button
            onClick={handleLogout}
            style={{
              cursor: "pointer",
              padding: "6px 12px",
              borderRadius: "6px",
              border: "none",
              background: "#ff6b6b",
              color: "#fff",
            }}
          >
            Logout
          </button>
        ) : (
          <a href="/login" style={{ color: "#fff", textDecoration: "none" }}>
            Login
          </a>
        )}
      </div>
    </nav>
  );
}
