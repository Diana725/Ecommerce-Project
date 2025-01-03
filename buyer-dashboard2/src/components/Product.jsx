import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { addToCart } from "../redux/action";
import Skeleton from "react-loading-skeleton";
import { NavLink, useParams, useNavigate } from "react-router-dom";
import ChatBox from "./ChatBox";
import Reviews from "./Reviews";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";

const Product = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [farmerProfile, setFarmerProfile] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showFarmerModal, setShowFarmerModal] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const isAuthenticated = () => !!localStorage.getItem("token");

  const handleCloseModal = () => setShowModal(false);
  const handleShowModal = () => setShowModal(true);

  const handleCloseFarmerModal = () => setShowFarmerModal(false);
  const handleShowFarmerModal = () => {
    fetchFarmerProfile();
    setShowFarmerModal(true);
  };

  const addProduct = (product) => {
    if (product.stock_status === "Out of Stock") {
      handleShowModal();
      return;
    }
    if (isAuthenticated()) {
      dispatch(addToCart(product));
    } else {
      navigate("/login");
    }
  };

  const goToCart = () => {
    if (isAuthenticated()) {
      navigate("/cart");
    } else {
      navigate("/login");
    }
  };

  // Fetch product details
  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `https://www.maizeai.me/api/buyer/products/${id}`
        );
        if (!response.ok) throw new Error("Failed to fetch product details");

        const productData = await response.json();
        setProduct(productData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  // Fetch farmer profile
  const fetchFarmerProfile = async () => {
    try {
      const response = await fetch(
        `https://www.maizeai.me/api/products/${id}/farmer-profile`
      );
      if (!response.ok) throw new Error("Failed to fetch farmer profile");

      const profileData = await response.json();
      setFarmerProfile(profileData);
    } catch (err) {
      console.error("Error fetching farmer profile:", err);
    }
  };

  const Loading = () => (
    <>
      <div className="col-md-6">
        <Skeleton height={400} />
      </div>
      <div className="col-md-6" style={{ lineHeight: 2 }}>
        <Skeleton height={75} />
        <Skeleton height={25} width={300} />
        <Skeleton height={50} />
        <Skeleton height={150} />
        <Skeleton height={50} width={100} />
        <Skeleton height={50} width={100} style={{ marginLeft: 6 }} />
      </div>
    </>
  );

  const ShowProduct = () => (
    <>
      <div className="col-md-6">
        <img
          src={`https://www.maizeai.me/${product.file_path}`}
          alt={product.name}
          height="400px"
          width="500px"
        />
      </div>
      <div className="col-md-6">
        <h1 className="display-5">{product.name} Maize</h1>
        <h3 className="display-6 fw-bold my-4">Ksh {product.price}</h3>
        <p className="lead">{product.quantity} Kgs</p>
        <p className="lead">{product.description}</p>
        {product.stock_status === "Out of Stock" && (
          <p className="card-text text-danger">{product.stock_status}</p>
        )}
        <button
          className="btn btn-outline-dark px-4 py-2"
          onClick={() => addProduct(product)}
        >
          Add to Cart
        </button>
        <button className="btn btn-dark ms-2 px-3 py-2" onClick={goToCart}>
          Go to Cart
        </button>
        <button
          className="btn btn-info ms-2 px-3 py-2"
          onClick={handleShowFarmerModal}
        >
          View Farmer Profile
        </button>
      </div>
      <hr />
    </>
  );

  return (
    <div>
      <div className="container py-5">
        <div className="row py-4">
          {loading ? (
            <Loading />
          ) : error ? (
            <div className="alert alert-danger" role="alert">
              {error}
            </div>
          ) : (
            <ShowProduct />
          )}
        </div>
      </div>

      <div className="container">
        <hr />
        {product && <Reviews productId={product.id} />}
      </div>

      {/* Out of Stock Modal */}
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Product Out of Stock</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          This product is currently out of stock and cannot be added to the
          cart.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Farmer Profile Modal */}
      <Modal show={showFarmerModal} onHide={handleCloseFarmerModal}>
        <Modal.Header closeButton>
          <Modal.Title>Farmer Profile</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {farmerProfile ? (
            <>
              <h5>Name: {farmerProfile.name}</h5>
              <p>Phone Number: {farmerProfile.phone}</p>
              <p>Email: {farmerProfile.email}</p>

              <h6>Delivery Zones:</h6>
              {farmerProfile.delivery_zones.length > 0 ? (
                <ul>
                  {farmerProfile.delivery_zones.map((zone) => (
                    <li key={zone.id}>
                      <strong>Zone Name:</strong> {zone.zone_name}
                      <ul>
                        {zone.delivery_locations.length > 0 ? (
                          zone.delivery_locations.map((location) => (
                            <li key={location.id}>
                              <strong>Location:</strong>{" "}
                              {location.location_name} - <strong>Fee:</strong>{" "}
                              Ksh {location.delivery_fee}
                            </li>
                          ))
                        ) : (
                          <li>No delivery locations available.</li>
                        )}
                      </ul>
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No delivery zones available.</p>
              )}
            </>
          ) : (
            <p>Loading farmer profile...</p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseFarmerModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Product;
