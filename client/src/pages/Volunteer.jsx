import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Volunteer.css";

import {
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaUsers,
  FaClock,
} from "react-icons/fa";

function Volunteer() {
  const navigate = useNavigate();

  // ================= VOLUNTEER EVENTS =================

  const volunteerEvents = [
    {
      id: 1,
      title: "Campus Clean-Up Drive",
      date: "18 September 2026",
      location: "Vignan Campus",
      time: "4 Hours",
      slots: "30 Volunteers",
    },

    {
      id: 2,
      title: "Blood Donation Camp",
      date: "02 October 2026",
      location: "Health Center",
      time: "6 Hours",
      slots: "20 Volunteers",
    },

    {
      id: 3,
      title: "Tree Plantation",
      date: "15 October 2026",
      location: "College Garden",
      time: "3 Hours",
      slots: "40 Volunteers",
    },

    {
      id: 4,
      title: "Technical Fest Support",
      date: "28 October 2026",
      location: "Main Auditorium",
      time: "2 Days",
      slots: "50 Volunteers",
    },

    {
      id: 5,
      title: "Sports Meet Volunteers",
      date: "08 November 2026",
      location: "Sports Ground",
      time: "1 Day",
      slots: "35 Volunteers",
    },

    {
      id: 6,
      title: "Freshers Day Management",
      date: "20 November 2026",
      location: "Open Auditorium",
      time: "5 Hours",
      slots: "25 Volunteers",
    },
  ];

  // ================= STATE =================

  const [selectedVolunteer, setSelectedVolunteer] =
    useState(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    studentId: "",
    mobile: "",
    department: "",
    year: "",
  });

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] =
    useState("");

  const [submitting, setSubmitting] =
    useState(false);

  // ================= APPLY CLICK =================

  const handleApply = (item) => {
    const loggedInStudent =
      JSON.parse(
        localStorage.getItem(
          "eventoraLoggedInStudent"
        )
      );

    // Login required
    if (!loggedInStudent) {
      setMessage(
        "⚠️ Please register and login first to apply as a volunteer."
      );

      setMessageType("error");

      setTimeout(() => {
        navigate("/register");
      }, 1200);

      return;
    }

    // Auto-fill student details
    setFormData({
      name: loggedInStudent.name || "",
      email: loggedInStudent.email || "",
      studentId: loggedInStudent.studentId || "",
      mobile: loggedInStudent.mobile || "",
      department:
        loggedInStudent.department || "",
      year: loggedInStudent.year || "",
    });

    setSelectedVolunteer(item);

    setMessage("");
    setMessageType("");
  };

  // ================= CLOSE =================

  const closeModal = () => {
    if (submitting) {
      return;
    }

    setSelectedVolunteer(null);

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

  // ================= CHANGE =================

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
      setMessage(
        "⚠️ Please fill in all the fields."
      );

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

    if (!selectedVolunteer) {
      return;
    }

    // ================= SEND TO BACKEND =================

    setSubmitting(true);

    try {
      const response = await fetch(
        "/api/volunteers/apply",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            eventId: selectedVolunteer.id,

            eventName:
              selectedVolunteer.title,

            eventDate:
              selectedVolunteer.date,

            location:
              selectedVolunteer.location,

            time:
              selectedVolunteer.time,

            name: name.trim(),

            email:
              email.trim().toLowerCase(),

            studentId:
              studentId.trim(),

            mobile:
              mobile.trim(),

            department:
              department.trim(),

            year: year,
          }),
        }
      );

      const data = await response.json();

      // ================= ERROR =================

      if (!response.ok) {
        setMessage(
          `⚠️ ${
            data.error ||
            data.message ||
            "Application failed."
          }`
        );

        setMessageType("error");

        setSubmitting(false);

        return;
      }

      // ================= SUCCESS =================

      setMessage(
        `✅ Successfully applied for ${selectedVolunteer.title}!`
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

        email:
          email.trim().toLowerCase(),

        studentId:
          studentId.trim(),

        mobile:
          mobile.trim(),

        department:
          department.trim(),

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
        setSelectedVolunteer(null);

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
        "Volunteer application error:",
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
    <div className="volunteer-page">

      {/* ================= HEADER ================= */}

      <div className="volunteer-header">

        <h1>
          Volunteer Opportunities
        </h1>

        <p>
          Participate, help organize events and gain
          valuable experience.
        </p>

      </div>

      {/* ================= MESSAGE ================= */}

      {message && !selectedVolunteer && (
        <div
          className={`volunteer-message ${messageType}`}
        >
          {message}
        </div>
      )}

      {/* ================= VOLUNTEER CARDS ================= */}

      <div className="volunteer-container">

        {volunteerEvents.map(
          (item) => (

            <div
              className="volunteer-card"
              key={item.id}
            >

              <h2>
                {item.title}
              </h2>

              <p>
                <FaCalendarAlt />
                {item.date}
              </p>

              <p>
                <FaMapMarkerAlt />
                {item.location}
              </p>

              <p>
                <FaClock />
                {item.time}
              </p>

              <p>
                <FaUsers />
                {item.slots}
              </p>

              <button
                onClick={() =>
                  handleApply(item)
                }
              >
                Apply Now
              </button>

            </div>

          )
        )}

      </div>

      {/* ================= VOLUNTEER FORM ================= */}

      {selectedVolunteer && (

        <div
          className="volunteer-modal"
          onClick={closeModal}
        >

          <div
            className="volunteer-modal-content"
            onClick={(e) =>
              e.stopPropagation()
            }
          >

            {/* CLOSE */}

            <button
              className="volunteer-modal-close"
              onClick={closeModal}
              disabled={submitting}
            >
              ×
            </button>

            <h2>
              Volunteer Registration
            </h2>

            <p className="volunteer-modal-subtitle">
              {selectedVolunteer.title}
            </p>

            {/* MESSAGE */}

            {message && (
              <div
                className={`volunteer-form-message ${messageType}`}
              >
                {message}
              </div>
            )}

            {/* FORM */}

            <form onSubmit={handleSubmit}>

              {/* NAME */}

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
                className="volunteer-register-btn"
                disabled={submitting}
              >
                {submitting
                  ? "Applying..."
                  : "Apply as Volunteer"}
              </button>

            </form>

          </div>

        </div>

      )}

    </div>
  );
}

export default Volunteer;