import React, { useState, useEffect } from "react";
import Skeleton from "react-loading-skeleton";
import { NavLink } from "react-router-dom";
import "react-loading-skeleton/dist/skeleton.css"; // Import Skeleton CSS
import "./Products.css";

const Products = () => {
  const [data, setData] = useState([]);
  const [filter, setFilter] = useState([]);
  const [loading, setLoading] = useState(true); // Set default to true
  let componentMounted = true;

  useEffect(() => {
    const getProducts = async () => {
      setLoading(true);
      const response = await fetch("http://localhost:8000/api/buyer/products");
      if (componentMounted) {
        const products = await response.json();
        setData(products);
        setFilter(products);
        setLoading(false);
      }
      return () => {
        componentMounted = false;
      };
    };
    getProducts();
  }, []);

  const Loading = () => {
    // Skeleton placeholder for loading state
    return (
      <>
        <div className="col-md-3">
          <Skeleton height={350} />
        </div>
        <div className="col-md-3">
          <Skeleton height={350} />
        </div>
        <div className="col-md-3">
          <Skeleton height={350} />
        </div>
        <div className="col-md-3">
          <Skeleton height={350} />
        </div>
      </>
    );
  };

  const ShowProducts = () => {
    // Display products after loading
    return (
      <>
        {filter.map((product) => (
          <div className="col-md-3 mb-4" key={product.id}>
            <div className="card h-100 text-center p-4 product-card">
              <img
                src={"http://localhost:8000/" + product.file_path}
                className="card-img-top"
                alt={product.name}
                height="250px"
              />
              <div className="card-body">
                <h5 className="card-title mb-0">
                  {product.name.substring(0, 12)}
                </h5>
                <p className="card-text lead fw-bold mb-0">
                  ksh{product.price}
                </p>
                <p className="card-text lead fw-bold">{product.quantity} Kgs</p>
                {product.stock_status === "Out of Stock" && (
                  <p className="card-text" style={{ color: "red" }}>
                    {product.stock_status}
                  </p>
                )}

                <NavLink
                  to={`/products/${product.id}`}
                  className="btn btn-outline-dark"
                >
                  View Product
                </NavLink>
              </div>
            </div>
          </div>
        ))}
      </>
    );
  };

  return (
    <div>
      <div className="container my-2 py-3">
        <div className="row">
          <div className="col-12 mb-5">
            <h1 className="display-6 fw-bolder text-center">Products</h1>
            <hr />
          </div>
        </div>
        <div className="row justify-content-center">
          {loading ? <Loading /> : <ShowProducts />}
        </div>
        <hr />
      </div>
    </div>
  );
};

export default Products;
