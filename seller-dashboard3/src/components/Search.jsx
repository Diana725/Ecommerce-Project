import React, { useState, useEffect } from "react";
import { useLocation, NavLink, useNavigate } from "react-router-dom";
import Skeleton from "react-loading-skeleton";

const SearchResults = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const navigate = useNavigate(); // Hook for navigation

  const query = new URLSearchParams(location.search).get("query");

  useEffect(() => {
    const fetchSearchResults = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          `http://localhost:8000/api/search/${encodeURIComponent(query)}`,
          {
            headers: {
              Authorization: `Bearer ${token}`, // Use the token obtained from login
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

  // Delete product
  const deleteOperation = async (id) => {
    const token = localStorage.getItem("token");
    try {
      let result = await fetch(`http://localhost:8000/api/delete/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      result = await result.json();
      console.warn(result);

      // Remove deleted product from state
      setResults(results.filter((product) => product.id !== id));
    } catch (error) {
      console.error("Error deleting product:", error);
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
                  src={`http://localhost:8000/${product.file_path}`}
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
                  <button
                    className="btn btn-primary me-2"
                    onClick={() => navigate(`/update/${product.id}`)}
                  >
                    Update
                  </button>

                  {/* Delete Button */}
                  <button
                    className="btn btn-danger"
                    onClick={() => deleteOperation(product.id)}
                  >
                    Delete
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
    </div>
  );
};

export default SearchResults;
