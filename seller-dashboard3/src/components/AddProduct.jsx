import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Spinner, Button, Modal } from "react-bootstrap";

const AddProduct = () => {
  const [name, setName] = useState("");
  const [file, setFile] = useState(null);
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [description, setDescription] = useState("");
  const [payment_method, setPaymentMethod] = useState("");

  // States to track errors, loading status, and preview functionality
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);

  const navigate = useNavigate();

  // Function to validate all fields
  const validateFields = () => {
    let validationErrors = {};

    if (!name) validationErrors.name = "Please select a Maize Seed Variety.";
    if (!file) validationErrors.file = "Please upload a file.";
    if (!price) validationErrors.price = "Please enter a price.";
    if (!quantity) validationErrors.quantity = "Please enter a quantity.";
    if (!description)
      validationErrors.description = "Please enter a description.";
    if (!payment_method)
      validationErrors.payment_method = "Please enter a payment method.";

    return validationErrors;
  };

  // Handle file input and set preview
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);

      // Generate a preview URL for the image
      const reader = new FileReader();
      reader.onload = () => setPreviewImage(reader.result);
      reader.readAsDataURL(selectedFile);
    }
  };

  // Function to handle Add Product action
  const handleAddProduct = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("You must be logged in to add a product.");
      return;
    }

    setLoading(true); // Show loading spinner

    const formData = new FormData();
    formData.append("name", name);
    formData.append("price", price);
    formData.append("quantity", quantity);
    formData.append("file", file);
    formData.append("payment_method", payment_method);
    formData.append("description", description);

    try {
      let result = await fetch("https://www.maizeai.me/api/addProduct", {
        method: "POST",
        body: formData,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (result.ok) {
        const data = await result.json();
        alert(data.message || "Product has been added successfully!");
        navigate("/products");
      } else {
        const errorText = await result.text();
        throw new Error(errorText);
      }
    } catch (error) {
      console.error("Error:", error.message);
      alert("Failed to add product. Please check the console for details.");
    } finally {
      setLoading(false); // Hide loading spinner
    }
  };

  // Function to handle submission flow
  const handleSubmit = () => {
    const validationErrors = validateFields();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setShowModal(true); // Show modal for confirmation
  };

  return (
    <div>
      <div className="col-sm-6 offset-sm-3">
        <br />
        <select
          value={name}
          onChange={(e) => setName(e.target.value)}
          className={`form-control ${errors.name ? "is-invalid" : ""}`}
          required
        >
          <option value="">Select Maize Seed Variety</option>
          <option value="Traditional">Traditional Maize</option>
          <option value="White">White Maize</option>
          <option value="Yellow">Yellow Maize</option>
          <option value="URI">URI Maize</option>
        </select>
        {errors.name && <div className="invalid-feedback">{errors.name}</div>}
        <br />

        <input
          type="file"
          className={`form-control ${errors.file ? "is-invalid" : ""}`}
          onChange={handleFileChange}
        />
        {errors.file && <div className="invalid-feedback">{errors.file}</div>}
        <br />

        <input
          type="text"
          className={`form-control ${errors.price ? "is-invalid" : ""}`}
          onChange={(e) => setPrice(e.target.value)}
          placeholder="Price in Ksh"
        />
        {errors.price && <div className="invalid-feedback">{errors.price}</div>}
        <br />

        <input
          type="text"
          className={`form-control ${errors.quantity ? "is-invalid" : ""}`}
          onChange={(e) => setQuantity(e.target.value)}
          placeholder="Quantity in Kgs per Item"
        />
        {errors.quantity && (
          <div className="invalid-feedback">{errors.quantity}</div>
        )}
        <br />

        <input
          type="text"
          className={`form-control ${errors.description ? "is-invalid" : ""}`}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Enter Product Description eg. Grown in..."
        />
        {errors.description && (
          <div className="invalid-feedback">{errors.description}</div>
        )}
        <br />

        <input
          type="text"
          className={`form-control ${
            errors.payment_method ? "is-invalid" : ""
          }`}
          onChange={(e) => setPaymentMethod(e.target.value)}
          placeholder="Enter Your Preferred Payment Method"
        />
        {errors.payment_method && (
          <div className="invalid-feedback">{errors.payment_method}</div>
        )}
        <br />

        <Button
          onClick={handleSubmit}
          className="btn btn-primary"
          disabled={loading}
        >
          {loading ? (
            <>
              <Spinner animation="border" size="sm" role="status" /> Adding...
            </>
          ) : (
            "Add Product"
          )}
        </Button>
      </div>
      <br />
      <hr />

      {/* Confirmation Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Product Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
            <strong>Name:</strong> {name} Maize
          </p>
          <p>
            <strong>Price:</strong> {price}
          </p>
          <p>
            <strong>Quantity:</strong> {quantity}
          </p>
          <p>
            <strong>Description:</strong> {description}
          </p>
          <p>
            <strong>Payment Method:</strong> {payment_method}
          </p>
          {previewImage && (
            <div>
              <strong>Image Preview:</strong>
              <br />
              <img
                src={previewImage}
                alt="Preview"
                style={{
                  width: "100%",
                  maxHeight: "200px",
                  objectFit: "contain",
                }}
              />
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={() => {
              setShowModal(false);
              handleAddProduct();
            }}
          >
            Confirm
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default AddProduct;
