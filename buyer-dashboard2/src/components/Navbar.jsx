import React, { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Modal, Button, Dropdown } from "react-bootstrap";
import { selectCartCount } from "../redux/selectors.js";
import "./Navbar.css";

const Navbar = () => {
  const cartCount = useSelector(selectCartCount); // Get cart count from Redux store
  const navigate = useNavigate();

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("user-info"));
    if (userInfo) {
      setIsLoggedIn(true);
      setUserName(userInfo.name);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    setUserName("");
    navigate("/"); // Redirect to home page after logout
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    navigate(`/search?query=${searchQuery}`);
  };

  const handleLoginChoice = (userType) => {
    if (userType === "buyer") {
      navigate("/login");
    } else if (userType === "farmer") {
      window.location.href = "http://localhost:3007/login"; // Redirect to farmer's login
    }
    setShowLoginModal(false); // Close modal
  };

  const handleRegisterChoice = (userType) => {
    if (userType === "buyer") {
      navigate("/register");
    } else if (userType === "farmer") {
      window.location.href = "http://localhost:3007/register"; // Redirect to farmer's registration
    }
    setShowRegisterModal(false); // Close modal
  };

  return (
    <div>
      <nav className="navbar navbar-expand-lg navbar-light bg-white py-2 shadow-sm">
        <div className="container">
          <img className="icon" src="../assets/corn.png" alt="Logo" />
          <NavLink className="navbar-brand fw-bold fs-4" to="/">
            MaizeAI
          </NavLink>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav mx-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <NavLink className="nav-link" to="/" activeClassName="active">
                  Home
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink
                  className="nav-link"
                  to="/products"
                  activeClassName="active"
                >
                  Products
                </NavLink>
              </li>
              {isLoggedIn && (
                <li className="nav-item">
                  <NavLink
                    className="nav-link"
                    to="/payment-history"
                    activeClassName="active"
                  >
                    Payment History
                  </NavLink>
                </li>
              )}
              <li className="nav-item">
                <NavLink
                  className="nav-link"
                  to="/about"
                  activeClassName="active"
                >
                  About
                </NavLink>
              </li>
            </ul>

            <form className="d-flex me-3" onSubmit={handleSearchSubmit}>
              <input
                className="form-control me-2"
                style={{ fontSize: 15 }}
                type="search"
                placeholder="Search"
                aria-label="Search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button
                className="btn btn-outline-dark"
                type="submit"
                style={{ fontSize: 15 }}
              >
                Search
              </button>
            </form>
            <div className="d-flex align-items-center">
              {isLoggedIn && (
                <NavLink
                  to="/cart"
                  className="btn btn-outline-dark me-2"
                  style={{ fontSize: 15 }}
                >
                  <i className="fa fa-shopping-cart  me-1"></i>
                  Cart ({cartCount})
                </NavLink>
              )}
              {!isLoggedIn ? (
                <>
                  <button
                    className="btn btn-outline-dark"
                    onClick={() => setShowLoginModal(true)}
                  >
                    <i
                      className="fa fa-sign-in me-1"
                      style={{ fontSize: 14 }}
                    ></i>
                    Login
                  </button>
                  <button
                    className="btn btn-outline-dark ms-2"
                    onClick={() => setShowRegisterModal(true)}
                  >
                    <i
                      className="fa fa-user-plus me-1"
                      style={{ fontSize: 14 }}
                    ></i>
                    Register
                  </button>
                </>
              ) : (
                <>
                  <NavLink>
                    <button
                      className="btn btn-outline-dark d-flex align-items-center"
                      type="button"
                    >
                      <i className="fa fa-user me-1"></i> {userName}
                      <Dropdown>
                        <Dropdown.Toggle
                          as="span"
                          className="dropdown-toggle-split"
                          id="dropdownMenuButton"
                        />
                        <Dropdown.Menu>
                          <Dropdown.Item
                            onClick={handleLogout}
                            style={{ fontSize: 14 }}
                          >
                            Log Out
                          </Dropdown.Item>
                        </Dropdown.Menu>
                      </Dropdown>
                    </button>
                  </NavLink>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Login Modal */}
      <Modal show={showLoginModal} onHide={() => setShowLoginModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Login As</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Button
            variant="primary"
            className="w-100 mb-2"
            onClick={() => handleLoginChoice("buyer")}
          >
            Login as Buyer
          </Button>
          <Button
            variant="success"
            className="w-100"
            onClick={() => handleLoginChoice("farmer")}
          >
            Login as Farmer
          </Button>
        </Modal.Body>
      </Modal>

      {/* Register Modal */}
      <Modal
        show={showRegisterModal}
        onHide={() => setShowRegisterModal(false)}
      >
        <Modal.Header closeButton>
          <Modal.Title>Register As</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Button
            variant="primary"
            className="w-100 mb-2"
            onClick={() => handleRegisterChoice("buyer")}
          >
            Register as Buyer
          </Button>
          <Button
            variant="success"
            className="w-100"
            onClick={() => handleRegisterChoice("farmer")}
          >
            Register as Farmer
          </Button>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default Navbar;
