import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./cvms.css"; // Reuse CVMS CSS

export default function Login({ setUser }) {
  const navigate = useNavigate();
  const [loginField, setLoginField] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post(
        "https://j4d3rzzz-github-io-1.onrender.com/api/auth/login",
        { loginField, password }
      );

      const loggedInUser = {
        _id: response.data.user.id,
        username: response.data.user.username,
        email: response.data.user.email,
        role: response.data.user.role,
        department: response.data.user.department,
        isAdmin: !!response.data.user.isAdmin,
        isApproved: response.data.user.isApproved,
        isVerified: response.data.user.isVerified,
      };

      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(loggedInUser));
      setUser(loggedInUser);

      alert("Login successful!");

      if (loggedInUser.isAdmin) navigate("/admin");
      else if (loggedInUser.role === "teacher") navigate("/teacher");
      else navigate("/student");
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Login failed!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <header>
        <div className="logo"></div>
        <div className="title">
          <h1>CVMS</h1>
          <p>Description</p>
        </div>
      </header>

      <div className="container">
        <div className="box_login">
          <h2>Login</h2>
          <form
            onSubmit={handleLogin}
            style={{ display: "flex", flexDirection: "column", gap: "12px", marginTop: "15px" }}
          >
            <input
              type="text"
              placeholder="Username or Email"
              value={loginField}
              onChange={(e) => setLoginField(e.target.value)}
              required
              className="input_field"
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="input_field"
            />
            <button type="submit" disabled={loading}>
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>
        </div>
      </div>

      <footer>© 2025 CVMS — All Rights Reserved</footer>
    </div>
  );
}
