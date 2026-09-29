import "./../styles/Home.css";
import { Link } from "react-router-dom";

import {
  FaCalendarAlt,
  FaUsers,
  FaCertificate,
  FaImages
} from "react-icons/fa";

function Home() {
  return (
    <div className="home">

      {/* ================= HERO SECTION ================= */}

      <section className="hero">

        <div className="hero-content">

          <h1>EVENTORA</h1>

          <h2>Smart Event & Club Management System</h2>

          <p>
            Discover exciting events, join student clubs, volunteer,
            earn certificates and create unforgettable campus memories.
          </p>

          <div className="hero-buttons">

            <Link to="/events">
              <button className="primary-btn">
                Explore Events
              </button>
            </Link>

            <Link to="/clubs">
              <button className="secondary-btn">
                Join Clubs
              </button>
            </Link>

          </div>

        </div>

      </section>


      {/* ================= STATISTICS ================= */}

      <section className="stats">

        <div className="stat-card">
          <FaUsers className="stat-icon" />
          <h2>500+</h2>
          <p>Students</p>
        </div>

        <div className="stat-card">
          <FaCalendarAlt className="stat-icon" />
          <h2>50+</h2>
          <p>Events</p>
        </div>

        <div className="stat-card">
          <FaCertificate className="stat-icon" />
          <h2>1000+</h2>
          <p>Certificates</p>
        </div>

        <div className="stat-card">
          <FaImages className="stat-icon" />
          <h2>300+</h2>
          <p>Gallery Photos</p>
        </div>

      </section>


      {/* ================= FEATURED EVENTS ================= */}

      <section className="featured">

        <h2>Featured Events</h2>

        <div className="featured-container">

          {/* Hackathon */}

          <Link to="/events" className="home-event-link">

            <div className="featured-card">

              <img
                src="https://images.unsplash.com/photo-1511578314322-379afb476865?w=700"
                alt="Hackathon 2026"
              />

              <h3>Hackathon 2026</h3>

              <p>
                Participate in coding competitions and win exciting prizes.
              </p>

              <span className="view-event">
                View Event →
              </span>

            </div>

          </Link>


          {/* AI Workshop */}

          <Link to="/events" className="home-event-link">

            <div className="featured-card">

              <img
                src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=700"
                alt="AI Workshop"
              />

              <h3>AI Workshop</h3>

              <p>
                Learn Artificial Intelligence from industry experts.
              </p>

              <span className="view-event">
                View Event →
              </span>

            </div>

          </Link>


          {/* Cultural Fest */}

          <Link to="/events" className="home-event-link">

            <div className="featured-card">

              <img
                src="https://images.unsplash.com/photo-1505236858219-8359eb29e329?w=700"
                alt="Cultural Fest"
              />

              <h3>Cultural Fest</h3>

              <p>
                Celebrate music, dance and unforgettable performances.
              </p>

              <span className="view-event">
                View Event →
              </span>

            </div>

          </Link>

        </div>

      </section>


      {/* ================= POPULAR CLUBS ================= */}

      <section className="clubs-home">

        <h2>Popular Clubs</h2>

        <div className="club-list">

          <Link to="/clubs" className="home-club-link">
            <div className="club-box">
              <span className="club-emoji">💻</span>
              <span>Coding Club</span>
              <small>Explore Club →</small>
            </div>
          </Link>


          <Link to="/clubs" className="home-club-link">
            <div className="club-box">
              <span className="club-emoji">📷</span>
              <span>Photography Club</span>
              <small>Explore Club →</small>
            </div>
          </Link>


          <Link to="/clubs" className="home-club-link">
            <div className="club-box">
              <span className="club-emoji">🎵</span>
              <span>Music Club</span>
              <small>Explore Club →</small>
            </div>
          </Link>


          <Link to="/clubs" className="home-club-link">
            <div className="club-box">
              <span className="club-emoji">💃</span>
              <span>Dance Club</span>
              <small>Explore Club →</small>
            </div>
          </Link>

        </div>

      </section>


      {/* ================= CALL TO ACTION ================= */}

      <section className="cta">

        <h2>Become Part of EVENTORA</h2>

        <p>
          Register today and never miss an exciting opportunity on campus.
        </p>

        <Link to="/register">
          <button>
            Register Now
          </button>
        </Link>

      </section>

    </div>
  );
}

export default Home;