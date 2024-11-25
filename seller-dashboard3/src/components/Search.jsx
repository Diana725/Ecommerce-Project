import React, { useState, useEffect } from "react";
import { useLocation, NavLink, useNavigate } from "react-router-dom";
import Skeleton from "react-loading-skeleton";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import "./ProductList.css";

const SearchResults = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [productAverageRating, setProductAverageRating] = useState(0);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [productToMarkOutOfStock, setProductToMarkOutOfStock] = useState(null);

  const location = useLocation();
  const navigate = useNavigate(); // Hook for navigation

  const query = new URLSearchParams(location.search).get("query");

  useEffect(() => {
    const fetchSearchResults = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          `https://www.maizeai.me/api/search/${encodeURIComponent(query)}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setResults(data);
      } catch (error) {
        console.error("Error fetching search results:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSearchResults();
  }, [query]);

  // Fetch reviews for a product
  async function fetchReviews(productId) {
    const token = localStorage.getItem("token");

    try {
      const result = await fetch(
        `https://www.maizeai.me/api/product/${productId}/reviews`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const reviewsData = await result.json();
      setReviews(reviewsData);
      calculateProductRating(reviewsData);
      setShowModal(true); // Open modal to show reviews
    } catch (error) {
      console.error("Error fetching reviews:", error);
    }
  }

  // Calculate average rating for the current product
  function calculateProductRating(reviews) {
    let totalRating = 0;

    reviews.forEach((review) => {
      totalRating += review.rating;
    });

    const average =
      reviews.length > 0 ? (totalRating / reviews.length).toFixed(2) : 0;
    setProductAverageRating(average);
  }

  // Mark product as out of stock
  async function markOutOfStock(id) {
    const token = localStorage.getItem("token");

    try {
      const result = await fetch(
        `https://www.maizeai.me/api/product/${id}/out-of-stock`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (result.ok) {
        setProductToMarkOutOfStock(null); // Reset after marking
        setShowConfirmModal(false); // Close modal after marking out of stock
      }
    } catch (error) {
      console.error("Error marking product as out of stock:", error);
    }
  }

  // Open confirmation modal for marking out of stock
  const handleOutOfStockClick = (product) => {
    setProductToMarkOutOfStock(product);
    setShowConfirmModal(true); // Open the confirmation modal
  };

  const confirmMarkOutOfStock = () => {
    if (productToMarkOutOfStock) {
      markOutOfStock(productToMarkOutOfStock.id);
    }
  };

  return (
    <div className="container my-4">
      <h1 className="display-6 fw-bolder text-center">
        Search Results for "{query}"
      </h1>
      <hr />
      <div className="row">
        {loading ? (
          <Skeleton height={350} />
        ) : results.length > 0 ? (
          results.map((product) => (
            <div className="col-md-3 mb-4" key={product.id}>
              <div className="card h-100 text-center p-4">
                <img
                  src={`https://www.maizeai.me/${product.file_path}`}
                  className="card-img-top"
                  alt={product.name}
                  height="250px"
                />
                <div className="card-body">
                  <h5 className="card-title mb-0">
                    {product.name.substring(0, 12)}...
                  </h5>
                  <p className="card-title mb-0 lead fw-bold">
                    {product.quantity} Kgs
                  </p>
                  <p className="card-text lead fw-bold">ksh{product.price}</p>

                  {/* Update Button */}
                  {/* <button
                    className="update mb-2"
                    onClick={() => navigate(`/update/${product.id}`)}
                  >
                    Update
                  </button> */}
                  <br />
                  {/* Show Reviews Button */}
                  <button
                    className="show-reviews-btn mb-2"
                    onClick={() => fetchReviews(product.id)}
                  >
                    Show Reviews
                  </button>

                  {/* Mark Out of Stock Button */}
                  <button
                    onClick={() => handleOutOfStockClick(product)}
                    className={`out-of-stock-btn ${
                      product.stock_status === "Out of Stock" ? "disabled" : ""
                    }`}
                    disabled={product.stock_status === "Out of Stock"}
                  >
                    {product.stock_status === "Out of Stock"
                      ? "Marked as Out of Stock"
                      : "Mark Out of Stock"}
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-12">
            <p className="text-center">No results found for "{query}".</p>
          </div>
        )}
      </div>

      {/* Modal to show reviews */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Reviews</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <h4>Average Rating: {productAverageRating} stars</h4>
          {reviews.length > 0 ? (
            <ul>
              {reviews.map((review) => (
                <li key={review.id}>
                  <strong>
                    {review.buyer ? review.buyer.name : "Anonymous"}:
                  </strong>{" "}
                  {review.review} ({review.rating} stars)
                </li>
              ))}
            </ul>
          ) : (
            <p>No reviews available for this product.</p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Confirmation Modal to mark product as out of stock */}
      <Modal show={showConfirmModal} onHide={() => setShowConfirmModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Mark Out of Stock</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to mark{" "}
          <strong>{productToMarkOutOfStock?.name}</strong> as out of stock?
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setShowConfirmModal(false)}
          >
            Cancel
          </Button>
          <Button variant="danger" onClick={confirmMarkOutOfStock}>
            Yes, Mark Out of Stock
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default SearchResults;
