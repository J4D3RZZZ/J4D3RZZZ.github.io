import React, { useEffect, useState } from "react";
import axios from "axios";

export default function StudentRooms({ user }) {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);

  // Function to fetch rooms
  const fetchRooms = async () => {
    const token = localStorage.getItem("token");
    if (!token) return console.error("No token found in localStorage");

    try {
      const res = await axios.get("https://j4d3rzzz-github-io-1.onrender.com/api/rooms", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const now = new Date();
      const deptRooms = res.data
        .map(room => {
          const activeBookings = (room.bookings ?? []).filter(
            b => new Date(b.endTime) > now
          );
          return { ...room, bookings: activeBookings };
        })
        .filter(
          room =>
            room.department?.trim().toLowerCase() ===
            user.department?.trim().toLowerCase()
        );

      setRooms(deptRooms);
    } catch (err) {
      console.error("Error fetching rooms:", err);
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch + auto-refresh every 10 seconds
  useEffect(() => {
    fetchRooms(); // initial fetch
    const interval = setInterval(fetchRooms, 10000); // refresh every 10 seconds
    return () => clearInterval(interval);
  }, [user.department]);

  if (loading) return <div>Loading rooms...</div>;

  return (
    <div style={{ maxWidth: 800, margin: "50px auto" }}>
      <h2>Room Availability ({user.department})</h2>

      {rooms.length === 0 ? (
        <p>No rooms available for your department.</p>
      ) : (
        rooms.map(room => (
          <div
            key={room._id}
            style={{
              border: "1px solid #ccc",
              padding: 10,
              marginBottom: 10,
              borderRadius: 6,
            }}
          >
            <strong>{room.name}</strong>
            <ul>
              {(room.bookings ?? []).length === 0 ? (
                <li>Available</li>
              ) : (
                room.bookings.map((b, i) => (
                  <li key={i}>
                    Occupied by Prof. {b.teacher} |{" "}
                    {new Date(b.startTime).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}{" "}
                    -{" "}
                    {new Date(b.endTime).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}{" "}
                    | {b.section}
                  </li>
                ))
              )}
            </ul>
          </div>
        ))
      )}
    </div>
  );
}
