import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import Footer from "./components/footer/Footer.jsx";
import Home from "./components/Home.jsx";
import Products from "./components/Products.jsx";
// import PricePredictions from "./pages/PricePredictions";
import About from "./components/About.jsx";
import Cart from "./components/Cart.jsx";
import Login from "./components/Login.jsx";
import Checkout from "./components/Checkout.jsx";
import Product from "./components/Product.jsx";
import Register from "./components/Register.jsx";
import "bootstrap/dist/css/bootstrap.min.css";
import Banner from "./components/banner/Banner.jsx";
import SearchResults from "./components/Search.jsx";
import ProtectedRoute from "./components/ProtectedRoute.js";
import PaymentDetails from "./components/PaymentDetails.jsx";
import PaymentHistory from "./components/PaymentHistory.jsx";

const App = () => {
  const location = useLocation();

  // Define routes where navbar and footer should not be shown
  const hideNavAndFooterRoutes = ["/login", "/register"];

  const shouldHideNavAndFooter = hideNavAndFooterRoutes.includes(
    location.pathname
  );

  return (
    <div>
      <Banner />
      {!shouldHideNavAndFooter && <Navbar />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<Products />} />
        {/* <Route path="/price_predictions" element={<PricePredictions />} /> */}
        <Route path="/about" element={<About />} />
        <Route path="/products/:id" element={<Product />} />
        <Route
          path="/cart"
          element={
            <ProtectedRoute>
              <Cart />
            </ProtectedRoute>
          }
        />
        <Route path="/search" element={<SearchResults />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/checkout"
          element={
            <ProtectedRoute>
              <Checkout />
            </ProtectedRoute>
          }
        />
        <Route
          path="/payment-details/:paymentId"
          element={
            <ProtectedRoute>
              <PaymentDetails />
            </ProtectedRoute>
          }
        />
        <Route
          path="/payment-history"
          element={
            <ProtectedRoute>
              <PaymentHistory />
            </ProtectedRoute>
          }
        />
      </Routes>
      {!shouldHideNavAndFooter && <Footer />}
    </div>
  );
};

export default App;
