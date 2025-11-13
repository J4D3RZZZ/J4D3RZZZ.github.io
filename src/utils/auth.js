export function isTokenExpired(token) {
  if (!token) return true;
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    const exp = payload.exp; // expiration timestamp in seconds
    const now = Math.floor(Date.now() / 1000);
    return now >= exp;
  } catch (err) {
    return true;
  }
}

export function enforceTokenExpiryLogout() {
  const token = localStorage.getItem("token");
  const protectedPaths = ["/student", "/teacher", "/admin"];
  const isProtected = protectedPaths.some((path) => window.location.pathname.startsWith(path));

  if (!token || isTokenExpired(token)) {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("showAdmin");

    // Only redirect if on a protected page
    if (isProtected) {
      window.location.href = "/login";
    }
  }
}
