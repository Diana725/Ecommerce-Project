import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [message, setMessage] = useState("");
  const [loginLoading, setLoginLoading] = useState(false); // State for login loading
  const [forgotPasswordLoading, setForgotPasswordLoading] = useState(false); // State for forgot password loading
  const navigate = useNavigate();

  // Function to handle forgot password
  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setForgotPasswordLoading(true); // Start forgot password loading

    try {
      const response = await fetch(
        "https://www.maizeai.me/api/farmer/password/reset-request",
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
        setForgotPasswordLoading(false); // Stop forgot password loading
        return;
      }

      const result = await response.json();
      setMessage("A password reset link has been sent to your email address.");
      setErrorMessage("");
    } catch (error) {
      console.error("Error sending reset link", error);
      setErrorMessage("Failed to send reset link. Please try again.");
    }

    setForgotPasswordLoading(false); // Stop forgot password loading
  };

  // Function to handle the login process
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginLoading(true); // Start login loading

    let item = { email, password };

    try {
      // Call the Laravel API to login the user
      let response = await fetch("https://www.maizeai.me/api/login", {
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

        // Check if the error is related to email verification
        if (errorData.message === "Email not verified") {
          setErrorMessage(
            "Your email is not verified. Please check your inbox."
          );
        } else {
          setErrorMessage(errorData.message || "Failed to login.");
        }
        setLoginLoading(false); // Stop login loading
        return;
      }

      let result = await response.json();

      // Check if the email is verified
      if (!result.user.is_verified) {
        setErrorMessage(
          "Your email is not verified. Please check your inbox for the verification link."
        );
        setLoginLoading(false); // Stop login loading
        return;
      }

      // Clear the error message if login is successful
      setErrorMessage("");

      // Store user info and token in local storage
      localStorage.setItem("user-info", JSON.stringify(result.user));
      localStorage.setItem("token", result.token);

      // Redirect to the products page after successful login
      navigate("/products");
    } catch (error) {
      console.error("Error during login:", error);
      setErrorMessage("Failed to login. Please try again.");
    }

    setLoginLoading(false); // Stop login loading
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
        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label htmlFor="name">Email:</label>
            <input
              type="email"
              className="form-control"
              id="name"
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
            disabled={loginLoading} // Disable login button while loading
          >
            {loginLoading ? (
              <>
                <span
                  className="spinner-border spinner-border-sm"
                  role="status"
                  aria-hidden="true"
                ></span>{" "}
                Logging in...
              </>
            ) : (
              "Login"
            )}
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
              disabled={forgotPasswordLoading} // Disable forgot password link while loading
            >
              {forgotPasswordLoading ? (
                <>
                  <span
                    className="spinner-border spinner-border-sm"
                    role="status"
                    aria-hidden="true"
                  ></span>{" "}
                  Sending reset link...
                </>
              ) : (
                "Click here"
              )}
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
