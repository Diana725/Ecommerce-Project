import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Spinner } from "react-bootstrap"; // Import Spinner
import "bootstrap/dist/css/bootstrap.min.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [message, setMessage] = useState(""); // State to show the forgot password message
  const [loading, setLoading] = useState(false); // State to handle loading
  const navigate = useNavigate();

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setLoading(true); // Show spinner

    try {
      const response = await fetch(
        "http://localhost:8000/api/buyer/password/reset-request",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({ email }), // Send the email only
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        setErrorMessage(errorData.message || "Failed to send reset link.");
        setLoading(false); // Hide spinner
        return;
      }

      const result = await response.json();
      setMessage("A password reset link has been sent to your email address.");
      setErrorMessage("");
    } catch (error) {
      console.error("Error sending reset link", error);
      setErrorMessage("Failed to send reset link. Please try again.");
    } finally {
      setLoading(false); // Hide spinner after request completion
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true); // Show spinner

    const item = { email, password };

    try {
      const response = await fetch("http://localhost:8000/api/buyerLogin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(item),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error during login:", errorData);
        setErrorMessage(errorData.message || "Failed to login.");
        setLoading(false); // Hide spinner
        return;
      }

      const result = await response.json();
      if (result.is_verified == 1) {
        setErrorMessage("Your email is not verified. Please check your inbox.");
        setLoading(false); // Hide spinner
        return;
      }

      localStorage.setItem("user-info", JSON.stringify(result));
      localStorage.setItem("token", result.token);
      setErrorMessage("");
      navigate("/");
    } catch (error) {
      console.error("Error during login:", error);
      setErrorMessage("Failed to login. Please try again.");
    } finally {
      setLoading(false); // Hide spinner after request completion
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
        {message && (
          <div className="alert alert-success" role="alert">
            {message}
          </div>
        )}

        {/* Display spinner when loading */}
        {loading && (
          <div className="text-center">
            <Spinner animation="border" role="status">
              <span className="visually-hidden">Loading...</span>
            </Spinner>
          </div>
        )}

        <form onSubmit={handleLogin}>
          <div className="form-group">
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
          <button
            type="submit"
            className="btn btn-primary mt-4"
            disabled={loading} // Disable button while loading
          >
            {loading ? "Sending Recovery Email..." : "Login"}
          </button>
        </form>

        <div className="mt-3">
          <p>
            Don't have an account?{" "}
            <a href="/register" className="btn-link">
              Register here
            </a>
          </p>
          <p>
            Forgot your password?{" "}
            <a
              href="#"
              className="btn-link"
              onClick={handleForgotPassword}
              disabled={loading} // Disable link while loading
            >
              {loading ? "Processing..." : "Click here"}
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
