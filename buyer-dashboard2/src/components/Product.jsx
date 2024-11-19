import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { addToCart } from "../redux/action";
import Skeleton from "react-loading-skeleton";
import { NavLink, useParams, useNavigate } from "react-router-dom";
import ChatBox from "./ChatBox"; // Import the ChatBox component
import Reviews from "./Reviews";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button"; // Bootstrap components for the modal

const Product = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false); // State for modal visibility
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const isAuthenticated = () => {
    return !!localStorage.getItem("token");
  };

  const handleCloseModal = () => setShowModal(false); // Function to close the modal
  const handleShowModal = () => setShowModal(true); // Function to show the modal

  const addProduct = (product) => {
    if (product.stock_status === "Out of Stock") {
      handleShowModal(); // Show the modal if the product is out of stock
      return;
    }

    if (isAuthenticated()) {
      dispatch(addToCart(product));
    } else {
      navigate("/login");
    }
  };

  useEffect(() => {
    if (!id) {
      console.error("Product ID is not defined.");
      return;
    }

    const getProduct = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(
          `http://localhost:8000/api/buyer/products/${id}`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch product details");
        }

        const productData = await response.json();
        setProduct(productData);
      } catch (err) {
        console.error("Error fetching product:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    getProduct();
  }, [id]);

  const Loading = () => {
    return (
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
  };

  const ShowProduct = () => {
    if (!product) return null;

    return (
      <>
        <div className="col-md-6">
          <img
            src={`http://localhost:8000/${product.file_path}`} // Dynamic image source
            alt={product.name}
            height="400px"
            width="500px"
          />
        </div>
        <div className="col-md-6">
          <h1 className="display-5">{product.name} Maize</h1>
          <h3 className="display-6 fw-bold my-4">ksh {product.price}</h3>
          <p className="lead">{product.quantity} Kgs</p>
          <p className="lead">{product.description}</p>
          {product.stock_status === "Out of Stock" && (
            <p className="card-text" style={{ color: "red" }}>
              {product.stock_status}
            </p>
          )}
          <button
            className="btn btn-outline-dark px-4 py-2"
            onClick={() => addProduct(product)}
          >
            Add to Cart
          </button>
          <NavLink to="/cart" className="btn btn-dark ms-2 px-3 py-2">
            Go to Cart
          </NavLink>
        </div>
      </>
    );
  };

  return (
    <div>
      <div className="container py-5">
        <div className="row py-4 md-5">
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
        {/* Conditionally render the Reviews component after product data is available */}
        {product && <Reviews productId={product.id} />}
      </div>
      <br />
      <hr />
      {/* Modal to show out-of-stock warning */}
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
    </div>
  );
};

export default Product;
