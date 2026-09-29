import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/Login.css";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");
    setMessageType("");

    if (!email.trim() || !password.trim()) {
      setMessage("⚠️ Please enter email and password.");
      setMessageType("error");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch("/api/students/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email.trim(),
          password: password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(`⚠️ ${data.message || "Invalid email or password."}`);
        setMessageType("error");
        return;
      }

      // Save logged-in student
      localStorage.setItem(
        "eventoraLoggedInStudent",
        JSON.stringify(data.student)
      );

      // Save student profile for auto-fill
      localStorage.setItem(
        "eventoraStudentProfile",
        JSON.stringify(data.student)
      );

      setMessage("✅ Login successful!");
      setMessageType("success");

      setTimeout(() => {
        // Login goes to HOME
        navigate("/");
      }, 800);

    } catch (error) {
      console.error(error);

      setMessage(
        "❌ Unable to connect to server. Please make sure the backend is running."
      );

      setMessageType("error");

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">

      <div className="login-card">

        <h1>Welcome Back</h1>

        <p className="login-subtitle">
          Login to continue using EVENTORA.
        </p>

        {message && (
          <div className={`login-message ${messageType}`}>
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit}>

          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
          />

          <button
            type="submit"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>

        </form>

        <p className="register-link">
          Don't have an account?{" "}
          <Link to="/register">
            Register
          </Link>
        </p>

      </div>

    </div>
  );
}

export default Login;