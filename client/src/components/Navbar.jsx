import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { FaBars, FaTimes } from "react-icons/fa";
import "../styles/Navbar.css";
import logo from "../assets/logo.png";

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const closeMenu = () => {
    setMenuOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("currentStudent");
    localStorage.removeItem("eventoraCurrentStudent");

    setMenuOpen(false);

    alert("Logged out successfully!");

    navigate("/login");
  };

  return (
    <>
      <nav className="navbar">
        <div className="logo">
          <img
            src={logo}
            alt="EVENTORA Logo"
            className="logo-img"
          />
        </div>

        <ul className="nav-links">
          <li>
            <Link to="/">Home</Link>
          </li>

          <li>
            <Link to="/dashboard">Dashboard</Link>
          </li>

          <li>
            <Link to="/events">Events</Link>
          </li>

          <li>
            <Link to="/clubs">Clubs</Link>
          </li>

          <li>
            <Link to="/gallery">Gallery</Link>
          </li>
        </ul>

        <button
          className="menu-btn"
          onClick={() => setMenuOpen(true)}
          aria-label="Open menu"
        >
          <FaBars />
        </button>
      </nav>

      <div
        className={`overlay ${menuOpen ? "show-overlay" : ""}`}
        onClick={closeMenu}
      ></div>

      <div className={`sidebar ${menuOpen ? "show-sidebar" : ""}`}>
        <div className="sidebar-top">
          <h2>EVENTORA</h2>

          <p>
            Smart Event &
            <br />
            Club Management
          </p>

          <FaTimes
            className="close-btn"
            onClick={closeMenu}
          />
        </div>

        <div className="sidebar-links">
          <Link to="/volunteer" onClick={closeMenu}>
            Volunteer
          </Link>

          <Link to="/certificates" onClick={closeMenu}>
            Certificates
          </Link>

          <Link to="/feedback" onClick={closeMenu}>
            Feedback
          </Link>

          <hr />

          <Link to="/login" onClick={closeMenu}>
            Login
          </Link>

          <Link to="/register" onClick={closeMenu}>
            Register
          </Link>

          <button
            className="logout-btn"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      </div>
    </>
  );
}

export default Navbar;