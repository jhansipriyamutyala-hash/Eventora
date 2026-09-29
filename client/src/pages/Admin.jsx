import { useEffect, useState } from "react";
import "./../styles/Admin.css";

import {
  FaCalendarAlt,
  FaHandsHelping,
  FaCheckCircle,
  FaClock,
} from "react-icons/fa";

function Admin() {
  // ================= STATE =================

  const [activities, setActivities] = useState([]);

  const [loading, setLoading] = useState(true);

  const [message, setMessage] = useState("");

  const [messageType, setMessageType] = useState("");

  const [updatingId, setUpdatingId] = useState(null);

  // ================= LOAD ACTIVITIES =================

  useEffect(() => {
    loadActivities();
  }, []);

  const loadActivities = async () => {
    try {
      setLoading(true);

      // ================= FETCH EVENTS =================

      const eventResponse = await fetch(
        "/api/event-registrations"
      );

      const eventData =
        await eventResponse.json();

      // ================= FETCH VOLUNTEERS =================

      const volunteerResponse =
        await fetch("/api/volunteers");

      const volunteerData =
        await volunteerResponse.json();

      // ================= FETCH CERTIFICATES =================

      const certificateResponse =
        await fetch("/api/certificates");

      const certificateData =
        await certificateResponse.json();

      // ================= EVENT ACTIVITIES =================

      const eventActivities =
        eventResponse.ok
          ? eventData.map((registration) => {

              // Check whether this event already
              // has a certificate in MongoDB.

              const completed =
                certificateResponse.ok &&
                certificateData.some(
                  (certificate) =>
                    Number(
                      certificate.activityId
                    ) ===
                      Number(
                        registration.eventId
                      ) &&
                    certificate.activityType ===
                      "Event" &&
                    (
                      certificate.email ===
                        registration.email ||
                      certificate.studentId ===
                        registration.studentId
                    )
                );

              return {
                id:
                  registration._id,

                activityId:
                  registration.eventId,

                activityName:
                  registration.eventName,

                activityType:
                  "Event",

                name:
                  registration.name,

                email:
                  registration.email,

                studentId:
                  registration.studentId,

                department:
                  registration.department,

                year:
                  registration.year,

                status:
                  completed
                    ? "Completed"
                    : "Pending",
              };
            })
          : [];

      // ================= VOLUNTEER ACTIVITIES =================

      const volunteerActivities =
        volunteerResponse.ok
          ? volunteerData.map(
              (volunteer) => {

                // Also check certificates for
                // volunteer activities.

                const completed =
                  certificateResponse.ok &&
                  certificateData.some(
                    (certificate) =>
                      Number(
                        certificate.activityId
                      ) ===
                        Number(
                          volunteer.eventId
                        ) &&
                      certificate.activityType ===
                        "Volunteer" &&
                      (
                        certificate.email ===
                          volunteer.email ||
                        certificate.studentId ===
                          volunteer.studentId
                      )
                  );

                return {
                  id:
                    volunteer._id,

                  activityId:
                    volunteer.eventId,

                  activityName:
                    volunteer.eventName,

                  activityType:
                    "Volunteer",

                  name:
                    volunteer.name,

                  email:
                    volunteer.email,

                  studentId:
                    volunteer.studentId,

                  department:
                    volunteer.department,

                  year:
                    volunteer.year,

                  status:
                    completed ||
                    volunteer.status ===
                      "Completed"
                      ? "Completed"
                      : "Pending",
                };
              }
            )
          : [];

      // ================= COMBINE =================

      setActivities([
        ...eventActivities,
        ...volunteerActivities,
      ]);

    } catch (error) {
      console.error(
        "Admin activities error:",
        error
      );

      setMessage(
        "Cannot load student activities."
      );

      setMessageType("error");

    } finally {
      setLoading(false);
    }
  };

  // ================= MARK COMPLETED =================

  const handleMarkCompleted = async (
    activity
  ) => {
    try {
      setUpdatingId(activity.id);

      setMessage("");
      setMessageType("");

      const response = await fetch(
        "/api/certificates/complete",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            activityId:
              activity.activityId,

            activityName:
              activity.activityName,

            activityType:
              activity.activityType,

            name:
              activity.name,

            email:
              activity.email,

            studentId:
              activity.studentId,

            department:
              activity.department,

            year:
              activity.year,
          }),
        }
      );

      const data =
        await response.json();

      if (!response.ok) {
        setMessage(
          data.error ||
            "Could not mark activity as completed."
        );

        setMessageType("error");

        setUpdatingId(null);

        return;
      }

      // ================= UPDATE UI =================

      setActivities(
        (previousActivities) =>
          previousActivities.map(
            (item) =>
              item.id === activity.id
                ? {
                    ...item,
                    status:
                      "Completed",
                  }
                : item
          )
      );

      setMessage(
        `${activity.name}'s ${activity.activityName} has been marked as completed.`
      );

      setMessageType("success");

    } catch (error) {
      console.error(
        "Completion error:",
        error
      );

      setMessage(
        "Cannot connect to the server."
      );

      setMessageType("error");

    } finally {
      setUpdatingId(null);
    }
  };

  // ================= UI =================

  return (
    <div className="admin-page">

      {/* ================= HEADER ================= */}

      <div className="admin-header">

        <h1>
          EVENTORA Admin
        </h1>

        <p>
          Manage student activities and
          certificate completion.
        </p>

      </div>

      {/* ================= MESSAGE ================= */}

      {message && (
        <div
          className={`admin-message ${messageType}`}
        >
          {message}
        </div>
      )}

      {/* ================= STATISTICS ================= */}

      <div className="admin-stats">

        <div className="admin-stat-card">

          <FaCalendarAlt />

          <div>

            <h2>
              {
                activities.filter(
                  (item) =>
                    item.activityType ===
                    "Event"
                ).length
              }
            </h2>

            <p>
              Event Registrations
            </p>

          </div>

        </div>

        <div className="admin-stat-card">

          <FaHandsHelping />

          <div>

            <h2>
              {
                activities.filter(
                  (item) =>
                    item.activityType ===
                    "Volunteer"
                ).length
              }
            </h2>

            <p>
              Volunteer Applications
            </p>

          </div>

        </div>

        <div className="admin-stat-card">

          <FaCheckCircle />

          <div>

            <h2>
              {
                activities.filter(
                  (item) =>
                    item.status ===
                    "Completed"
                ).length
              }
            </h2>

            <p>
              Completed Activities
            </p>

          </div>

        </div>

        <div className="admin-stat-card">

          <FaClock />

          <div>

            <h2>
              {
                activities.filter(
                  (item) =>
                    item.status !==
                    "Completed"
                ).length
              }
            </h2>

            <p>
              Pending Activities
            </p>

          </div>

        </div>

      </div>

      {/* ================= ACTIVITIES ================= */}

      <div className="admin-section">

        <h2>
          Student Activities
        </h2>

        {loading ? (

          <div className="admin-loading">
            Loading activities...
          </div>

        ) : activities.length === 0 ? (

          <div className="admin-empty">
            No student activities found.
          </div>

        ) : (

          <div className="admin-table-wrapper">

            <table className="admin-table">

              <thead>

                <tr>

                  <th>
                    Student
                  </th>

                  <th>
                    Student ID
                  </th>

                  <th>
                    Activity
                  </th>

                  <th>
                    Type
                  </th>

                  <th>
                    Department
                  </th>

                  <th>
                    Status
                  </th>

                  <th>
                    Action
                  </th>

                </tr>

              </thead>

              <tbody>

                {activities.map(
                  (activity) => (

                    <tr
                      key={
                        `${activity.activityType}-${activity.id}`
                      }
                    >

                      <td>

                        <strong>
                          {activity.name}
                        </strong>

                        <small>
                          {activity.email}
                        </small>

                      </td>

                      <td>
                        {activity.studentId}
                      </td>

                      <td>
                        {activity.activityName}
                      </td>

                      <td>

                        <span
                          className={`activity-type ${activity.activityType.toLowerCase()}`}
                        >
                          {activity.activityType}
                        </span>

                      </td>

                      <td>
                        {activity.department}
                      </td>

                      <td>

                        {activity.status ===
                        "Completed" ? (

                          <span className="completed-badge">

                            <FaCheckCircle />

                            Completed

                          </span>

                        ) : (

                          <span className="pending-badge">

                            <FaClock />

                            Pending

                          </span>

                        )}

                      </td>

                      <td>

                        {activity.status ===
                        "Completed" ? (

                          <button
                            className="completed-button"
                            disabled
                          >

                            <FaCheckCircle />

                            Completed

                          </button>

                        ) : (

                          <button
                            className="mark-completed-button"
                            onClick={() =>
                              handleMarkCompleted(
                                activity
                              )
                            }
                            disabled={
                              updatingId ===
                              activity.id
                            }
                          >

                            {updatingId ===
                            activity.id
                              ? "Updating..."
                              : "Mark Completed"}

                          </button>

                        )}

                      </td>

                    </tr>

                  )
                )}

              </tbody>

            </table>

          </div>

        )}

      </div>

    </div>
  );
}

export default Admin;