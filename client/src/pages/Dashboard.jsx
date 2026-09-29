import { useEffect, useState } from "react";
import "./../styles/Dashboard.css";
import { Link } from "react-router-dom";

import {
  FaCalendarAlt,
  FaUsers,
  FaCertificate,
  FaHandsHelping,
  FaUserCircle,
  FaArrowRight,
} from "react-icons/fa";

function Dashboard() {
  // ================= STUDENT =================

  const [student, setStudent] = useState(() => {
    const savedStudent = localStorage.getItem(
      "eventoraLoggedInStudent"
    );

    return savedStudent
      ? JSON.parse(savedStudent)
      : null;
  });

  // ================= DASHBOARD DATA =================

  const [eventRegistrations, setEventRegistrations] =
    useState([]);

  const [joinedClubs, setJoinedClubs] =
    useState([]);

  const [volunteerApplications, setVolunteerApplications] =
    useState([]);

  const [loading, setLoading] = useState(true);

  // ================= FETCH DASHBOARD DATA =================

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const loggedInStudent =
          JSON.parse(
            localStorage.getItem(
              "eventoraLoggedInStudent"
            )
          );

        if (!loggedInStudent) {
          setLoading(false);
          return;
        }

        setStudent(loggedInStudent);

        const studentEmail =
          loggedInStudent.email
            ?.trim()
            .toLowerCase();

        const studentId =
          loggedInStudent.studentId
            ?.trim();

        // ================= FETCH EVENTS =================

        const eventResponse = await fetch(
          "/api/event-registrations"
        );

        const eventData =
          await eventResponse.json();

        if (eventResponse.ok) {
          const studentEvents =
            eventData.filter(
              (registration) =>
                registration.email
                  ?.toLowerCase() ===
                  studentEmail ||
                registration.studentId ===
                  studentId
            );

          setEventRegistrations(
            studentEvents
          );
        }

        // ================= FETCH CLUBS =================

        const clubResponse = await fetch(
          "/api/clubs"
        );

        const clubData =
          await clubResponse.json();

        if (clubResponse.ok) {
          const studentClubs = [];

          clubData.forEach((club) => {
            if (!club.registrations) {
              return;
            }

            club.registrations.forEach(
              (registration) => {
                if (
                  registration.email
                    ?.toLowerCase() ===
                    studentEmail ||
                  registration.studentId ===
                    studentId
                ) {
                  studentClubs.push({
                    ...registration,
                    clubId:
                      club.clubId,
                    clubName:
                      club.name,
                  });
                }
              }
            );
          });

          setJoinedClubs(
            studentClubs
          );
        }

        // ================= FETCH VOLUNTEERS =================

        const volunteerResponse =
          await fetch(
            "/api/volunteers"
          );

        const volunteerData =
          await volunteerResponse.json();

        if (volunteerResponse.ok) {
          const studentVolunteers =
            volunteerData.filter(
              (application) =>
                application.email
                  ?.toLowerCase() ===
                  studentEmail ||
                application.studentId ===
                  studentId
            );

          setVolunteerApplications(
            studentVolunteers
          );
        }

      } catch (error) {
        console.error(
          "Dashboard data error:",
          error
        );
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  // ================= STUDENT NAME =================

  const studentName =
    student?.name || "Student";

  // ================= CERTIFICATES =================

  // Certificates will be connected
  // when the certificate completion
  // logic is implemented.
  const certificateCount = 0;

  // ================= UI =================

  return (
    <div className="dashboard-page">

      {/* ================= WELCOME SECTION ================= */}

      <section className="welcome-section">

        <div className="welcome-left">

          <h1>
            Welcome to EVENTORA, {studentName} 👋
          </h1>

          <p>
            Manage events, explore clubs, volunteer,
            earn certificates and stay connected with
            campus activities.
          </p>

        </div>

        <div className="profile-card">

          <FaUserCircle className="profile-icon" />

          <h2>
            {studentName}
          </h2>

          <p>
            EVENTORA Member
          </p>

        </div>

      </section>

      {/* ================= STATISTICS ================= */}

      <section className="dashboard-stats">

        {/* EVENTS */}

        <div className="stat-card">

          <FaCalendarAlt className="dashboard-icon" />

          <h2>
            {loading
              ? "..."
              : eventRegistrations.length}
          </h2>

          <p>
            Events Registered
          </p>

        </div>

        {/* CLUBS */}

        <div className="stat-card">

          <FaUsers className="dashboard-icon" />

          <h2>
            {loading
              ? "..."
              : joinedClubs.length}
          </h2>

          <p>
            Clubs Joined
          </p>

        </div>

        {/* CERTIFICATES */}

        <div className="stat-card">

          <FaCertificate className="dashboard-icon" />

          <h2>
            {certificateCount}
          </h2>

          <p>
            Certificates
          </p>

        </div>

        {/* VOLUNTEER */}

        <div className="stat-card">

          <FaHandsHelping className="dashboard-icon" />

          <h2>
            {loading
              ? "..."
              : volunteerApplications.length}
          </h2>

          <p>
            Volunteer Activities
          </p>

        </div>

      </section>

      {/* ================= DASHBOARD CONTENT ================= */}

      <section className="dashboard-content">

        {/* ================= UPCOMING EVENTS ================= */}

        <div className="dashboard-box">

          <h2>
            Upcoming Events
          </h2>

          <ul>

            <li>
              Hackathon 2026
              <span>
                15 Sept
              </span>
            </li>

            <li>
              AI Workshop
              <span>
                25 Sept
              </span>
            </li>

            <li>
              Cultural Fest
              <span>
                05 Oct
              </span>
            </li>

            <li>
              Sports Meet
              <span>
                18 Oct
              </span>
            </li>

          </ul>

        </div>

        {/* ================= QUICK ACTIONS ================= */}

        <div className="dashboard-box">

          <h2>
            Quick Actions
          </h2>

          <div className="quick-buttons">

            <Link to="/events">
              <button>
                Browse Events
                <FaArrowRight />
              </button>
            </Link>

            <Link to="/clubs">
              <button>
                Join Clubs
                <FaArrowRight />
              </button>
            </Link>

            <Link to="/volunteer">
              <button>
                Volunteer
                <FaArrowRight />
              </button>
            </Link>

            <Link to="/certificates">
              <button>
                Certificates
                <FaArrowRight />
              </button>
            </Link>

          </div>

        </div>

      </section>

    </div>
  );
}

export default Dashboard;