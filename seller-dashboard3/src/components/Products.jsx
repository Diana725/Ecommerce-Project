import React, { useState, useEffect } from "react";
import { Table, Modal, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import "./ProductList.css"; // Add a CSS file for custom styling

const ProductList = () => {
  const [data, setData] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);
  const [overallRating, setOverallRating] = useState({
    average: 0,
    totalReviews: 0,
  });
  const [productAverageRating, setProductAverageRating] = useState(0);
  const [showConfirmModal, setShowConfirmModal] = useState(false); // Confirmation modal state
  const [productToMarkOutOfStock, setProductToMarkOutOfStock] = useState(null); // Product to be marked out of stock

  useEffect(() => {
    getData();
  }, []);

  // Fetch the list of products from the API
  async function getData() {
    const token = localStorage.getItem("token");

    let result = await fetch("http://localhost:8000/api/list", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    result = await result.json();
    setData(result);

    // Calculate overall rating for all products
    calculateOverallRating(result);
  }

  // Calculate overall star rating for all products
  function calculateOverallRating(products) {
    let totalRating = 0;
    let totalReviews = 0;

    products.forEach((product) => {
      if (product.reviews && product.reviews.length > 0) {
        product.reviews.forEach((review) => {
          totalRating += review.rating;
        });
        totalReviews += product.reviews.length;
      }
    });

    const average =
      totalReviews > 0 ? (totalRating / totalReviews).toFixed(2) : 0;
    setOverallRating({ average, totalReviews });
  }

  // Fetch reviews for a specific product
  async function fetchReviews(productId) {
    const token = localStorage.getItem("token");

    let result = await fetch(
      `http://localhost:8000/api/product/${productId}/reviews`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    result = await result.json();
    setReviews(result);
    setShowModal(true); // Open modal to show reviews
    setCurrentProduct(productId);

    // Calculate average rating for the current product
    calculateProductRating(result);
  }

  // Calculate average star rating for the selected product
  function calculateProductRating(reviews) {
    let totalRating = 0;

    reviews.forEach((review) => {
      totalRating += review.rating;
    });

    const average =
      reviews.length > 0 ? (totalRating / reviews.length).toFixed(2) : 0;
    setProductAverageRating(average);
  }

  // Function to mark a product as out of stock
  // Function to mark a product as out of stock
  async function markOutOfStock(id) {
    const token = localStorage.getItem("token");

    let result = await fetch(
      `http://localhost:8000/api/product/${id}/out-of-stock`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (result.ok) {
      // Update product status in state to reflect the change
      const updatedData = data.map((product) => {
        if (product.id === id) {
          return { ...product, stock_status: "Out of Stock" }; // Update stock status
        }
        return product;
      });

      setData(updatedData); // Update the data state with the modified product status
      setShowConfirmModal(false); // Close the modal after marking out of stock
    }
  }

  // Open the confirmation modal when clicking "Mark Out of Stock"
  const handleOutOfStockClick = (product) => {
    setProductToMarkOutOfStock(product);
    setShowConfirmModal(true); // Open the confirmation modal
  };

  // Confirm the action to mark as out of stock
  const confirmMarkOutOfStock = () => {
    if (productToMarkOutOfStock) {
      markOutOfStock(productToMarkOutOfStock.id);
    }
  };

  return (
    <div>
      {/* Display overall star rating for all products */}
      <div className="overall-rating">
        <h3>
          Overall Rating: {overallRating.average} stars (from{" "}
          {overallRating.totalReviews} reviews)
        </h3>
      </div>
      <h1>Your Products:</h1>
      <hr />
      <Table className="product-table" style={{ fontSize: 14 }}>
        <thead>
          <tr>
            <td>#</td>
            <td>Name</td>
            <td>Price in Kshs</td>
            <td>Quantity in Kgs per Item</td>
            <td>Description</td>
            <td>Image</td>
            <td>Update Item</td>
            <td>Show Reviews</td>
            <td>Mark Out of Stock</td>
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr key={item.id}>
              <td className="fw-bold">{index + 1}</td> {/* Row number */}
              <td>{item.name} Maize</td>
              <td>{item.price}</td>
              <td>{item.quantity} Kgs per item</td>
              <td>
                {item.description} <br /> Payment: {item.payment_method}
              </td>
              <td>
                <img
                  style={{ width: 300, height: 250 }}
                  src={"http://localhost:8000/" + item.file_path}
                  alt={item.name}
                />
              </td>
              <td>
                <Link to={"/update/" + item.id}>
                  <button className="update">Update</button>
                </Link>
              </td>
              <td>
                <button
                  className="show-reviews-btn"
                  onClick={() => fetchReviews(item.id)}
                >
                  Show Reviews
                </button>
              </td>
              <td>
                <button
                  onClick={() => handleOutOfStockClick(item)} // Trigger confirmation modal
                  className={`out-of-stock-btn ${
                    item.stock_status === "Out of Stock" ? "disabled" : ""
                  }`}
                  disabled={item.stock_status === "Out of Stock"}
                >
                  {item.stock_status === "Out of Stock"
                    ? "Marked as Out of Stock"
                    : "Mark Out of Stock"}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      <br />
      <hr />

      {/* Modal to show product reviews */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Reviews for Product #{currentProduct}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {/* Display average rating for the current product */}
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

export default ProductList;
