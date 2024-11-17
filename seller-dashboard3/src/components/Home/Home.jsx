import React from "react";
import { useNavigate } from "react-router-dom";
import "./Home.css"; // Include a CSS file if you want to style this page

const Home = () => {
  const navigate = useNavigate(); // Hook to navigate to different routes

  const handleGetStarted = () => {
    navigate("/register"); // Redirect to the register page
  };

  return (
    <div className="home-container">
      <div className="home-content">
        <h1>Welcome to MaizeAI Farmers' Hub</h1>
        <p>
          Your personalized platform for connecting directly with buyers and
          maximizing your profits. Upload the details of your maize produce
          including:
        </p>
        <ul>
          <li>Maize Seed Variety</li>
          <li>Price</li>
          <li>Quantity</li>
          <li>Product Description</li>
          <li>Image</li>
        </ul>
        <p>
          Buyers will be able to view and interact with your products, ensuring
          you receive the best prices for your produce. Start today and become a
          part of the revolution in agricultural trading.
        </p>
        <button className="btn btn-primary" onClick={handleGetStarted}>
          Get Started
        </button>
      </div>
    </div>
  );
};

export default Home;
