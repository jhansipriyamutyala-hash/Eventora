import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Events.css";

import {
  FaCalendarAlt,
  FaMapMarkerAlt,
} from "react-icons/fa";

function Events() {
  const navigate = useNavigate();

  // ================= EVENTS =================

  const events = [
    {
      id: 1,
      title: "Hackathon 2026",
      date: "15 September 2026",
      location: "Main Auditorium",
      image:
        "https://images.unsplash.com/photo-1511578314322-379afb476865?w=800",
      description:
        "Show your coding skills, build innovative solutions and win exciting prizes.",
    },

    {
      id: 2,
      title: "AI Workshop",
      date: "25 September 2026",
      location: "Seminar Hall",
      image:
        "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800",
      description:
        "Learn Artificial Intelligence from industry experts through practical sessions.",
    },

    {
      id: 3,
      title: "Cultural Fest",
      date: "05 October 2026",
      location: "Open Grounds",
      image:
        "https://images.unsplash.com/photo-1505236858219-8359eb29e329?w=800",
      description:
        "Enjoy music, dance, food stalls and exciting performances with friends.",
    },

    {
      id: 4,
      title: "Photography Contest",
      date: "20 October 2026",
      location: "Campus Park",
      image:
        "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=800",
      description:
        "Capture unforgettable moments and compete with the best photographers.",
    },
  ];

  // ================= STATE =================

  const [selectedEvent, setSelectedEvent] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    studentId: "",
    mobile: "",
    department: "",
    year: "",
  });

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // ================= REGISTER BUTTON =================

  const handleRegisterClick = (event) => {
    const loggedInStudent = JSON.parse(
      localStorage.getItem("eventoraLoggedInStudent")
    );

    // Student must register/login first
    if (!loggedInStudent) {
      setMessage(
        "⚠️ Please register and login first to participate in this event."
      );

      setMessageType("error");

      setTimeout(() => {
        navigate("/register");
      }, 1200);

      return;
    }

    // Auto-fill logged-in student details
    setFormData({
      name: loggedInStudent.name || "",
      email: loggedInStudent.email || "",
      studentId: loggedInStudent.studentId || "",
      mobile: loggedInStudent.mobile || "",
      department: loggedInStudent.department || "",
      year: loggedInStudent.year || "",
    });

    setSelectedEvent(event);

    setMessage("");
    setMessageType("");
  };

  // ================= CLOSE MODAL =================

  const closeModal = () => {
    if (submitting) {
      return;
    }

    setSelectedEvent(null);

    setMessage("");
    setMessageType("");

    setFormData({
      name: "",
      email: "",
      studentId: "",
      mobile: "",
      department: "",
      year: "",
    });
  };

  // ================= INPUT CHANGE =================

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // ================= SUBMIT =================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");
    setMessageType("");

    const {
      name,
      email,
      studentId,
      mobile,
      department,
      year,
    } = formData;

    // ================= VALIDATION =================

    if (
      !name.trim() ||
      !email.trim() ||
      !studentId.trim() ||
      !mobile.trim() ||
      !department.trim() ||
      !year
    ) {
      setMessage("⚠️ Please fill in all the fields.");
      setMessageType("error");
      return;
    }

    // Mobile validation
    if (!/^\d{10}$/.test(mobile.trim())) {
      setMessage(
        "⚠️ Please enter a valid 10-digit mobile number."
      );

      setMessageType("error");

      return;
    }

    // Check selected event
    if (!selectedEvent) {
      return;
    }

    // ================= SEND TO BACKEND =================

    setSubmitting(true);

    try {
      const response = await fetch(
        "/api/event-registrations/register",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            eventId: selectedEvent.id,

            eventName: selectedEvent.title,

            name: name.trim(),

            email: email.trim().toLowerCase(),

            studentId: studentId.trim(),

            mobile: mobile.trim(),

            department: department.trim(),

            year: year,
          }),
        }
      );

      const data = await response.json();

      // ================= ERROR =================

      if (!response.ok) {
        setMessage(
          `⚠️ ${data.error || data.message || "Registration failed."}`
        );

        setMessageType("error");

        setSubmitting(false);

        return;
      }

      // ================= SUCCESS =================

      setMessage(
        `✅ Successfully registered for ${selectedEvent.title}!`
      );

      setMessageType("success");

      // ================= UPDATE STUDENT =================

      const loggedInStudent =
        JSON.parse(
          localStorage.getItem(
            "eventoraLoggedInStudent"
          )
        ) || {};

      const updatedStudent = {
        ...loggedInStudent,

        name: name.trim(),

        email: email.trim().toLowerCase(),

        studentId: studentId.trim(),

        mobile: mobile.trim(),

        department: department.trim(),

        year: year,
      };

      localStorage.setItem(
        "eventoraLoggedInStudent",
        JSON.stringify(updatedStudent)
      );

      localStorage.setItem(
        "eventoraStudentProfile",
        JSON.stringify(updatedStudent)
      );

      setSubmitting(false);

      // ================= CLOSE AFTER SUCCESS =================

      setTimeout(() => {
        setSelectedEvent(null);

        setMessage("");
        setMessageType("");

        setFormData({
          name: "",
          email: "",
          studentId: "",
          mobile: "",
          department: "",
          year: "",
        });
      }, 1800);
    } catch (error) {
      console.error(
        "Event registration error:",
        error
      );

      setMessage(
        "⚠️ Cannot connect to the server. Please make sure the backend is running."
      );

      setMessageType("error");

      setSubmitting(false);
    }
  };

  // ================= UI =================

  return (
    <div className="events-page">

      {/* ================= HEADER ================= */}

      <div className="events-header">

        <h1>Upcoming Events</h1>

        <p>
          Explore exciting campus events and register
          to participate.
        </p>

      </div>

      {/* ================= LOGIN MESSAGE ================= */}

      {message && !selectedEvent && (
        <div
          className={`event-message ${messageType}`}
        >
          {message}
        </div>
      )}

      {/* ================= EVENTS ================= */}

      <div className="events-container">

        {events.map((event) => (

          <div
            className="event-card"
            key={event.id}
          >

            {/* EVENT IMAGE */}

            <img
              src={event.image}
              alt={event.title}
            />

            {/* EVENT CONTENT */}

            <div className="event-content">

              <h2>
                {event.title}
              </h2>

              <p className="date">
                <FaCalendarAlt />
                {event.date}
              </p>

              <p className="location">
                <FaMapMarkerAlt />
                {event.location}
              </p>

              <p className="description">
                {event.description}
              </p>

              <button
                onClick={() =>
                  handleRegisterClick(event)
                }
              >
                Register Now
              </button>

            </div>

          </div>

        ))}

      </div>

      {/* ================= REGISTRATION MODAL ================= */}

      {selectedEvent && (

        <div
          className="event-modal"
          onClick={closeModal}
        >

          <div
            className="event-modal-content"
            onClick={(e) =>
              e.stopPropagation()
            }
          >

            {/* CLOSE BUTTON */}

            <button
              className="event-modal-close"
              onClick={closeModal}
              disabled={submitting}
            >
              ×
            </button>

            <h2>
              Register for Event
            </h2>

            <p className="event-modal-subtitle">
              {selectedEvent.title}
            </p>

            {/* FORM MESSAGE */}

            {message && (
              <div
                className={`event-message ${messageType}`}
              >
                {message}
              </div>
            )}

            {/* FORM */}

            <form onSubmit={handleSubmit}>

              {/* FULL NAME */}

              <label>
                Full Name
              </label>

              <input
                type="text"
                name="name"
                placeholder="Enter your full name"
                value={formData.name}
                onChange={handleChange}
                disabled={submitting}
              />

              {/* EMAIL */}

              <label>
                Email Address
              </label>

              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                disabled={submitting}
              />

              {/* STUDENT ID */}

              <label>
                Student ID
              </label>

              <input
                type="text"
                name="studentId"
                placeholder="Enter your student ID"
                value={formData.studentId}
                onChange={handleChange}
                disabled={submitting}
              />

              {/* MOBILE */}

              <label>
                Mobile Number
              </label>

              <input
                type="tel"
                name="mobile"
                placeholder="Enter 10-digit mobile number"
                value={formData.mobile}
                onChange={handleChange}
                maxLength="10"
                disabled={submitting}
              />

              {/* DEPARTMENT */}

              <label>
                Department
              </label>

              <input
                type="text"
                name="department"
                placeholder="Example: Information Technology"
                value={formData.department}
                onChange={handleChange}
                disabled={submitting}
              />

              {/* YEAR */}

              <label>
                Year
              </label>

              <select
                name="year"
                value={formData.year}
                onChange={handleChange}
                disabled={submitting}
              >

                <option value="">
                  Select Year
                </option>

                <option value="1st Year">
                  1st Year
                </option>

                <option value="2nd Year">
                  2nd Year
                </option>

                <option value="3rd Year">
                  3rd Year
                </option>

                <option value="4th Year">
                  4th Year
                </option>

              </select>

              {/* SUBMIT */}

              <button
                type="submit"
                className="event-register-btn"
                disabled={submitting}
              >
                {submitting
                  ? "Registering..."
                  : "Register for Event"}
              </button>

            </form>

          </div>

        </div>

      )}

    </div>
  );
}

export default Events;