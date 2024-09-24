import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

const UpdateProduct = () => {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");

  const { id } = useParams(); // Get the product ID from the URL
  const navigate = useNavigate();

  useEffect(() => {
    getProductDetails();
  }, []);

  const getProductDetails = async () => {
    const token = localStorage.getItem("token");
    let result = await fetch(`http://localhost:8000/api/product/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    result = await result.json();
    setName(result.name);
    setPrice(result.price);
    setQuantity(result.quantity);
  };

  // Function to update the product details
  const updateProduct = async () => {
    const token = localStorage.getItem("token"); // Retrieve the token from local storage

    // Prepare form data for file upload
    const formData = new FormData();
    formData.append("name", name);
    formData.append("price", price);
    formData.append("quantity", quantity);

    // Only append the file if it's provided
    if (file) {
      formData.append("file_path", file); // Ensure correct key name
    }

    let result = await fetch(`http://localhost:8000/api/update/${id}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    if (result.ok) {
      alert("Product updated successfully!");
      navigate("/products"); // Redirect to product listing page after successful update
    } else {
      const errorData = await result.json();
      setMessage(errorData.message || "Failed to update product.");
    }
  };

  // Call the updateProduct function on form submit
  const handleUpdate = (e) => {
    e.preventDefault();
    updateProduct();
  };

  return (
    <div>
      <h1>Update Product</h1>
      {message && <div className="alert alert-danger">{message}</div>}
      <form onSubmit={handleUpdate}>
        <div className="col-sm-6 offset-sm-3">
          <label>Name:</label>
          <input
            type="text"
            className="form-control"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <br />
        <div className="col-sm-6 offset-sm-3">
          <label>Price:</label>
          <input
            className="form-control"
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
        </div>
        <br />
        <div className="col-sm-6 offset-sm-3">
          <label>Quantity:</label>
          <input
            type="number"
            value={quantity}
            className="form-control"
            onChange={(e) => setQuantity(e.target.value)}
          />
        </div>
        <br />
        <div className="col-sm-6 offset-sm-3">
          <label>Image:</label>
          <input
            type="file"
            className="form-control"
            onChange={(e) => setFile(e.target.files[0])}
          />
        </div>
        <br />
        <button type="submit" className="btn btn-primary offset-sm-3">
          Update Product
        </button>
      </form>
    </div>
  );
};

export default UpdateProduct;
