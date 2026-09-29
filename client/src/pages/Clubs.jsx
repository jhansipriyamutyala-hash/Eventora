import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Clubs.css";

function Clubs() {
  const navigate = useNavigate();

  // ================= STATE =================

  const [clubs, setClubs] = useState([]);
  const [selectedClub, setSelectedClub] = useState(null);

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

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // ================= GET CLUBS FROM BACKEND =================

  useEffect(() => {
    fetch("/api/clubs")
      .then(async (response) => {
        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.error || "Failed to load clubs."
          );
        }

        return data;
      })
      .then((data) => {
        setClubs(data);
        setLoading(false);
      })
      .catch((error) => {
        console.log("Get clubs error:", error);

        setMessage(
          "⚠️ Unable to load clubs. Please try again."
        );

        setMessageType("error");
        setLoading(false);
      });
  }, []);

  // ================= CHECK ALREADY JOINED =================

  const hasJoinedClub = (club) => {
    const loggedInStudent = JSON.parse(
      localStorage.getItem(
        "eventoraLoggedInStudent"
      )
    );

    if (!loggedInStudent) {
      return false;
    }

    if (
      !club.registrations ||
      club.registrations.length === 0
    ) {
      return false;
    }

    return club.registrations.some(
      (registration) =>
        registration.email ===
          loggedInStudent.email?.toLowerCase() ||
        registration.studentId ===
          loggedInStudent.studentId
    );
  };

  // ================= JOIN CLICK =================

  const handleJoinClick = (club) => {
    const loggedInStudent = JSON.parse(
      localStorage.getItem(
        "eventoraLoggedInStudent"
      )
    );

    // Login required
    if (!loggedInStudent) {
      setMessage(
        "⚠️ Please register and login first to join a club."
      );

      setMessageType("error");

      setTimeout(() => {
        navigate("/register");
      }, 1200);

      return;
    }

    // Already joined
    if (hasJoinedClub(club)) {
      setMessage(
        `⚠️ You are already a member of ${club.name}.`
      );

      setMessageType("error");

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

    setSelectedClub(club);

    setMessage("");
    setMessageType("");
  };

  // ================= CLOSE MODAL =================

  const closeModal = () => {
    setSelectedClub(null);

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

    if (!selectedClub) {
      return;
    }

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

    if (!/^\d{10}$/.test(mobile.trim())) {
      setMessage(
        "⚠️ Please enter a valid 10-digit mobile number."
      );

      setMessageType("error");

      return;
    }

    // ================= SEND TO BACKEND =================

    setSubmitting(true);

    try {
      const response = await fetch(
        `/api/clubs/${selectedClub.clubId}/join`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
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

      if (!response.ok) {
        setMessage(
          `⚠️ ${data.error || "Registration failed."}`
        );

        setMessageType("error");

        setSubmitting(false);

        return;
      }

      // ================= UPDATE CLUB DATA =================

      setClubs((currentClubs) =>
        currentClubs.map((club) =>
          club.clubId === selectedClub.clubId
            ? data.club
            : club
        )
      );

      // ================= UPDATE STUDENT =================

      const loggedInStudent = JSON.parse(
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

      // ================= SUCCESS =================

      setMessage(
        `✅ Successfully joined ${selectedClub.name}!`
      );

      setMessageType("success");

      setSubmitting(false);

      setTimeout(() => {
        closeModal();
      }, 1800);
    } catch (error) {
      console.log(
        "Club registration error:",
        error
      );

      setMessage(
        "⚠️ Unable to connect to the server. Please try again."
      );

      setMessageType("error");

      setSubmitting(false);
    }
  };

  // ================= LOADING =================

  if (loading) {
    return (
      <div className="clubs-page">
        <div className="clubs-header">
          <h1>Explore Clubs</h1>

          <p>
            Discover clubs, meet new people and
            participate in activities you enjoy.
          </p>
        </div>

        <div className="club-message">
          Loading clubs...
        </div>
      </div>
    );
  }

  // ================= UI =================

  return (
    <div className="clubs-page">

      {/* ================= HEADER ================= */}

      <div className="clubs-header">

        <h1>Explore Clubs</h1>

        <p>
          Discover clubs, meet new people and
          participate in activities you enjoy.
        </p>

      </div>

      {/* ================= MESSAGE ================= */}

      {message && !selectedClub && (
        <div
          className={`club-message ${messageType}`}
        >
          {message}
        </div>
      )}

      {/* ================= CLUB GRID ================= */}

      <div className="clubs-grid">

        {clubs.map((club) => {

          const alreadyJoined =
            hasJoinedClub(club);

          return (
            <div
              className="club-card"
              key={club.clubId}
            >

              {/* ================= IMAGE ================= */}

              <div className="club-image">

                <img
                  src={club.image}
                  alt={club.name}
                />

                <span className="club-category">
                  {club.category}
                </span>

              </div>

              {/* ================= CONTENT ================= */}

              <div className="club-content">

                <h2>
                  {club.name}
                </h2>

                <p>
                  {club.description}
                </p>

                <div className="club-info">

                  <span>
                    {club.members} Members
                  </span>

                </div>

                <button
                  className={
                    alreadyJoined
                      ? "joined-btn"
                      : "join-btn"
                  }
                  onClick={() =>
                    handleJoinClick(club)
                  }
                  disabled={alreadyJoined}
                >
                  {alreadyJoined
                    ? "Already Joined"
                    : "Join Club"}
                </button>

              </div>

            </div>
          );
        })}

      </div>

      {/* ================= MODAL ================= */}

      {selectedClub && (

        <div className="club-modal">

          <div className="club-modal-content">

            {/* ================= CLOSE ================= */}

            <button
              className="club-modal-close"
              onClick={closeModal}
              disabled={submitting}
            >
              ×
            </button>

            <h2>
              Join Club
            </h2>

            <p className="club-modal-subtitle">
              {selectedClub.name}
            </p>

            {/* ================= FORM MESSAGE ================= */}

            {message && (
              <div
                className={`club-form-message ${messageType}`}
              >
                {message}
              </div>
            )}

            {/* ================= FORM ================= */}

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
                className="club-register-btn"
                disabled={submitting}
              >
                {submitting
                  ? "Joining..."
                  : "Join Club"}
              </button>

            </form>

          </div>

        </div>

      )}

    </div>
  );
}

export default Clubs;