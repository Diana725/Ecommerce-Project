import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Spinner } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [message, setMessage] = useState("");
  const [loginLoading, setLoginLoading] = useState(false); // State for login loading
  const [forgotPasswordLoading, setForgotPasswordLoading] = useState(false); // State for forgot password loading
  const navigate = useNavigate();

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setForgotPasswordLoading(true); // Show spinner for forgot password

    try {
      const response = await fetch(
        "https://www.maizeai.me/api/buyer/password/reset-request",
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
        setForgotPasswordLoading(false); // Hide spinner for forgot password
        return;
      }

      const result = await response.json();
      setMessage("A password reset link has been sent to your email address.");
      setErrorMessage("");
    } catch (error) {
      console.error("Error sending reset link", error);
      setErrorMessage("Failed to send reset link. Please try again.");
    } finally {
      setForgotPasswordLoading(false); // Hide spinner after forgot password request completion
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginLoading(true); // Show spinner for login

    const item = { email, password };

    try {
      const response = await fetch("https://www.maizeai.me/api/buyerLogin", {
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
        setLoginLoading(false); // Hide spinner for login
        return;
      }

      const result = await response.json();
      if (result.is_verified == 1) {
        setErrorMessage("Your email is not verified. Please check your inbox.");
        setLoginLoading(false); // Hide spinner for login
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
      setLoginLoading(false); // Hide spinner after login request completion
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

        {/* Display spinner when login is loading */}
        {loginLoading && (
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
            disabled={loginLoading} // Disable button while login is loading
          >
            {loginLoading ? "Logging in..." : "Login"}
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
              disabled={forgotPasswordLoading} // Disable link while forgot password is loading
            >
              {forgotPasswordLoading ? "Processing..." : "Click here"}
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
