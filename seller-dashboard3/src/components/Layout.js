// src/components/Layout.js
import React from "react";
import { useLocation } from "react-router-dom";
import Navbar from "./Navbar/Navbar"; // Adjust the import path as needed
import Footer from "./Footer/Footer";

const Layout = ({ children }) => {
  const location = useLocation();

  // Define routes where navbar and footer should not be shown
  const hideNavAndFooterRoutes = [
    "/login",
    "/register",
    "/",
    "/password/reset-form",
  ];
  const shouldHideNavAndFooter = hideNavAndFooterRoutes.includes(
    location.pathname
  );

  return (
    <div>
      {!shouldHideNavAndFooter && <Navbar />}
      <div>{children}</div>
      {!shouldHideNavAndFooter && <Footer />}
    </div>
  );
};

export default Layout;
