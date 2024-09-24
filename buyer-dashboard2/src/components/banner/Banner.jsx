// Banner.js
import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./Banner.css";

const Banner = () => {
  const [visible, setVisible] = useState(true);

  // Handler to close the banner
  const handleClose = () => {
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="banner-container">
      <p className="banner-text">
        <span className="logo"> MaizeAI</span> - Are you a farmer? Join us and
        grow your market reach{" "}
        <Link
          to="http://localhost:3007/"
          className="banner-button"
          target="blank"
        >
          Become a seller →
        </Link>
      </p>
      <button className="close-banner" onClick={handleClose}>
        &times;
      </button>
    </div>
  );
};

export default Banner;
