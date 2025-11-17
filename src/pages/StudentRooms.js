import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import "../styles/StudentRooms.css";

export default function StudentRooms({ user }) {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);

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
    const interval = setInterval(fetchRooms, 10000);
    return () => clearInterval(interval);
  }, [fetchRooms]);

  if (loading) return <div className="page">Loading rooms...</div>;

  return (
    <div className="page">
      <div className="student-rooms-container">
        <h2 className="rooms-title">
          Room Availability ({user.department})
        </h2>

        {rooms.length === 0 ? (
          <p>No rooms available for your department.</p>
        ) : (
          <div className="rooms-list">
            {rooms.map((room) => (
              <div className="room-card" key={room._id}>
                <strong className="room-name">{room.name}</strong>

                <ul className="room-bookings">
                  {(room.bookings ?? []).length === 0 ? (
                    <li>Available</li>
                  ) : (
                    room.bookings.map((b, i) => (
                      <li key={i}>
                        Occupied by Prof. {b.teacherName || b.teacher} —{" "}
                        {new Date(b.startTime).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}{" "}
                        to{" "}
                        {new Date(b.endTime).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}{" "}
                        — {b.section}
                      </li>
                    ))
                  )}
                </ul>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
