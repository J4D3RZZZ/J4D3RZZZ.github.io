import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/AdminDashboard.css";

export default function AdminDashboard({ user }) {
  const [pendingUsers, setPendingUsers] = useState([]);
  const [adminUsers, setAdminUsers] = useState([]);
  const [rejectedUsers, setRejectedUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [time, setTime] = useState("");

  const [showRejectModal, setShowRejectModal] = useState(false);
  const [currentRejectUser, setCurrentRejectUser] = useState(null);
  const [rejectReason, setRejectReason] = useState("");

  // Live clock
  useEffect(() => {
    const update = () => setTime(new Date().toLocaleTimeString());
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

  // Fetch users
  const fetchUsers = async () => {
    try {
      const res = await axios.get(
        "https://j4d3rzzz-github-io-1.onrender.com/api/admin/users"
      );
      const users = res.data;
      setPendingUsers(users.filter((u) => u.isApproved === "pending"));
      setAdminUsers(users.filter((u) => u.isAdmin));
    } catch (err) {
      console.error("Error fetching users:", err.response?.data || err.message);
    }
  };

  const fetchRejectedUsers = async () => {
    try {
      const res = await axios.get(
        "https://j4d3rzzz-github-io-1.onrender.com/api/admin/rejected-users"
      );
      setRejectedUsers(res.data);
    } catch (err) {
      console.error(
        "Error fetching rejected users:",
        err.response?.data || err.message
      );
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
      const res = await axios.put(
        `https://j4d3rzzz-github-io-1.onrender.com/api/admin/approve/${userId}`
      );
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
        `https://j4d3rzzz-github-io-1.onrender.com/api/admin/reject/${currentRejectUser._id}`,
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

  if (loading) return <div className="page">Loading admin dashboard...</div>;

  return (
    <div className="page">
      {/* HEADER */}
      <header>
        <div className="logo"></div>
        <div className="title">
          <h1>CVMS</h1>
          <p>Admin Dashboard</p>
        </div>
        <div className="time">{time}</div>
      </header>

      {/* MAIN CONTENT */}
      <div className="dashboard-wrapper">
        {/* Pending Users */}
        <div className="dashboard-box">
          <h3>Pending Users</h3>
          {pendingUsers.length === 0 && <p>No pending users.</p>}
          {pendingUsers.map((u) => (
            <div key={u._id} className="user-row">
              <strong>{u.username}</strong> | {u.email} | {u.role} | {u.department}
              <div className="user-actions">
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

        {/* Admin Users */}
        <div className="dashboard-box">
          <h3>Admin Users</h3>
          {adminUsers.length === 0 && <p>No admin users.</p>}
          {adminUsers.map((u) => (
            <div key={u._id} className="user-row">
              <strong>{u.username}</strong> | {u.email} | {u.role} | {u.department}
            </div>
          ))}
        </div>

        {/* Rejected Users */}
        <div className="dashboard-box">
          <h3>Rejected Users</h3>
          {rejectedUsers.length === 0 && <p>No rejected users.</p>}
          {rejectedUsers.map((u) => (
            <div key={u._id} className="user-row">
              <strong>{u.username}</strong> | {u.email} | {u.role} | {u.department}
              <br />
              <small>
                Reason: {u.reason} | Rejected By: {u.rejectedBy} | Date:{" "}
                {new Date(u.date).toLocaleString()}
              </small>
            </div>
          ))}
        </div>
      </div>

      {/* REJECT MODAL */}
      {showRejectModal && (
        <div className="modal-overlay">
          <div className="modal-box">
            <h4>Reject {currentRejectUser.username}</h4>
            <input
              type="text"
              placeholder="Enter rejection reason"
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
            />
            <div className="modal-actions">
              <button onClick={() => setShowRejectModal(false)}>Cancel</button>
              <button onClick={handleRejectConfirm} disabled={!rejectReason}>
                Confirm Reject
              </button>
            </div>
          </div>
        </div>
      )}

      <footer>© 2025 CVMS — All Rights Reserved</footer>
    </div>
  );
}
