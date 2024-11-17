import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleForgotPassword = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(
        "http://localhost:8000/api/farmer/password/reset-request",
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
        return;
      }

      const result = await response.json();
      setMessage("A password reset link has been sent to your email address.");
      setErrorMessage("");
    } catch (error) {
      console.error("Error sending reset link", error);
      setErrorMessage("Failed to send reset link. Please try again.");
    }
  };
  // Function to handle the login process
  const handleLogin = async (e) => {
    e.preventDefault();

    let item = { email, password };

    try {
      // Call the Laravel API to login the user
      let response = await fetch("http://localhost:8000/api/login", {
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
        return;
      }

      let result = await response.json();

      // Check if the email is verified
      if (!result.user.is_verified) {
        setErrorMessage(
          "Your email is not verified. Please check your inbox for the verification link."
        );
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
  };

  // Function to make authenticated requests
  const fetchWithAuth = async (url, options = {}) => {
    const token = localStorage.getItem("token");

    const response = await fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
        ...options.headers,
      },
    });

    // Handle errors
    if (!response.ok) {
      const errorData = await response.json();
      console.error("Error during fetch:", errorData);
      throw new Error(errorData.message || "Failed to fetch.");
    }

    return response.json();
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
              type="text"
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
          <p>
            Forgot your password?{" "}
            <a
              href="#"
              className="btn-link"
              onClick={handleForgotPassword} // Trigger the forgot password function
            >
              Click here
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
