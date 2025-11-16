import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../styles/Landing.css";

export default function Landing() {
  const [time, setTime] = useState("");

  // Update time every second
  useEffect(() => {
    const update = () => {
      setTime(new Date().toLocaleTimeString());
    };
    update();
    const interval = setInterval(update, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="page">
      <header>
        <div className="logo"></div>

        <div className="title">
          <h1>CVMS</h1>
          <p>Description</p>
        </div>

        <div className="time">{time}</div>
      </header>

      <div className="container">
        <div className="box_login">
          <h1>Welcome to CVMS</h1>
          <p>Please register or login to continue.</p>

          <a href="/register">
            <button>Register</button>
          </a>

          <a href="/login">
            <button style={{ marginLeft: 10 }}>Login</button>
          </a>
        </div>
      </div>

      <footer>© 2025 CVMS — All Rights Reserved</footer>
    </div>
  );
}
