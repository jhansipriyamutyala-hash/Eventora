import "../styles/Footer.css";
import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="footer">

      <div className="footer-container">

        {/* About */}

        <div className="footer-section">

          <h2>EVENTORA</h2>

          <p>
            Smart Event & Club Management System that helps students
            discover events, join clubs, volunteer, and earn certificates.
          </p>

        </div>

        {/* Quick Links */}

        <div className="footer-section">

          <h3>Quick Links</h3>

          <ul>

            <li><Link to="/">Home</Link></li>

            <li><Link to="/events">Events</Link></li>

            <li><Link to="/clubs">Clubs</Link></li>

            <li><Link to="/gallery">Gallery</Link></li>

          </ul>

        </div>

        {/* Services */}

        <div className="footer-section">

          <h3>Services</h3>

          <ul>

            <li><Link to="/dashboard">Dashboard</Link></li>

            <li><Link to="/volunteer">Volunteer</Link></li>

            <li><Link to="/certificates">Certificates</Link></li>

            <li><Link to="/feedback">Feedback</Link></li>

          </ul>

        </div>

        {/* Contact */}

        <div className="footer-section">

          <h3>Contact</h3>

          <p>📧 eventora@gmail.com</p>

          <p>📞 +91 98765 43210</p>

          <p>📍 Vignan University</p>

        </div>

      </div>

      <div className="footer-bottom">

        © 2026 EVENTORA | All Rights Reserved.

      </div>

    </footer>
  );
}

export default Footer;