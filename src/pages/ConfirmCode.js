import { useState, useEffect } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/ConfirmCode.css";

export default function ConfirmCode() {
  const { userId: paramUserId } = useParams(); // get userId from URL
  const location = useLocation(); // for navigation state
  const navigate = useNavigate();

  // Get userId from navigation state OR URL param
  const stateUserId = location.state?.userId || null;
  const userId = stateUserId || paramUserId;

  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);

  // Redirect to register if userId is missing
  useEffect(() => {
    if (!userId) navigate("/register");
  }, [userId, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!userId) return;

    setLoading(true);
    try {
      const numericCode = code.toString().trim();

      console.log("[FRONTEND] Sending verification request:", { userId, code: numericCode });

      const response = await axios.post(
        "https://j4d3rzzz-github-io-1.onrender.com/api/auth/verify",
        { userId, code: numericCode }
      );

      console.log("[FRONTEND] Verification response:", response.data);
      alert(response.data.message);

      // Redirect to login after successful verification
      navigate("/login");
    } catch (err) {
      console.error("[FRONTEND] Verification error:", err.response?.data || err.message);
      alert(err.response?.data?.message || "Verification failed.");
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
          <h2>Enter Confirmation Code</h2>
          <p>Please check your email and enter the code below to verify your account.</p>

          <form
            onSubmit={handleSubmit}
            style={{ display: "flex", flexDirection: "column", gap: "12px", marginTop: "20px" }}
          >
            <input
              type="text"
              placeholder="Confirmation Code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              required
              style={{
                padding: "12px",
                fontSize: "16px",
                borderRadius: "8px",
                border: "1px solid #ccc",
                outline: "none",
              }}
            />
            <button type="submit" disabled={loading}>
              {loading ? "Verifying..." : "Verify"}
            </button>
          </form>
        </div>
      </div>

      <footer>© 2025 CVMS — All Rights Reserved</footer>
    </div>
  );
}
