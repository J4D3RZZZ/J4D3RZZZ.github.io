import React from "react";

export default function Unauthorized() {
  return (
    <div style={{ textAlign: "center", marginTop: 50 }}>
      <h2>Unauthorized Access</h2>
      <p>You need to login with the proper role to access this page.</p>
    </div>
  );
}
