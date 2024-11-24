import React, { useState } from "react";
import { useNavigate, NavLink } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState(""); // Add state for phone number
  const [message, setMessage] = useState(""); // State for the success or error message
  const [loading, setLoading] = useState(false); // State for loading spinner
  const [passwordError, setPasswordError] = useState(""); // State for password validation errors
  const [resendMessage, setResendMessage] = useState(""); // State for the resend verification email message
  const navigate = useNavigate();

  const validatePassword = (password) => {
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
    return passwordRegex.test(password);
  };

  const handleSignUp = async (e) => {
    e.preventDefault(); // Prevent the default form submission behavior

    // Validate password
    if (!validatePassword(password)) {
      setPasswordError(
        "Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character (@$!%*#?&)."
      );
      return;
    } else {
      setPasswordError("");
    }

    setLoading(true); // Show loading spinner
    let item = { name, email, password, phone }; // Include phone in the data sent to the server

    try {
      let response = await fetch("https://www.maizeai.me/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(item),
      });

      if (!response.ok) {
        let errorData = await response.json();
        console.error("Validation error:", errorData);
        setLoading(false); // Hide loading spinner

        if (errorData.message === "User already registered") {
          alert("User already registered. Redirecting to login page...");
          navigate("/login"); // Redirect to login page
        } else {
          alert("Failed to register. Please check your input.");
        }
        return;
      }

      let result = await response.json();
      setLoading(false); // Hide loading spinner

      if (result.status === "success") {
        setMessage("Registration successful! Please verify your email.");
        setTimeout(() => navigate("/login"), 5000); // Redirect to login after 5 seconds
      } else {
        setMessage(
          "Registration successful! Please check your inbox for email verification."
        );
      }
    } catch (error) {
      console.error("Error during registration:", error);
      setLoading(false); // Hide loading spinner
      alert("Failed to register. Please try again.");
    }
  };

  // Function to resend the verification email
  const handleResendVerification = async () => {
    setResendMessage(""); // Clear previous messages

    try {
      const response = await fetch(
        "https://www.maizeai.me/api/farmer/email/verification/resend",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({ email }), // Send the email that needs to be verified
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        setResendMessage(
          errorData.message || "Failed to resend verification email."
        );
        return;
      }

      const result = await response.json();
      setResendMessage(
        result.message || "Verification email resent successfully."
      );
    } catch (error) {
      console.error("Error during email resend:", error);
      setResendMessage(
        "Failed to resend verification email. Please try again."
      );
    }
  };

  return (
    <div className="container mt-5">
      <div className="col-md-6 offset-md-3">
        <h2>Farmer Registration</h2>
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
            <small style={{ fontSize: 13 }} className="text-muted">
              Password must be at least 8 characters long and include at least
              one uppercase letter, one lowercase letter, one number, and one
              special character (@$!%*#?&).
            </small>
            {passwordError && (
              <div className="text-danger mt-2">{passwordError}</div>
            )}
          </div>
          {/* Add phone number input field */}
          <div className="form-group mt-3">
            <label htmlFor="phone">Phone Number:</label>
            <input
              type="tel"
              className="form-control"
              id="phone"
              placeholder="Enter your phone number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className="btn btn-primary mt-4"
            disabled={loading} // Disable button while loading
          >
            {loading ? (
              <>
                <span
                  className="spinner-border spinner-border-sm"
                  role="status"
                  aria-hidden="true"
                ></span>{" "}
                Signing Up...
              </>
            ) : (
              "Sign Up"
            )}
          </button>
        </form>

        {message && (
          <div className="alert alert-success mt-3" role="alert">
            {message}
          </div>
        )}

        {/* Resend verification email section */}
        {message && !resendMessage && (
          <div className="mt-3">
            <button
              onClick={handleResendVerification}
              className="btn btn-warning"
            >
              Resend Verification Email
            </button>
          </div>
        )}

        {resendMessage && (
          <div className="alert alert-info mt-3" role="alert">
            {resendMessage}
          </div>
        )}

        <p className="mt-3">
          Already have an account? <NavLink to="/login">Login here</NavLink>
        </p>
      </div>
    </div>
  );
};

export default Register;
