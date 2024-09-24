import React, { useState, useEffect } from "react";
import { useLocation, NavLink } from "react-router-dom";
import Skeleton from "react-loading-skeleton";

// import "./SearchResults.css"; // Add custom styles if needed

const SearchResults = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  const query = new URLSearchParams(location.search).get("query");

  useEffect(() => {
    const fetchSearchResults = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `http://localhost:8000/api/buyerSearch?query=${encodeURIComponent(
            query
          )}`
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setResults(data.products); // Ensure you're accessing the 'products' property of the response data
      } catch (error) {
        console.error("Error fetching search results:", error);
      } finally {
        setLoading(false);
      }
    };

    if (query) {
      fetchSearchResults();
    }
  }, [query]);

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
                  <p className="card-text lead fw-bold">ksh{product.price}</p>
                  <NavLink
                    to={`/products/${product.id}`}
                    className="btn btn-outline-dark"
                  >
                    Buy Now
                  </NavLink>
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
