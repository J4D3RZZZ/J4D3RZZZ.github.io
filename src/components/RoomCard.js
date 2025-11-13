import React from "react";

export default function RoomCard({ room }) {
  return (
    <div
      className="room-card"
      style={{
        border: "1px solid #ccc",
        borderRadius: 8,
        padding: 16,
        marginBottom: 16,
        backgroundColor: "#f9f9f9",
      }}
    >
      <h3>{room.name}</h3>
      <p><strong>Location:</strong> {room.location}</p>
      <p><strong>Department:</strong> {room.department}</p>
      <p><strong>Usage:</strong> {room.usage}</p>

      {/* If room has image(s), show them */}
      {Array.isArray(room.images) && room.images.length > 0 ? (
        <div style={{ marginTop: 10 }}>
          <img
            src={room.images[0]}
            alt={`${room.name} preview`}
            style={{
              width: "100%",
              maxWidth: 300,
              height: "auto",
              borderRadius: 6,
            }}
          />
          {room.images.length > 1 && (
            <div style={{ display: "flex", marginTop: 8, gap: 5 }}>
              {room.images.slice(1).map((img, i) => (
                <img
                  key={i}
                  src={img}
                  alt={`extra ${i + 1}`}
                  style={{
                    width: 80,
                    height: 60,
                    objectFit: "cover",
                    borderRadius: 4,
                  }}
                />
              ))}
            </div>
          )}
        </div>
      ) : (
        <p style={{ color: "#777" }}>No image available</p>
      )}
    </div>
  );
}
