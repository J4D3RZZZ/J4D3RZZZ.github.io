import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import "../styles/StudentRooms.css";

export default function StudentRooms({ user }) {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [time, setTime] = useState(new Date().toLocaleTimeString());

  const fetchRooms = useCallback(async () => {
    const token = localStorage.getItem("token");
    if (!token) return console.error("No token found in localStorage");

    try {
      const res = await axios.get(
        "https://j4d3rzzz-github-io-1.onrender.com/api/rooms",
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const now = new Date();
      const deptRooms = res.data
        .map((room) => {
          const upcomingBookings = (room.bookings ?? [])
            .filter((b) => new Date(b.endTime) > now)
            .sort((a, b) => new Date(a.startTime) - new Date(b.startTime));
          return { ...room, bookings: upcomingBookings };
        })
        .filter(
          (room) =>
            room.department?.trim().toLowerCase() ===
            user.department?.trim().toLowerCase()
        );

      setRooms(deptRooms);
    } catch (err) {
      console.error("Error fetching rooms:", err);
    } finally {
      setLoading(false);
    }
  }, [user.department]);

  useEffect(() => {
    fetchRooms();
    const intervalRooms = setInterval(fetchRooms, 10000);
    const intervalTime = setInterval(() => {
      setTime(new Date().toLocaleTimeString());
    }, 1000);

    return () => {
      clearInterval(intervalRooms);
      clearInterval(intervalTime);
    };
  }, [fetchRooms]);

  if (loading) return <div className="loading">Loading rooms...</div>;

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
        <h2>Room Availability ({user.department})</h2>

        {rooms.length === 0 ? (
          <p>No rooms available for your department.</p>
        ) : (
          rooms.map((room) => (
            <div key={room._id} className="room">
              <strong>{room.name}</strong>
              <ul>
                {(room.bookings ?? []).length === 0 ? (
                  <li>Available</li>
                ) : (
                  room.bookings.map((b, i) => (
                    <li key={i}>
                      Occupied by Prof. {b.teacherName || b.teacher} |{" "}
                      {new Date(b.startTime).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}{" "}
                      -{" "}
                      {new Date(b.endTime).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })} | {b.section}
                    </li>
                  ))
                )}
              </ul>
            </div>
          ))
        )}
      </div>

      <footer>© 2025 CVMS — All Rights Reserved</footer>
    </div>
  );
}
