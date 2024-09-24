import React, { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectCartCount } from "../redux/selectors.js";
import "./Navbar.css";
import { Dropdown } from "react-bootstrap";

const Navbar = () => {
  const cartCount = useSelector(selectCartCount); // Get cart count from Redux store
  const navigate = useNavigate();

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

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
    navigate("/"); // Redirect to home page or login page after logout
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    navigate(`/search?query=${searchQuery}`);
  };

  return (
    <div>
      <nav className="navbar navbar-expand-lg navbar-light bg-white py-2 shadow-sm">
        <div className="container">
          <img className="icon" src="../assets/corn.png" alt="Logo" />
          <NavLink className="navbar-brand fw-bold fs-3" to="/">
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
              <li className="nav-item">
                <NavLink
                  className="nav-link"
                  to="/price_predictions"
                  activeClassName="active"
                >
                  Price Predictions
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink
                  className="nav-link"
                  to="/about"
                  activeClassName="active"
                >
                  About
                </NavLink>
              </li>
              <li>
                <NavLink
                  className="nav-link"
                  to="/payment-history"
                  activeClassName="active"
                >
                  Payment History
                </NavLink>
              </li>
            </ul>
            <form className="d-flex me-3" onSubmit={handleSearchSubmit}>
              <input
                className="form-control me-2"
                type="search"
                placeholder="Search"
                aria-label="Search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button className="btn btn-outline-dark" type="submit">
                Search
              </button>
            </form>
            <div className="d-flex align-items-center">
              {isLoggedIn && (
                <NavLink to="/cart" className="btn btn-outline-dark me-2">
                  <i className="fa fa-shopping-cart me-1"></i>
                  Cart ({cartCount})
                </NavLink>
              )}
              {!isLoggedIn ? (
                <>
                  <NavLink to="/login" className="btn btn-outline-dark">
                    <i className="fa fa-sign-in me-1"></i>Login
                  </NavLink>
                  <NavLink to="/register" className="btn btn-outline-dark ms-2">
                    <i className="fa fa-user-plus me-1"></i>Register
                  </NavLink>
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
                          <Dropdown.Item onClick={handleLogout}>
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
    </div>
  );
};

export default Navbar;
