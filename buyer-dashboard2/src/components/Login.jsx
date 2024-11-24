import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Spinner } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [message, setMessage] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);
  const [forgotPasswordLoading, setForgotPasswordLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false); // State for resend verification email
  const [isEmailVerified, setIsEmailVerified] = useState(true); // Email verification status
  const navigate = useNavigate();

  // Handle login request
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginLoading(true);

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
        setErrorMessage(errorData.message || "Failed to login.");
        setLoginLoading(false);
        return;
      }

      const result = await response.json();

      if (result.is_verified == 0) {
        // Email is not verified
        setIsEmailVerified(false);
        setErrorMessage("Your email is not verified. Please check your inbox.");
        setLoginLoading(false);
        return;
      }

      // Successful login
      localStorage.setItem("user-info", JSON.stringify(result));
      localStorage.setItem("token", result.token);
      setErrorMessage("");
      navigate("/"); // Redirect to home page after successful login
    } catch (error) {
      console.error("Error during login:", error);
      setErrorMessage("Failed to login. Please try again.");
    } finally {
      setLoginLoading(false);
    }
  };

  // Handle resend verification email
  const handleResendVerificationEmail = async () => {
    setResendLoading(true);
    try {
      const response = await fetch(
        "https://www.maizeai.me/api/email/verification/resend",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({ email }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        setErrorMessage(
          errorData.message || "Failed to resend verification email."
        );
        setResendLoading(false);
        return;
      }

      setMessage("A new verification email has been sent.");
      setErrorMessage("");
      setResendLoading(false);
    } catch (error) {
      console.error("Error sending verification email:", error);
      setErrorMessage("Failed to resend verification email. Please try again.");
      setResendLoading(false);
    }
  };

  // Handle forgot password request
  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setForgotPasswordLoading(true);

    try {
      const response = await fetch(
        "https://www.maizeai.me/api/buyer/password/reset-request",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({ email }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        setErrorMessage(errorData.message || "Failed to send reset link.");
        setForgotPasswordLoading(false);
        return;
      }

      setMessage("A password reset link has been sent to your email address.");
      setErrorMessage("");
    } catch (error) {
      console.error("Error sending reset link", error);
      setErrorMessage("Failed to send reset link. Please try again.");
    } finally {
      setForgotPasswordLoading(false);
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
            disabled={loginLoading}
          >
            {loginLoading ? "Logging in..." : "Login"}
          </button>
        </form>

        {isEmailVerified === false && (
          <div className="mt-3">
            <button
              className="btn btn-link"
              onClick={handleResendVerificationEmail}
              disabled={resendLoading}
            >
              {resendLoading ? "Sending..." : "Resend verification email"}
            </button>
          </div>
        )}

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
              disabled={forgotPasswordLoading}
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
