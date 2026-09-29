import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/Register.css";

function Register() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [studentId, setStudentId] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");
    setMessageType("");

    // ================= VALIDATION =================

    if (
      !name.trim() ||
      !email.trim() ||
      !studentId.trim() ||
      !password.trim() ||
      !confirmPassword.trim()
    ) {
      setMessage("⚠️ Please fill in all the fields.");
      setMessageType("error");
      return;
    }

    if (password.length < 6) {
      setMessage(
        "⚠️ Password must contain at least 6 characters."
      );
      setMessageType("error");
      return;
    }

    if (password !== confirmPassword) {
      setMessage("⚠️ Passwords do not match.");
      setMessageType("error");
      return;
    }

    // ================= STUDENT DATA =================

    const studentData = {
      name: name.trim(),
      email: email.trim().toLowerCase(),
      studentId: studentId.trim(),
      password: password,
    };

    // ================= SEND TO BACKEND =================

    try {
      const response = await fetch(
        "/api/students/register",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify(studentData),
        }
      );

      const data = await response.json();

      // ================= BACKEND ERROR =================

      if (!response.ok) {
        setMessage(
          `⚠️ ${data.error || "Registration failed."}`
        );

        setMessageType("error");
        return;
      }

      // ================= SAVE PROFILE =================

      const registeredStudent = {
        name: data.student.name,
        email: data.student.email,
        studentId: data.student.studentId,
      };

      localStorage.setItem(
        "eventoraStudentProfile",
        JSON.stringify(registeredStudent)
      );

      // ================= SUCCESS =================

      setMessage(
        "✅ Registration successful! Please login."
      );

      setMessageType("success");

      // Clear form
      setName("");
      setEmail("");
      setStudentId("");
      setPassword("");
      setConfirmPassword("");

      // Go to login
      setTimeout(() => {
        navigate("/login");
      }, 1500);

    } catch (error) {
      console.error(
        "Registration error:",
        error
      );

      setMessage(
        "⚠️ Cannot connect to the server. Please make sure the backend is running."
      );

      setMessageType("error");
    }
  };

  return (
    <div className="register-page">

      <div className="register-card">

        <h1>Create Account</h1>

        <p className="register-subtitle">
          Join EVENTORA and explore campus activities.
        </p>

        {/* ================= MESSAGE ================= */}

        {message && (
          <div
            className={`register-message ${messageType}`}
          >
            {message}
          </div>
        )}

        {/* ================= FORM ================= */}

        <form onSubmit={handleSubmit}>

          {/* Full Name */}

          <input
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) =>
              setName(e.target.value)
            }
          />

          {/* Email */}

          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
          />

          {/* Student ID */}

          <input
            type="text"
            placeholder="Student ID"
            value={studentId}
            onChange={(e) =>
              setStudentId(e.target.value)
            }
          />

          {/* Password */}

          <input
            type="password"
            placeholder="Create Password"
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
            }
          />

          {/* Confirm Password */}

          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) =>
              setConfirmPassword(e.target.value)
            }
          />

          <button type="submit">
            Register
          </button>

        </form>

        {/* ================= LOGIN LINK ================= */}

        <p className="login-link">
          Already have an account?{" "}

          <Link to="/login">
            Login
          </Link>
        </p>

      </div>

    </div>
  );
}

export default Register;