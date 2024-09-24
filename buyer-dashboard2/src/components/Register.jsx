import React, { useState } from "react";
import { useNavigate, NavLink } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault(); // Prevent the default form submission behavior

    let item = { name, email, password };

    try {
      let response = await fetch(
        "http://localhost:8000/api/buyerRegistration",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify(item),
        }
      );

      if (!response.ok) {
        let errorData = await response.json();
        console.error("Validation error:", errorData);
        // Check if the error indicates user already exists
        if (errorData.message === "User already registered") {
          alert("User already registered. Redirecting to login page...");
          navigate("/login"); // Redirect to login page
        } else {
          alert("Failed to register. Please check your input.");
        }
        return;
      }

      let result = await response.json();
      localStorage.setItem("user-info", JSON.stringify(result));
      navigate("/"); // Redirect to home page after successful registration
    } catch (error) {
      console.error("Error during registration:", error);
      alert("Failed to register. Please try again.");
    }
  };

  return (
    <div className="container mt-5">
      <div className="col-md-6 offset-md-3">
        <h2>Registration Page</h2>
        <form onSubmit={handleSignUp}>
          <div className="form-group">
            <label htmlFor="name">Name:</label>
            <input
              type="text"
              className="form-control"
              id="name"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="form-group mt-3">
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              className="form-control"
              id="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group mt-3">
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              className="form-control"
              id="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary mt-4">
            Sign Up
          </button>
        </form>
        <p className="mt-3">
          Already have an account? <NavLink to="/login">Login here</NavLink>
        </p>
      </div>
    </div>
  );
};

export default Register;
