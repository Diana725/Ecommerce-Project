import React from "react";
import "./Footer.css";

const Footer = () => {
  return (
    <div className="footer">
      <div>
        <p className="navbar-brand fw-bold fs-3">
          <img className="icon" src="../assets/corn.png" alt="MaizeAI logo" />
          MaizeAI
        </p>
      </div>
      <ul className="footer-links fs-6">
        <li>Company</li>
        <li>Products</li>
        <li>Offices</li>
        <li>About</li>
        <li>Contact</li>
      </ul>
      <div className="footer-social-icon">
        <div className="footer-icons-container">
          <i className="fab fa-instagram fa-2x" aria-hidden="true"></i>
        </div>
        <div className="footer-icons-container">
          <i className="fab fa-twitter fa-2x" aria-hidden="true"></i>
        </div>
        <div className="footer-icons-container">
          <i className="fab fa-whatsapp fa-2x" aria-hidden="true"></i>
        </div>
      </div>
      <div className="footer-copyright">
        <p className="fs-6">Copyright © 2024 - All Rights Reserved</p>
      </div>
    </div>
  );
};

export default Footer;
