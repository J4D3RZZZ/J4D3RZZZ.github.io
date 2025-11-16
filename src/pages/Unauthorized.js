import React from "react";
import "../styles/Unauthorized.css";

export default function Unauthorized() {
  return (
    <div className="page">
      <header>
        <div className="logo"></div>

        <div className="title">
          <h1>CVMS</h1>
          <p>Access Denied</p>
        </div>
      </header>

      <div className="container">
        <div className="box_login">
          <h2>Unauthorized Access</h2>
          <p>You need to login with the proper role to access this page.</p>
        </div>
      </div>

      <footer>© 2025 CVMS — All Rights Reserved</footer>
    </div>
  );
}
