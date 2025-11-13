import React from "react";
import { Link } from "react-router-dom";

export default function Landing() {
  return (
    <div style={{ textAlign: "center", marginTop: 50 }}>
      <h1>Welcome to CVMS</h1>
      <p>Public landing page for guests and users.</p>
      <Link to="/register">
        <button>Register</button>
      </Link>
      <Link to="/login">
        <button style={{ marginLeft: 10 }}>Login</button>
      </Link>
    </div>
  );
}
