import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext"; // Import the useAuth hook
import "bootstrap/dist/css/bootstrap.min.css";

const Login = () => {
  const [email, setName] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState(""); // State to hold the error message
  const navigate = useNavigate();
  const { login } = useAuth(); // Destructure the login function from useAuth

  const handleLogin = async (e) => {
    e.preventDefault();

    const item = { email, password };

    try {
      // Call the Laravel API to login the user
      const response = await fetch("http://localhost:8000/api/buyerLogin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(item),
      });

      // Check if the response is successful
      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error during login:", errorData);
        setErrorMessage(errorData.message || "Failed to login."); // Set the error message state
        return;
      }

      const result = await response.json();

      // Store user info in local storage
      localStorage.setItem("user-info", JSON.stringify(result));
      localStorage.setItem("token", result.token);
      setErrorMessage(""); // Clear the error message if login is successful

      // Use the login function from useAuth to set the user data
      login(result);

      // Redirect to cart page after successful login
      navigate("/cart");
    } catch (error) {
      console.error("Error during login:", error);
      setErrorMessage("Failed to login. Please try again."); // Set the error message state
    }
  };

  return (
    <div className="container mt-5">
      <div className="col-md-6 offset-md-3">
        <h2>Login Page</h2>
        {errorMessage && (
          <div className="alert alert-danger" role="alert">
            {errorMessage}
          </div>
        )}
        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label htmlFor="email">Email:</label>
            <input
              type="text"
              className="form-control"
              id="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setName(e.target.value)}
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
            Login
          </button>
        </form>
        <div className="mt-3">
          <p>
            Don't have an account?{" "}
            <a href="/register" className="btn-link">
              Register here
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
