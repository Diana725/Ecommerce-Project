import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

const ResetPassword = () => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [email, setEmail] = useState(""); // Store email here
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [token, setToken] = useState("");
  const [passwordError, setPasswordError] = useState(""); // Track password validation errors
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const resetToken = params.get("token");
    const resetEmail = params.get("email");
    setToken(resetToken);
    setEmail(resetEmail);

    // Check the token and email are correctly set
    console.log("Token:", resetToken);
    console.log("Email:", resetEmail);
  }, [location]);

  // Function to validate the password strength
  const validatePassword = (password) => {
    const regexLowerCase = /[a-z]/;
    const regexUpperCase = /[A-Z]/;
    const regexNumber = /[0-9]/;
    const regexSpecialChar = /[@$!%*#?&]/;
    const minLength = 8;

    if (password.length < minLength) {
      return `Password must be at least ${minLength} characters long.`;
    }
    if (!regexLowerCase.test(password)) {
      return "Password must contain at least one lowercase letter.";
    }
    if (!regexUpperCase.test(password)) {
      return "Password must contain at least one uppercase letter.";
    }
    if (!regexNumber.test(password)) {
      return "Password must contain at least one number.";
    }
    if (!regexSpecialChar.test(password)) {
      return "Password must contain at least one special character (@, $, !, %, *, #, ?, &).";
    }
    return ""; // No error
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();

    // Validate password match
    if (newPassword !== confirmPassword) {
      setErrorMessage("Passwords do not match.");
      return;
    }

    // Validate the new password according to the rules
    const passwordValidationError = validatePassword(newPassword);
    if (passwordValidationError) {
      setPasswordError(passwordValidationError);
      return;
    }

    try {
      const response = await fetch(
        "http://localhost:8000/api/buyer/password/reset",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            email: email, // Use email state dynamically
            password: newPassword,
            password_confirmation: confirmPassword, // Send password confirmation
            token: token,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        setErrorMessage(errorData.message || "Failed to reset password.");
        return;
      }

      const result = await response.json();
      setSuccessMessage(
        result.message ||
          "Password reset successfully. Rerouting to the login page..."
      );
      setErrorMessage("");
      setTimeout(() => {
        navigate("/login"); // Redirect to login page after success
      }, 2000);
    } catch (error) {
      console.error("Error during password reset:", error);
      setErrorMessage("Failed to reset password. Please try again.");
    }
  };

  return (
    <div className="container mt-5">
      <div className="col-md-6 offset-md-3">
        <h2>Reset Password</h2>
        {errorMessage && (
          <div className="alert alert-danger" role="alert">
            {errorMessage}
          </div>
        )}
        {successMessage && (
          <div className="alert alert-success" role="alert">
            {successMessage}
          </div>
        )}
        {passwordError && (
          <div className="alert alert-danger" role="alert">
            {passwordError}
          </div>
        )}
        <form onSubmit={handleResetPassword}>
          <div className="form-group">
            <label htmlFor="newPassword">New Password:</label>
            <input
              type="password"
              className="form-control"
              id="newPassword"
              placeholder="Enter your new password"
              value={newPassword}
              onChange={(e) => {
                setNewPassword(e.target.value);
                setPasswordError(""); // Reset password error when typing a new password
              }}
              required
            />
            <small style={{ fontSize: 13 }}>
              Password must be atleast 8 characters long and include at least
              one uppercase letter, one lowercase letter, one number, and one
              special character(@$!%*#?&).
            </small>
          </div>
          <div className="form-group mt-3">
            <label htmlFor="confirmPassword">Confirm Password:</label>
            <input
              type="password"
              className="form-control"
              id="confirmPassword"
              placeholder="Confirm your new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary mt-4">
            Reset Password
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
