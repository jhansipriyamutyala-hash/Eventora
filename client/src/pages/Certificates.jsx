import { useEffect, useState } from "react";
import jsPDF from "jspdf";

import "./../styles/Certificates.css";

import {
  FaCertificate,
  FaDownload,
  FaCheckCircle,
  FaLock,
} from "react-icons/fa";

function Certificates() {
  // ================= STATE =================

  const [activities, setActivities] = useState([]);
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);

  const [downloadedCertificates, setDownloadedCertificates] =
    useState({});

  // ================= STUDENT =================

  const savedStudent = localStorage.getItem(
    "eventoraLoggedInStudent"
  );

  const student = savedStudent
    ? JSON.parse(savedStudent)
    : null;

  // ================= LOAD DOWNLOADED STATUS =================

  useEffect(() => {
    if (!student) {
      return;
    }

    const savedDownloads =
      localStorage.getItem(
        "eventoraDownloadedCertificates"
      );

    if (savedDownloads) {
      try {
        const parsedDownloads =
          JSON.parse(savedDownloads);

        setDownloadedCertificates(
          parsedDownloads
        );
      } catch (error) {
        console.error(
          "Downloaded certificate data error:",
          error
        );
      }
    }
  }, []);

  // ================= LOAD DATA =================

  useEffect(() => {
    loadCertificateData();
  }, []);

  const loadCertificateData = async () => {
    try {
      setLoading(true);

      // ================= EVENT REGISTRATIONS =================

      const eventResponse = await fetch(
        "/api/event-registrations"
      );

      const eventData =
        await eventResponse.json();

      const eventActivities =
        eventResponse.ok
          ? eventData
              .filter(
                (registration) =>
                  student &&
                  (
                    registration.email ===
                      student.email ||
                    registration.studentId ===
                      student.studentId
                  )
              )
              .map((registration) => ({
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

                registeredAt:
                  registration.createdAt,
              }))
          : [];

      // ================= VOLUNTEER APPLICATIONS =================

      const volunteerResponse =
        await fetch(
          "/api/volunteers"
        );

      const volunteerData =
        await volunteerResponse.json();

      const volunteerActivities =
        volunteerResponse.ok
          ? volunteerData
              .filter(
                (volunteer) =>
                  student &&
                  (
                    volunteer.email ===
                      student.email ||
                    volunteer.studentId ===
                      student.studentId
                  )
              )
              .map((volunteer) => ({
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

                registeredAt:
                  volunteer.appliedAt,
              }))
          : [];

      // ================= CERTIFICATES =================

      const certificateResponse =
        await fetch(
          "/api/certificates"
        );

      const certificateData =
        await certificateResponse.json();

      const studentCertificates =
        certificateResponse.ok
          ? certificateData.filter(
              (certificate) =>
                student &&
                (
                  certificate.email ===
                    student.email ||
                  certificate.studentId ===
                    student.studentId
                )
            )
          : [];

      setActivities([
        ...eventActivities,
        ...volunteerActivities,
      ]);

      setCertificates(
        studentCertificates
      );

    } catch (error) {
      console.error(
        "Certificate data error:",
        error
      );
    } finally {
      setLoading(false);
    }
  };

  // ================= FIND CERTIFICATE =================

  const getCertificate = (activity) => {
    return certificates.find(
      (certificate) =>
        Number(
          certificate.activityId
        ) ===
          Number(
            activity.activityId
          ) &&
        certificate.activityType ===
          activity.activityType &&
        (
          certificate.email ===
            activity.email ||
          certificate.studentId ===
            activity.studentId
        )
    );
  };

  // ================= DOWNLOAD KEY =================

  const getDownloadKey = (activity) => {
    return `${activity.activityType}-${activity.activityId}-${activity.studentId}`;
  };

  // ================= MARK DOWNLOADED =================

  const markCertificateDownloaded = (
    activity
  ) => {
    const downloadKey =
      getDownloadKey(activity);

    const updatedDownloads = {
      ...downloadedCertificates,
      [downloadKey]: true,
    };

    setDownloadedCertificates(
      updatedDownloads
    );

    localStorage.setItem(
      "eventoraDownloadedCertificates",
      JSON.stringify(
        updatedDownloads
      )
    );
  };

  // ================= PDF HELPERS =================

  const drawLeaf = (
    doc,
    x,
    y,
    size,
    angle
  ) => {
    const radians =
      (angle * Math.PI) / 180;

    const endX =
      x +
      Math.cos(radians) *
        size;

    const endY =
      y +
      Math.sin(radians) *
        size;

    doc.setDrawColor(
      203,
      213,
      225
    );

    doc.setFillColor(
      226,
      232,
      240
    );

    doc.ellipse(
      (x + endX) / 2,
      (y + endY) / 2,
      size / 2.7,
      size / 5.5,
      "FD"
    );
  };

  const drawLaurel = (
    doc,
    startX,
    startY,
    direction
  ) => {
    doc.setDrawColor(
      203,
      213,
      225
    );

    doc.setLineWidth(1);

    let previousX =
      startX;

    let previousY =
      startY;

    for (
      let i = 0;
      i < 7;
      i++
    ) {
      const x =
        startX +
        direction *
          (i * 4);

      const y =
        startY -
        i * 7;

      doc.line(
        previousX,
        previousY,
        x,
        y
      );

      drawLeaf(
        doc,
        x,
        y,
        9,
        direction === -1
          ? 150
          : 30
      );

      drawLeaf(
        doc,
        x,
        y,
        9,
        direction === -1
          ? 210
          : -30
      );

      previousX = x;
      previousY = y;
    }
  };

  // ================= DOWNLOAD PDF =================

  const downloadCertificate = (
    activity,
    certificate
  ) => {
    if (!certificate) {
      return;
    }

    const doc = new jsPDF({
      orientation:
        "landscape",
      unit: "mm",
      format: "a4",
    });

    const width = 297;
    const height = 210;

    // ================= BACKGROUND =================

    doc.setFillColor(
      253,
      252,
      247
    );

    doc.rect(
      0,
      0,
      width,
      height,
      "F"
    );

    // ================= OUTER NAVY BORDER =================

    doc.setDrawColor(
      23,
      55,
      105
    );

    doc.setLineWidth(
      2.5
    );

    doc.rect(
      8,
      8,
      width - 16,
      height - 16
    );

    // ================= GOLD BORDER =================

    doc.setDrawColor(
      212,
      165,
      70
    );

    doc.setLineWidth(1);

    doc.rect(
      12,
      12,
      width - 24,
      height - 24
    );

    // ================= INNER BORDER =================

    doc.setDrawColor(
      180,
      140,
      60
    );

    doc.setLineWidth(
      0.35
    );

    doc.rect(
      17,
      17,
      width - 34,
      height - 34
    );

    // ================= TOP DECORATION =================

    doc.setFillColor(
      23,
      55,
      105
    );

    doc.setDrawColor(
      23,
      55,
      105
    );

    doc.triangle(
      8,
      8,
      75,
      8,
      8,
      30,
      "F"
    );

    doc.setFillColor(
      212,
      165,
      70
    );

    doc.triangle(
      8,
      8,
      63,
      8,
      8,
      24,
      "F"
    );

    // ================= BOTTOM DECORATION =================

    doc.setFillColor(
      23,
      55,
      105
    );

    doc.triangle(
      width - 8,
      height - 8,
      width - 75,
      height - 8,
      width - 8,
      height - 30,
      "F"
    );

    doc.setFillColor(
      212,
      165,
      70
    );

    doc.triangle(
      width - 8,
      height - 8,
      width - 63,
      height - 8,
      width - 8,
      height - 24,
      "F"
    );

    // ================= EVENTORA =================

    doc.setTextColor(
      23,
      55,
      105
    );

    doc.setFont(
      "helvetica",
      "bold"
    );

    doc.setFontSize(27);

    doc.text(
      "EVENTORA",
      width / 2,
      35,
      {
        align:
          "center",
      }
    );

    // ================= TAGLINE =================

    doc.setTextColor(
      71,
      85,
      105
    );

    doc.setFont(
      "helvetica",
      "normal"
    );

    doc.setFontSize(8);

    doc.text(
      "SMART EVENT & CLUB MANAGEMENT SYSTEM",
      width / 2,
      42,
      {
        align:
          "center",
      }
    );

    // ================= TOP RIGHT TEXT =================

    doc.setTextColor(
      37,
      99,
      235
    );

    doc.setFont(
      "helvetica",
      "italic"
    );

    doc.setFontSize(8);

    doc.text(
      "Events  •  Clubs  •  People",
      246,
      29,
      {
        align:
          "center",
      }
    );

    doc.text(
      "Building a Better Campus",
      246,
      35,
      {
        align:
          "center",
      }
    );

    // ================= TITLE =================

    doc.setTextColor(
      23,
      55,
      105
    );

    doc.setFont(
      "helvetica",
      "bold"
    );

    doc.setFontSize(25);

    doc.text(
      "CERTIFICATE OF COMPLETION",
      width / 2,
      62,
      {
        align:
          "center",
      }
    );

    // ================= TITLE DECORATION =================

    doc.setDrawColor(
      212,
      165,
      70
    );

    doc.setLineWidth(
      0.7
    );

    doc.line(
      65,
      69,
      132,
      69
    );

    doc.line(
      165,
      69,
      232,
      69
    );

    doc.setTextColor(
      212,
      165,
      70
    );

    doc.setFontSize(16);

    doc.text(
      "★",
      width / 2,
      74,
      {
        align:
          "center",
      }
    );

    // ================= PRESENTED TEXT =================

    doc.setTextColor(
      23,
      55,
      105
    );

    doc.setFont(
      "helvetica",
      "normal"
    );

    doc.setFontSize(12);

    doc.text(
      "This is to certify that",
      width / 2,
      86,
      {
        align:
          "center",
      }
    );

    // ================= STUDENT NAME =================

    doc.setTextColor(
      15,
      23,
      42
    );

    doc.setFont(
      "times",
      "italic"
    );

    doc.setFontSize(30);

    doc.text(
      activity.name,
      width / 2,
      103,
      {
        align:
          "center",
      }
    );

    // ================= NAME LINE =================

    doc.setDrawColor(
      212,
      165,
      70
    );

    doc.setLineWidth(
      0.5
    );

    doc.line(
      80,
      108,
      217,
      108
    );

    // ================= COMPLETION TEXT =================

    doc.setTextColor(
      23,
      55,
      105
    );

    doc.setFont(
      "helvetica",
      "normal"
    );

    doc.setFontSize(11);

    doc.text(
      "has successfully completed the",
      width / 2,
      119,
      {
        align:
          "center",
      }
    );

    // ================= ACTIVITY NAME =================

    doc.setFont(
      "helvetica",
      "bold"
    );

    doc.setFontSize(20);

    doc.setTextColor(
      30,
      64,
      175
    );

    doc.text(
      activity.activityName,
      width / 2,
      131,
      {
        align:
          "center",
      }
    );

    // ================= ORGANIZER =================

    doc.setTextColor(
      71,
      85,
      105
    );

    doc.setFont(
      "helvetica",
      "normal"
    );

    doc.setFontSize(10);

    doc.text(
      "organized by EVENTORA",
      width / 2,
      139,
      {
        align:
          "center",
      }
    );

    // ================= LAURELS =================

    drawLaurel(
      doc,
      47,
      143,
      -1
    );

    drawLaurel(
      doc,
      250,
      143,
      1
    );

    // ================= DETAILS =================

    doc.setTextColor(
      23,
      55,
      105
    );

    doc.setFont(
      "helvetica",
      "normal"
    );

    doc.setFontSize(9);

    doc.text(
      "Student ID",
      54,
      153
    );

    doc.setFont(
      "helvetica",
      "bold"
    );

    doc.text(
      activity.studentId ||
        "N/A",
      54,
      160
    );

    doc.setFont(
      "helvetica",
      "normal"
    );

    doc.text(
      "Department",
      112,
      153
    );

    doc.setFont(
      "helvetica",
      "bold"
    );

    doc.text(
      activity.department ||
        "N/A",
      112,
      160
    );

    doc.setFont(
      "helvetica",
      "normal"
    );

    doc.text(
      "Academic Year",
      181,
      153
    );

    doc.setFont(
      "helvetica",
      "bold"
    );

    doc.text(
      activity.year ||
        "N/A",
      181,
      160
    );

    doc.setFont(
      "helvetica",
      "normal"
    );

    doc.text(
      "Completed On",
      235,
      153
    );

    const completedDate =
      certificate.completedAt
        ? new Date(
            certificate.completedAt
          ).toLocaleDateString()
        : new Date().toLocaleDateString();

    doc.setFont(
      "helvetica",
      "bold"
    );

    doc.text(
      completedDate,
      235,
      160
    );

    // ================= INSPIRATIONAL MESSAGE =================

    doc.setTextColor(
      71,
      85,
      105
    );

    doc.setFont(
      "times",
      "italic"
    );

    doc.setFontSize(10);

    doc.text(
      "Your curiosity, effort and dedication make a difference.",
      width / 2,
      170,
      {
        align:
          "center",
      }
    );

    doc.text(
      "Keep building, keep creating!",
      width / 2,
      176,
      {
        align:
          "center",
      }
    );

    // ================= SIGNATURE LINES =================

    doc.setDrawColor(
      100,
      116,
      139
    );

    doc.setLineWidth(
      0.5
    );

    doc.line(
      50,
      181,
      105,
      181
    );

    doc.line(
      192,
      181,
      247,
      181
    );

    doc.setTextColor(
      23,
      55,
      105
    );

    doc.setFont(
      "helvetica",
      "normal"
    );

    doc.setFontSize(8);

    doc.text(
      "Event Coordinator",
      77.5,
      187,
      {
        align:
          "center",
      }
    );

    doc.text(
      "EVENTORA Admin",
      219.5,
      187,
      {
        align:
          "center",
      }
    );

    // ================= FOOTER =================

    doc.setTextColor(
      100,
      116,
      139
    );

    doc.setFont(
      "helvetica",
      "normal"
    );

    doc.setFontSize(7);

    doc.text(
      "EVENTORA • Smart Event & Club Management System",
      width / 2,
      202,
      {
        align:
          "center",
      }
    );

    // ================= SAVE PDF =================

    const safeActivityName =
      activity.activityName
        .replace(
          /[^a-z0-9]/gi,
          "-"
        )
        .replace(
          /-+/g,
          "-"
        );

    doc.save(
      `${safeActivityName}-Certificate.pdf`
    );

    // ================= SAVE DOWNLOAD STATUS =================

    markCertificateDownloaded(
      activity
    );
  };

  // ================= UI =================

  return (
    <div className="certificate-page">

      {/* ================= HEADER ================= */}

      <div className="certificate-header">

        <h1>
          My Certificates
        </h1>

        <p>
          Complete your assigned work to unlock
          your participation certificates.
        </p>

      </div>

      {/* ================= LOADING ================= */}

      {loading ? (

        <div className="no-certificates">

          <FaLock />

          <h2>
            Loading Certificates...
          </h2>

          <p>
            Please wait while we load your
            certificates.
          </p>

        </div>

      ) : activities.length === 0 ? (

        /* ================= NO ACTIVITIES ================= */

        <div className="no-certificates">

          <FaLock />

          <h2>
            No Certificates Available
          </h2>

          <p>
            Register for an event or apply as a
            volunteer to receive your certificate
            after completion.
          </p>

        </div>

      ) : (

        /* ================= CERTIFICATE CARDS ================= */

        <div className="certificate-container">

          {activities.map(
            (activity) => {

              const certificate =
                getCertificate(
                  activity
                );

              const completed =
                Boolean(
                  certificate
                );

              const downloadKey =
                getDownloadKey(
                  activity
                );

              const alreadyDownloaded =
                Boolean(
                  downloadedCertificates[
                    downloadKey
                  ]
                );

              return (

                <div
                  className={`certificate-card ${
                    !completed
                      ? "locked-certificate"
                      : ""
                  }`}
                  key={`${activity.activityType}-${activity.activityId}-${activity.email}`}
                >

                  {completed ? (

                    <FaCertificate
                      className="certificate-icon"
                    />

                  ) : (

                    <FaLock
                      className="certificate-icon locked-icon"
                    />

                  )}

                  <h2>
                    {activity.activityName}
                  </h2>

                  <p>
                    <strong>
                      Type:
                    </strong>{" "}
                    {activity.activityType}
                  </p>

                  <p>
                    <strong>
                      Registered:
                    </strong>{" "}
                    {activity.registeredAt
                      ? new Date(
                          activity.registeredAt
                        ).toLocaleDateString()
                      : "N/A"}
                  </p>

                  {completed ? (

                    <>

                      <p className="status completed-status">

                        <FaCheckCircle />

                        Work Completed

                      </p>

                      {alreadyDownloaded ? (

                        <p
                          className="status completed-status"
                          style={{
                            marginTop:
                              "10px",
                            marginBottom:
                              "14px",
                          }}
                        >

                          <FaCheckCircle />

                          Certificate Downloaded

                        </p>

                      ) : null}

                      <button
                        onClick={() =>
                          downloadCertificate(
                            activity,
                            certificate
                          )
                        }
                      >

                        <FaDownload />

                        {alreadyDownloaded
                          ? "Download Again"
                          : "Download Certificate"}

                      </button>

                    </>

                  ) : (

                    <>

                      <p className="status locked-status">

                        <FaLock />

                        Certificate Locked

                      </p>

                      <p className="certificate-note">

                        Complete the assigned work
                        to unlock this certificate.

                      </p>

                      <button
                        className="locked-button"
                        disabled
                      >

                        <FaLock />

                        Complete Work First

                      </button>

                    </>

                  )}

                </div>

              );
            }
          )}

        </div>

      )}

    </div>
  );
}

export default Certificates;