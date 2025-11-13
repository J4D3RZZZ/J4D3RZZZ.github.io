import React, { useEffect, useState } from "react";
import axios from "axios";

export default function TeacherRooms({ user }) {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    roomId: "",
    startTime: "",
    endTime: "",
    section: "",
  });

  // Function to fetch rooms from backend
  const fetchRooms = async () => {
    const token = localStorage.getItem("token");
    if (!token) return console.error("No token found in localStorage");

    try {
      const res = await axios.get("https://j4d3rzzz-github-io-1.onrender.com/api/rooms", {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Filter out expired bookings
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

    const interval = setInterval(() => {
      fetchRooms();
    }, 10000); // refresh every 10 seconds

    return () => clearInterval(interval); // cleanup on unmount
  }, [user.department]);

  const handleChange = e =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  // Booking function
  const handleBook = async e => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (!token) return console.error("No token found in localStorage");

    try {
      const today = new Date();
      const [startHour, startMin] = formData.startTime.split(":");
      const [endHour, endMin] = formData.endTime.split(":");

      const startTime = new Date(today);
      startTime.setHours(parseInt(startHour, 10), parseInt(startMin, 10), 0, 0);

      const endTime = new Date(today);
      endTime.setHours(parseInt(endHour, 10), parseInt(endMin, 10), 0, 0);

      await axios.post(
        "http://localhost:5000/api/bookings/book",
        {
          roomId: formData.roomId,
          startTime,
          endTime,
          section: formData.section,
          teacherName: user.username,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert("Room booked successfully!");
      setFormData({ roomId: "", startTime: "", endTime: "", section: "" });
      fetchRooms(); // refresh immediately after booking
    } catch (err) {
      console.error("Booking failed:", err);
      alert(err.response?.data?.message || "Booking failed!");
    }
  };

  if (loading) return <div>Loading rooms...</div>;

  return (
    <div style={{ maxWidth: 800, margin: "50px auto" }}>
      <h2>Teacher Dashboard ({user.department})</h2>

      {/* Booking form */}
      <form
        onSubmit={handleBook}
        style={{ display: "flex", gap: "10px", marginBottom: "20px" }}
      >
        <select
          name="roomId"
          value={formData.roomId}
          onChange={handleChange}
          required
        >
          <option value="">Select Room</option>
          {rooms.map(room => (
            <option key={room._id} value={room._id}>
              {room.name} ({room.bookings?.length === 0 ? "Available" : "Booked"})
            </option>
          ))}
        </select>

        <input
          type="text"
          name="section"
          placeholder="Section"
          value={formData.section}
          onChange={handleChange}
          required
        />
        <input
          type="time"
          name="startTime"
          value={formData.startTime}
          onChange={handleChange}
          required
        />
        <input
          type="time"
          name="endTime"
          value={formData.endTime}
          onChange={handleChange}
          required
        />
        <button type="submit">Book Room</button>
      </form>

      {/* Rooms list */}
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
