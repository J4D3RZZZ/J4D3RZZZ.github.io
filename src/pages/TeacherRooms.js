import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import "../styles/TeacherRooms.css";

export default function TeacherRooms({ user }) {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [time, setTime] = useState("");
  const [formData, setFormData] = useState({
    roomId: "",
    startTime: "",
    endTime: "",
    section: "",
  });

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

  // Booking form handlers
  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleBook = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (!token) return console.error("No token found");

    try {
      const today = new Date();
      const [startHour, startMin] = formData.startTime.split(":");
      const [endHour, endMin] = formData.endTime.split(":");

      const startTime = new Date(today);
      startTime.setHours(parseInt(startHour, 10), parseInt(startMin, 10), 0, 0);

      const endTime = new Date(today);
      endTime.setHours(parseInt(endHour, 10), parseInt(endMin, 10), 0, 0);

      if (startTime >= endTime) {
        return alert("Start time must be before end time!");
      }

      const room = rooms.find((r) => r._id === formData.roomId);
      if (!room) return alert("Selected room not found!");

      const overlap = (room.bookings ?? []).some((b) => {
        const bStart = new Date(b.startTime);
        const bEnd = new Date(b.endTime);
        return startTime < bEnd && endTime > bStart;
      });

      if (overlap) {
        return alert("This time overlaps with an existing booking!");
      }

      await axios.post(
        "https://j4d3rzzz-github-io-1.onrender.com/api/bookings/book",
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
      fetchRooms();
    } catch (err) {
      console.error("Booking failed:", err);
      alert(err.response?.data?.message || "Booking failed!");
    }
  };

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

        {/* BOOKING FORM */}
        <form className="booking-form" onSubmit={handleBook}>
          <select
            name="roomId"
            value={formData.roomId}
            onChange={handleChange}
            required
          >
            <option value="">Select Room</option>
            {rooms.map((room) => (
              <option key={room._id} value={room._id}>
                {room.name} {room.bookings?.length === 0 ? "(Available)" : "(Booked)"}
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

        {/* ROOMS LIST */}
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
              const next = bookings.find((b) => new Date(b.startTime) > now);

              return (
                <div className="room-box" key={room._id}>
                  <strong className="room-name">{room.name}</strong>
                  <ul className="room-info">
                    {current ? (
                      <li className="occupied">
                        <strong>Occupied Now:</strong> Prof. {current.teacher} —{" "}
                        {new Date(current.startTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}{" "}
                        to{" "}
                        {new Date(current.endTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}{" "}
                        — {current.section}
                      </li>
                    ) : (
                      <li className="available">Available Now</li>
                    )}

                    {next && (
                      <li className="next">
                        <strong>Next Schedule:</strong> Prof. {next.teacher} —{" "}
                        {new Date(next.startTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}{" "}
                        to{" "}
                        {new Date(next.endTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}{" "}
                        — {next.section}
                      </li>
                    )}

                    {!current && !next && <li>No upcoming schedules</li>}
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
