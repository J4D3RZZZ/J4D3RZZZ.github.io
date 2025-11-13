import React, { useEffect, useState } from "react";
import axios from "axios";

export default function AdminDashboard({ user }) {
  const [pendingUsers, setPendingUsers] = useState([]);
  const [adminUsers, setAdminUsers] = useState([]);
  const [rejectedUsers, setRejectedUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showRejectModal, setShowRejectModal] = useState(false);
  const [currentRejectUser, setCurrentRejectUser] = useState(null);
  const [rejectReason, setRejectReason] = useState("");

  const fetchUsers = async () => {
    try {
      const res = await axios.get("https://j4d3rzzz-github-io-1.onrender.com/api/admin/users");
      const users = res.data;
      setPendingUsers(users.filter(u => u.isApproved === "pending"));
      setAdminUsers(users.filter(u => u.isAdmin));
    } catch (err) {
      console.error("Error fetching users:", err.response?.data || err.message);
    }
  };

  const fetchRejectedUsers = async () => {
    try {
      const res = await axios.get("https://j4d3rzzz-github-io-1.onrender.com/api/admin/rejected-users");
      setRejectedUsers(res.data);
    } catch (err) {
      console.error("Error fetching rejected users:", err.response?.data || err.message);
    }
  };

  useEffect(() => {
    setLoading(true);
    fetchUsers();
    fetchRejectedUsers();
    setLoading(false);

    const interval = setInterval(() => {
      fetchUsers();
      fetchRejectedUsers();
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const handleApprove = async (userId) => {
    try {
      const res = await axios.put(`http://localhost:5000/api/admin/approve/${userId}`);
      alert(res.data.message);
      fetchUsers();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Error approving user");
    }
  };

  const handleRejectConfirm = async () => {
    if (!currentRejectUser || !rejectReason) return;
    try {
      const res = await axios.put(
        `http://localhost:5000/api/admin/reject/${currentRejectUser._id}`,
        { reason: rejectReason }
      );
      alert(res.data.message);
      setShowRejectModal(false);
      setRejectReason("");
      setCurrentRejectUser(null);
      fetchUsers();
      fetchRejectedUsers();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Error rejecting user");
    }
  };

  if (loading) return <div>Loading admin dashboard...</div>;

  return (
    <div style={{ maxWidth: 1200, margin: "50px auto", display: "flex", gap: "20px" }}>

      {/* Pending Users Box */}
      <div style={{ flex: 1, border: "1px solid #ccc", borderRadius: "6px", padding: "15px" }}>
        <h3>Pending Users</h3>
        {pendingUsers.length === 0 && <p>No pending users.</p>}
        {pendingUsers.map(u => (
          <div key={u._id} style={{ marginBottom: "10px", padding: "8px", borderBottom: "1px solid #eee" }}>
            <strong>{u.username}</strong> | {u.email} | {u.role} | {u.department}
            <div style={{ marginTop: "5px", display: "flex", gap: "5px" }}>
              <button onClick={() => handleApprove(u._id)}>Accept</button>
              <button
                onClick={() => {
                  setCurrentRejectUser(u);
                  setShowRejectModal(true);
                }}
              >
                Reject
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Admin Users Box */}
      <div style={{ flex: 1, border: "1px solid #ccc", borderRadius: "6px", padding: "15px" }}>
        <h3>Admin Users</h3>
        {adminUsers.length === 0 && <p>No admin users.</p>}
        {adminUsers.map(u => (
          <div key={u._id} style={{ marginBottom: "10px", padding: "8px", borderBottom: "1px solid #eee" }}>
            <strong>{u.username}</strong> | {u.email} | {u.role} | {u.department}
          </div>
        ))}
      </div>

      {/* Rejected Users Box */}
      <div style={{ flex: 1, border: "1px solid #ccc", borderRadius: "6px", padding: "15px" }}>
        <h3>Rejected Users</h3>
        {rejectedUsers.length === 0 && <p>No rejected users.</p>}
        {rejectedUsers.map(u => (
          <div key={u._id} style={{ marginBottom: "10px", padding: "8px", borderBottom: "1px solid #eee" }}>
            <strong>{u.username}</strong> | {u.email} | {u.role} | {u.department}<br/>
            <small>
              Reason: {u.reason} | Rejected By: {u.rejectedBy} | Date: {new Date(u.date).toLocaleString()}
            </small>
          </div>
        ))}
      </div>

      {/* Reject Modal */}
      {showRejectModal && (
        <div style={{
          position: "fixed",
          top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: "rgba(0,0,0,0.5)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          zIndex: 1000
        }}>
          <div style={{ background: "#fff", padding: "20px", borderRadius: "8px", width: 400 }}>
            <h4>Reject {currentRejectUser.username}</h4>
            <input
              type="text"
              placeholder="Enter rejection reason"
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              style={{ width: "100%", padding: "8px", marginBottom: "10px", borderRadius: "4px" }}
            />
            <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
              <button onClick={() => setShowRejectModal(false)}>Cancel</button>
              <button onClick={handleRejectConfirm} disabled={!rejectReason}>Confirm Reject</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
