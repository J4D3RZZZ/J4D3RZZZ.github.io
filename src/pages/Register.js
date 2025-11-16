import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/Register.css";

export default function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    role: "student",
    department: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post(
        "https://j4d3rzzz-github-io-1.onrender.com/api/auth/register",
        formData
      );

      alert(response.data.message);
      setLoading(false);

      navigate(`/confirm/${response.data.userId}`);
    } catch (err) {
      console.error("Registration error:", err.response?.data || err.message);
      alert(err.response?.data?.message || "Registration failed.");
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
          <h2>Register</h2>
          <form
            onSubmit={handleSubmit}
            style={{ display: "flex", flexDirection: "column", gap: "12px", marginTop: "15px" }}
          >
            <input
              type="text"
              name="username"
              placeholder="Username"
              value={formData.username}
              onChange={handleChange}
              required
              className="input_field"
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
              className="input_field"
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
              className="input_field"
            />

            <label style={{ textAlign: "left" }}>Role:</label>
            <select name="role" value={formData.role} onChange={handleChange} className="input_field">
              <option value="student">Student</option>
              <option value="teacher">Teacher</option>
            </select>

            <label style={{ textAlign: "left" }}>Department:</label>
            <select
              name="department"
              value={formData.department}
              onChange={handleChange}
              required
              className="input_field"
            >
              <option value="">Select Department</option>
              <option value="CEAT">CEAT</option>
              <option value="CM">CM</option>
              <option value="BINDTECH">BINDTECH</option>
              <option value="COED">COED</option>
            </select>

            <button type="submit" disabled={loading}>
              {loading ? "Registering..." : "Register"}
            </button>
          </form>
        </div>
      </div>

      <footer>© 2025 CVMS — All Rights Reserved</footer>
    </div>
  );
}
