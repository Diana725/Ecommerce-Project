import React, { useState, useEffect } from "react";
import { useLocation, NavLink } from "react-router-dom";
import Skeleton from "react-loading-skeleton";

const SearchResults = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  // Get the 'query' parameter from the URL (e.g., ?query=White+Maize)
  const query = new URLSearchParams(location.search).get("query");

  useEffect(() => {
    const fetchSearchResults = async () => {
      setLoading(true);
      try {
        // Make a GET request to the search API with the query
        const response = await fetch(
          `https://www.maizeai.me/api/buyer-search/${encodeURIComponent(query)}`
        );

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        // Parse the JSON response
        const data = await response.json();
        setResults(data); // Assuming the API returns the product array directly
      } catch (error) {
        console.error("Error fetching search results:", error);
      } finally {
        setLoading(false);
      }
    };

    // Only fetch results if there's a query present
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
                  src={`https://www.maizeai.me/${product.file_path}`} // Make sure 'file_path' contains the correct image URL
                  className="card-img-top"
                  alt={product.name}
                  height="250px"
                />
                <div className="card-body">
                  <h5 className="card-title mb-0">
                    {product.name.substring(0, 12)}...
                  </h5>
                  <p className="card-text lead fw-bold">ksh {product.price}</p>
                  <NavLink
                    to={`/products/${product.id}`}
                    className="btn btn-outline-dark"
                  >
                    View Product
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
