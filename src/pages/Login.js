// src/pages/Login.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Login({ setUser }) {
  const navigate = useNavigate();
  const [loginField, setLoginField] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://localhost:5000/api/auth/login", {
        loginField,
        password,
      });

      // Convert isAdmin to boolean
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

      // Save in localStorage
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(loggedInUser));

      // Update App state
      setUser(loggedInUser);

      alert("Login successful!");

      // Redirect based on role or admin
      if (loggedInUser.isAdmin) navigate("/admin");
      else if (loggedInUser.role === "teacher") navigate("/teacher");
      else if (loggedInUser.role === "student") navigate("/student");
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Login failed!");
    }
  };

  return (
    <form
      onSubmit={handleLogin}
      style={{
        maxWidth: 400,
        margin: "50px auto",
        display: "flex",
        flexDirection: "column",
        gap: "10px",
      }}
    >
      <input
        type="text"
        placeholder="Username or Email"
        value={loginField}
        onChange={(e) => setLoginField(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <button type="submit">Login</button>
    </form>
  );
}
