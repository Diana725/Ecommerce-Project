import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [message, setMessage] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);
  const [forgotPasswordLoading, setForgotPasswordLoading] = useState(false);
  const [resendVerificationLoading, setResendVerificationLoading] =
    useState(false);
  const [resendResetLoading, setResendResetLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get("token");

    if (token) {
      fetch(`https://www.maizeai.me/api/verify-email/${token}`)
        .then((response) => response.json())
        .then((data) => {
          if (
            data.message === "Email verified successfully! You can now log in."
          ) {
            setMessage(data.message);
          } else {
            setErrorMessage(data.message || "Invalid verification token.");
          }
        })
        .catch((error) => {
          console.error("Error verifying email:", error);
          setErrorMessage("Failed to verify email. Please try again.");
        });
    }
  }, []);

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setForgotPasswordLoading(true);

    try {
      const response = await fetch(
        "https://www.maizeai.me/api/farmer/password/reset-request",
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

      const result = await response.json();
      setMessage("A password reset link has been sent to your email address.");
      setErrorMessage("");
    } catch (error) {
      console.error("Error sending reset link", error);
      setErrorMessage("Failed to send reset link. Please try again.");
    }

    setForgotPasswordLoading(false);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginLoading(true);

    let item = { email, password };

    try {
      let response = await fetch("https://www.maizeai.me/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(item),
      });

      if (!response.ok) {
        const errorData = await response.json();

        if (errorData.message === "Email not verified") {
          setErrorMessage(
            "Your email is not verified. Please check your inbox."
          );
        } else {
          setErrorMessage(errorData.message || "Failed to login.");
        }
        setLoginLoading(false);
        return;
      }

      let result = await response.json();

      if (!result.user.is_verified) {
        setErrorMessage(
          "Your email is not verified. Please check your inbox for the verification link."
        );
        setLoginLoading(false);
        return;
      }

      setErrorMessage("");
      localStorage.setItem("user-info", JSON.stringify(result.user));
      localStorage.setItem("token", result.token);
      navigate("/products");
    } catch (error) {
      console.error("Error during login:", error);
      setErrorMessage("Failed to login. Please try again.");
    }

    setLoginLoading(false);
  };

  const handleResendVerification = async () => {
    setResendVerificationLoading(true);

    try {
      const response = await fetch(
        "https://www.maizeai.me/api/farmer/email/verification/resend",
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
        setResendVerificationLoading(false);
        return;
      }

      const result = await response.json();
      setMessage(
        "A new verification email has been sent. Please check your inbox."
      );
    } catch (error) {
      console.error("Error resending verification email:", error);
      setErrorMessage("Failed to resend verification email. Please try again.");
    }

    setResendVerificationLoading(false);
  };

  const handleResendPasswordReset = async () => {
    setResendResetLoading(true);

    try {
      const response = await fetch(
        "https://www.maizeai.me/api/farmer/password-reset/resend",
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
          errorData.message || "Failed to resend password reset email."
        );
        setResendResetLoading(false);
        return;
      }

      const result = await response.json();
      setMessage("A password reset link has been sent to your email.");
    } catch (error) {
      console.error("Error resending password reset email:", error);
      setErrorMessage(
        "Failed to resend password reset email. Please try again."
      );
    }

    setResendResetLoading(false);
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
            disabled={loginLoading}
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
              disabled={forgotPasswordLoading}
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
          {errorMessage.includes("email is not verified") && (
            <p>
              <button
                onClick={handleResendVerification}
                className="btn btn-link"
                disabled={resendVerificationLoading}
              >
                {resendVerificationLoading ? (
                  <>
                    <span
                      className="spinner-border spinner-border-sm"
                      role="status"
                      aria-hidden="true"
                    ></span>{" "}
                    Resending email...
                  </>
                ) : (
                  "Resend verification email"
                )}
              </button>
            </p>
          )}
          {errorMessage.includes("Failed to send reset link") && (
            <p>
              <button
                onClick={handleResendPasswordReset}
                className="btn btn-link"
                disabled={resendResetLoading}
              >
                {resendResetLoading ? (
                  <>
                    <span
                      className="spinner-border spinner-border-sm"
                      role="status"
                      aria-hidden="true"
                    ></span>{" "}
                    Resending reset link...
                  </>
                ) : (
                  "Resend password reset email"
                )}
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;
