import React, { useEffect, useState } from "react";
import { ListGroup, Spinner } from "react-bootstrap";
import StarRatings from "react-star-ratings"; // For displaying star ratings

const Reviews = ({ productId }) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await fetch(
          `http://localhost:8000/api/reviews/product/${productId}`, // Fetch reviews by productId
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`, // Buyer authentication token
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch reviews");
        }

        const data = await response.json();
        setReviews(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [productId]);

  if (loading) {
    return <Spinner animation="border" role="status" />;
  }

  if (error) {
    return <p>{error}</p>;
  }

  if (reviews.length === 0) {
    return <p>No reviews available for this product.</p>;
  }

  return (
    <div className="reviews-section">
      <h4>Customer Reviews</h4>
      <ListGroup>
        {reviews.map((review) => (
          <ListGroup.Item key={review.id}>
            <div className="review">
              <div className="review-header">
                <strong>Rating:</strong>
                <StarRatings
                  rating={review.rating}
                  starRatedColor="gold"
                  numberOfStars={5}
                  starDimension="20px"
                  starSpacing="2px"
                />
              </div>
              <p>{review.review}</p>
              <small>
                <strong>Reviewed by:</strong> {review.buyer_name} on{" "}
                {new Date(review.created_at).toLocaleDateString()}
              </small>
            </div>
          </ListGroup.Item>
        ))}
      </ListGroup>
    </div>
  );
};

export default Reviews;
