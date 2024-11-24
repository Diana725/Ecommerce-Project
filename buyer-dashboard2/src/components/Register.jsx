import React, { useState } from "react";
import { useNavigate, NavLink } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { Modal, Button, Spinner } from "react-bootstrap";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState(""); // Password validation error state
  const [isLoading, setIsLoading] = useState(false); // Loading state
  const [showModal, setShowModal] = useState(false); // Modal visibility state
  const [isResending, setIsResending] = useState(false); // Loading state for resend button
  const [resendSuccess, setResendSuccess] = useState(""); // Success message for resend
  const navigate = useNavigate();

  // Password validation regex for uppercase, lowercase, number, and special character
  const validatePassword = (password) => {
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[@$!%*#?&])[A-Za-z0-9@$!%*#?&]{8,}$/;
    return passwordRegex.test(password);
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    setIsLoading(true); // Show the loading indicator

    // Validate password
    if (!validatePassword(password)) {
      setPasswordError(
        "Password must be atleast 8 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character(@$!%*#?&)."
      );
      setIsLoading(false);
      return; // Stop if password is invalid
    } else {
      setPasswordError(""); // Reset password error if valid
    }

    let item = { name, email, password };

    try {
      let response = await fetch(
        "https://www.maizeai.me/api/buyerRegistration",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify(item),
        }
      );

      setIsLoading(false); // Stop the loading indicator

      if (!response.ok) {
        let errorData = await response.json();
        console.error("Validation error:", errorData);
        if (errorData.message === "User already registered") {
          alert("User already registered. Redirecting to login page...");
          navigate("/login");
        } else {
          alert("Failed to register. Please check your input.");
        }
        return;
      }

      let result = await response.json();

      // Show modal instead of alert
      setShowModal(true);
    } catch (error) {
      setIsLoading(false);
      console.error("Error during registration:", error);
      alert("Failed to register. Please try again.");
    }
  };

  // Function to handle resend verification email request
  const handleResendVerification = async () => {
    setIsResending(true); // Show loading indicator for resend
    setResendSuccess(""); // Reset success message

    try {
      let response = await fetch(
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

      setIsResending(false); // Stop loading indicator for resend

      if (!response.ok) {
        let errorData = await response.json();
        console.error("Resend verification failed:", errorData);
        alert("Failed to resend verification email. Please try again.");
        return;
      }

      setResendSuccess("Verification email sent! Please check your inbox.");
    } catch (error) {
      setIsResending(false);
      console.error("Error during resend verification:", error);
      alert("Failed to resend verification email. Please try again.");
    }
  };

  const handleModalClose = () => {
    setShowModal(false);
    navigate("/login"); // Redirect to login after closing the modal
  };

  // Clear the password error when the user starts typing
  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    if (passwordError) {
      setPasswordError(""); // Clear error when the user starts typing
    }
  };

  return (
    <div className="container mt-5">
      <div className="col-md-6 offset-md-3">
        <h2>Registration Page</h2>

        {/* Display password error message at the top */}
        {passwordError && (
          <div className="alert alert-danger">{passwordError}</div>
        )}

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
              className={`form-control ${passwordError ? "is-invalid" : ""}`} // Add class for red border if invalid
              id="password"
              placeholder="Enter your password"
              value={password}
              onChange={handlePasswordChange} // Call the handler on password change
              required
            />
            <small style={{ fontSize: 13 }}>
              Password must be atleast 8 characters long and include at least
              one uppercase letter, one lowercase letter, one number, and one
              special character(@$!%*#?&).
            </small>
          </div>

          <button
            type="submit"
            className="btn btn-primary mt-4"
            disabled={isLoading}
          >
            {isLoading ? (
              <Spinner animation="border" size="sm" /> // Loading spinner
            ) : (
              "Sign Up"
            )}
          </button>
        </form>

        <p className="mt-3">
          Already have an account? <NavLink to="/login">Login here</NavLink>
        </p>

        {/* Resend Verification Email Button */}
        <div className="mt-3">
          {resendSuccess && (
            <div className="alert alert-success">{resendSuccess}</div>
          )}
          <button
            className="btn btn-secondary"
            onClick={handleResendVerification}
            disabled={isResending}
          >
            {isResending ? (
              <Spinner animation="border" size="sm" />
            ) : (
              "Resend Verification Email"
            )}
          </button>
        </div>
      </div>

      {/* Success Modal */}
      <Modal show={showModal} onHide={handleModalClose}>
        <Modal.Header closeButton>
          <Modal.Title>Registration Successful</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Registration successful! Please check your email to verify your
          account.
        </Modal.Body>
        <Modal.Footer></Modal.Footer>
      </Modal>
    </div>
  );
};

export default Register;
