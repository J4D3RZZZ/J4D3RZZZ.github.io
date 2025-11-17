import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import "../styles/TeacherRooms.css";

export default function TeacherRooms({ user }) {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [time, setTime] = useState("");

  // Live clock
  useEffect(() => {
    const update = () => setTime(new Date().toLocaleTimeString());
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

  // Fetch rooms
  const fetchRooms = useCallback(async () => {
    const token = localStorage.getItem("token");
    if (!token) return console.error("No token found");

    try {
      const res = await axios.get(
        "https://j4d3rzzz-github-io-1.onrender.com/api/rooms",
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const now = new Date();

      const deptRooms = res.data
        .map((room) => {
          const sortedBookings = (room.bookings ?? [])
            .filter((b) => new Date(b.endTime) > now)
            .sort((a, b) => new Date(a.startTime) - new Date(b.startTime));

          return { ...room, bookings: sortedBookings };
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
    const interval = setInterval(fetchRooms, 10000);
    return () => clearInterval(interval);
  }, [fetchRooms]);

  if (loading) return <div className="page">Loading rooms...</div>;

  return (
    <div className="page">
      {/* HEADER */}
      <header>
        <div className="logo"></div>

        <div className="title">
          <h1>CVMS</h1>
          <p>Teacher Dashboard</p>
        </div>

        <div className="time">{time}</div>
      </header>

      {/* MAIN CONTENT */}
      <div className="rooms-wrapper">
        <h2 className="rooms-title">Room Monitoring ({user.department})</h2>

        {rooms.length === 0 ? (
          <p>No rooms found for your department.</p>
        ) : (
          <div className="rooms-list">
            {rooms.map((room) => {
              const now = new Date();
              const bookings = room.bookings;

              const current = bookings.find(
                (b) =>
                  new Date(b.startTime) <= now && new Date(b.endTime) >= now
              );

              const next = bookings.find(
                (b) => new Date(b.startTime) > now
              );

              return (
                <div className="room-box" key={room._id}>
                  <strong className="room-name">{room.name}</strong>

                  <ul className="room-info">
                    {/* CURRENTLY OCCUPIED */}
                    {current ? (
                      <li className="occupied">
                        <strong>Occupied Now:</strong> Prof. {current.teacher} —{" "}
                        {new Date(current.startTime).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}{" "}
                        to{" "}
                        {new Date(current.endTime).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}{" "}
                        — {current.section}
                      </li>
                    ) : (
                      <li className="available">Available Now</li>
                    )}

                    {/* NEXT SCHEDULE */}
                    {next && (
                      <li className="next">
                        <strong>Next Schedule:</strong> Prof. {next.teacher} —{" "}
                        {new Date(next.startTime).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}{" "}
                        to{" "}
                        {new Date(next.endTime).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}{" "}
                        — {next.section}
                      </li>
                    )}

                    {!current && !next && (
                      <li>No upcoming schedules</li>
                    )}
                  </ul>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <footer>© 2025 CVMS — All Rights Reserved</footer>
    </div>
  );
}
