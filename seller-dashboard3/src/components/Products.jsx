import React, { useState, useEffect } from "react";
import { Table } from "react-bootstrap";
import { Link } from "react-router-dom";

const ProductList = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    getData();
  }, []);

  // Fetch the list of products from the API
  async function getData() {
    const token = localStorage.getItem("token"); // Retrieve the token from local storage

    let result = await fetch("http://localhost:8000/api/list", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // Include the token in the request headers
      },
    });

    result = await result.json();
    setData(result);
  }

  // Function to delete a product
  async function deleteOperation(id) {
    const token = localStorage.getItem("token"); // Retrieve the token from local storage

    let result = await fetch(`http://localhost:8000/api/delete/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // Include the token in the request headers
      },
    });

    result = await result.json();
    console.warn(result);
    getData(); // Refresh the product list after deletion
  }

  return (
    <div>
      <h1>Product Listing</h1>
      <Table className="product-table">
        <thead>
          <tr>
            <td>Name</td>
            <td>Price in Kshs</td>
            <td>Quantity in Kgs</td>
            <td>Image</td>
            <td>Delete Item</td>
            <td>Update Item</td>
            <td>Payment Method</td>
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr key={item.id}>
              <td>{item.name}</td>
              <td>{item.price}</td>
              <td>{item.quantity}</td>
              <td>
                <img
                  style={{ width: 300 }}
                  src={"http://localhost:8000/" + item.file_path}
                  alt={item.name}
                />
              </td>
              <td>
                <button
                  onClick={() => deleteOperation(item.id)}
                  className="delete"
                >
                  Delete
                </button>
              </td>
              <td>
                <Link to={"/update/" + item.id}>
                  <button className="update">Update</button>
                </Link>
              </td>
              <td>{item.payment_method}</td>
            </tr>
          ))}
        </tbody>
      </Table>
      <hr />
    </div>
  );
};

export default ProductList;
