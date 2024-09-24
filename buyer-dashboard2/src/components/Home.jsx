import React from "react";
import Products from "./Products";

const Home = () => {
  return (
    <div className="hero">
      <div className="card bg-dark text-white border-0">
        <img
          src="../assets/corn-stalk-ready-harvest-field.jpg"
          className="card-img"
          alt="Background"
          height="550px"
          style={{ objectFit: "cover", width: "100%", height: "550px" }}
        />
        <div className="card-img-overlay d-flex flex-column justify-content-center">
          <div className="container">
            <h5 className="card-title display-3 fw-bolder mb-0">
              Buy Maize At Affordable Prices
            </h5>
            <p className="card-text lead fs-2">
              Bridging the gap between buyers and farmers for quality and
              affordable sales.
            </p>
          </div>
        </div>
      </div>
      <Products />
    </div>
  );
};

export default Home;
