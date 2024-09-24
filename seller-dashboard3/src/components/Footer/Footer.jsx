import React from "react";
import "./Footer.css";

const Footer = () => {
  return (
    <div className="footer">
      <div>
        <p className="navbar-brand fw-bold fs-3">
          <img className="icon" src="../assets/corn.png" />
          MaizeAI
        </p>
      </div>
      <ul className="footer-links">
        <li>Company</li>
        <li>Products</li>
        <li>Offices</li>
        <li>About</li>
        <li>Contact</li>
      </ul>
      <div className="footer-social-icon">
        <div className="footer-icons-container">
          <i class="fa fa-instagram fa-2x" aria-hidden="true"></i>
        </div>
        <div className="footer-icons-container">
          <i class="fa fa-twitter fa-2x" aria-hidden="true"></i>
        </div>
        <div className="footer-icons-container">
          <i class="fa fa-whatsapp fa-2x" aria-hidden="true"></i>
        </div>
      </div>
      <div className="footer-copyright">
        <hr />
        <p>Copyright @ 2024 - All Right Reserved</p>
      </div>
    </div>
  );
};

export default Footer;
