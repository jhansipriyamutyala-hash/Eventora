import { useState } from "react";
import "../styles/Feedback.css";

function Feedback() {
  const [name, setName] = useState("");
  const [rating, setRating] = useState("");
  const [comment, setComment] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!name.trim() || !rating || !comment.trim()) {
      setMessage("⚠️ Please fill in all the fields.");
      return;
    }

    setMessage("✅ Thank you! Your feedback has been submitted.");

    setName("");
    setRating("");
    setComment("");
  };

  return (
    <div className="feedback-page">

      <div className="feedback-container">

        <div className="feedback-header">
          <h1>Share Your Feedback</h1>

          <p>
            Your feedback helps us improve the EVENTORA experience.
          </p>
        </div>

        {message && (
          <div className="feedback-message">
            {message}
          </div>
        )}

        <form
          className="feedback-form"
          onSubmit={handleSubmit}
        >

          <label>Student Name</label>

          <input
            type="text"
            placeholder="Enter your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <label>Rating</label>

          <select
            value={rating}
            onChange={(e) => setRating(e.target.value)}
          >
            <option value="">Select Rating</option>
            <option value="5">★★★★★ Excellent</option>
            <option value="4">★★★★ Very Good</option>
            <option value="3">★★★ Good</option>
            <option value="2">★★ Needs Improvement</option>
            <option value="1">★ Poor</option>
          </select>

          <label>Comments</label>

          <textarea
            placeholder="Write your feedback..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows="5"
          ></textarea>

          <button type="submit">
            Submit Feedback
          </button>

        </form>

      </div>

    </div>
  );
}

export default Feedback;