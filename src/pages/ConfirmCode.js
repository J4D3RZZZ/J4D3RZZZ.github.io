import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

export default function ConfirmCode() {
  const { userId } = useParams(); // get userId from URL
  const navigate = useNavigate();

  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Trim and ensure numeric code
      const numericCode = code.toString().trim();

      console.log("[FRONTEND] Sending verification request:", {
        userId,
        code: numericCode,
      });

      const response = await axios.post(
        "http://localhost:5000/api/auth/verify",
        { userId, code: numericCode }
      );

      console.log("[FRONTEND] Verification response:", response.data);
      alert(response.data.message);

      // Redirect to login after successful verification
      navigate("/login");
    } catch (err) {
      console.error(
        "[FRONTEND] Verification error:",
        err.response?.data || err.message
      );
      alert(err.response?.data?.message || "Verification failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: "50px auto", textAlign: "center" }}>
      <h2>Enter Confirmation Code</h2>
      <form
        onSubmit={handleSubmit}
        style={{ display: "flex", flexDirection: "column", gap: "12px" }}
      >
        <input
          type="text"
          placeholder="Confirmation Code"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? "Verifying..." : "Verify"}
        </button>
      </form>
    </div>
  );
}
