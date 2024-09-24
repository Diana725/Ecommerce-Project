import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { addToCart } from "../redux/action";
import Skeleton from "react-loading-skeleton";
import { NavLink, useParams, useNavigate } from "react-router-dom";
import ChatBox from "./ChatBox"; // Import the ChatBox component

const Product = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const isAuthenticated = () => {
    return !!localStorage.getItem("token");
  };

  const addProduct = (product) => {
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

    const farmerId = product.user_id; // Get the farmer ID from the product data

    return (
      <>
        <div className="col-md-6">
          <img
            src={`http://localhost:8000/${product.file_path}`} // Dynamic image source
            alt={product.name}
            height="400px"
            width="400px"
          />
        </div>
        <div className="col-md-6">
          <h1 className="display-5">{product.name}</h1>
          <h3 className="display-6 fw-bold my-4">ksh {product.price}</h3>
          <p className="lead">{product.quantity} Kgs</p>
          <button
            className="btn btn-outline-dark px-4 py-2"
            onClick={() => addProduct(product)}
          >
            Add to Cart
          </button>
          <NavLink to="/cart" className="btn btn-dark ms-2 px-3 py-2">
            Go to Cart
          </NavLink>
          {/* Pass the product ID to the ChatBox */}
          <div className="mt-4">
            <ChatBox productId={product.id} /> {/* Pass product ID */}
          </div>
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
      <hr />
    </div>
  );
};

export default Product;
