import { useState } from "react";

function AdminLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();

    // Admin login details
    const correctUsername = "admin";
    const correctPassword = "12345";

    if (
      username === correctUsername &&
      password === correctPassword
    ) {
      // Save login status
      localStorage.setItem("adminLoggedIn", "true");

      // Open admin dashboard
      window.location.href = "/admin";
    } else {
      alert("Invalid username or password");
    }
  };

  return (
    <div className="login-page">

      <div className="login-box">

        <div className="login-icon">
          🔐
        </div>

        <h1>Admin Login</h1>

        <p>
          Login to access the Admin Dashboard
        </p>

        <form onSubmit={handleLogin}>

          {/* Username */}
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) =>
              setUsername(e.target.value)
            }
          />

          {/* Password */}
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
            }
          />

          <button type="submit">
            🔑 Login
          </button>

        </form>

        <button
          className="login-back-btn"
          onClick={() => {
            window.location.href = "/";
          }}
        >
          ← Back to Website
        </button>

      </div>

    </div>
  );
}

export default AdminLogin;