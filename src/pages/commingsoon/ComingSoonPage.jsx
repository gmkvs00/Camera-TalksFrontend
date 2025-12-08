import React from "react";
import { FiClock, FiHome } from "react-icons/fi";
import "./ComingSoonPage.css";

const ComingSoonPage = ({ title = "Coming Soon", message }) => {
  return (
    <div className="coming-soon-page">
      <div className="coming-soon-glow"></div>

      <div className="coming-soon-card">
        <div className="coming-soon-icon">
          <FiClock />
        </div>

        <h1 className="coming-soon-title">{title}</h1>

        <p className="coming-soon-text">
          {message ||
            "We’re still working on this module. You’ll see something awesome here very soon."}
        </p>

        <div className="coming-soon-badge">
          <span className="dot"></span>
          In active development
        </div>

        <div className="coming-soon-footer">
          <button
            type="button"
            className="coming-soon-btn"
            onClick={() => window.history.back()}
          >
            <FiHome className="btn-icon" />
            Go back
          </button>
        </div>

        <p className="coming-soon-small">
          Need this module urgently? Contact your admin or developer.
        </p>
      </div>
    </div>
  );
};

export default ComingSoonPage;
