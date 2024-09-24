import React, { useEffect, useState } from "react";

const ReviewsList = ({ sellerId }) => {
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    const fetchReviews = async () => {
      const response = await fetch(
        `http://localhost:8000/api/reviews/seller/${sellerId}`
      );
      const data = await response.json();
      setReviews(data);
    };

    fetchReviews();
  }, [sellerId]);

  return (
    <div>
      <h3>Customer Reviews</h3>
      {reviews.length === 0 ? (
        <p>No reviews yet.</p>
      ) : (
        reviews.map((review) => (
          <div key={review.id}>
            <p>
              <strong>{review.buyer.name}</strong>: {review.rating} stars
            </p>
            <p>{review.review}</p>
          </div>
        ))
      )}
    </div>
  );
};

export default ReviewsList;
