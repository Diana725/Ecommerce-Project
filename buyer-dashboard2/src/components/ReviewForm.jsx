import React, { useState } from "react";

const ReviewForm = ({ sellerId, productId, onReviewSubmit }) => {
  const [rating, setRating] = useState(1);
  const [review, setReview] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const userInfo = JSON.parse(localStorage.getItem("user-info"));
    if (!userInfo) {
      alert("User is not logged in. Please log in to submit a review.");
      return;
    }

    const buyerId = userInfo.id; // Retrieve buyer ID from localStorage
    const token = userInfo.token; // Assuming the token is stored in user-info object

    const response = await fetch("https://www.maizeai.me/api/reviews", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`, // Add token to headers
      },
      body: JSON.stringify({
        buyer_id: buyerId,
        seller_id: sellerId,
        product_id: productId,
        rating,
        review,
      }),
    });

    if (response.ok) {
      alert("Review submitted successfully!");
      setRating(1);
      setReview("");
      onReviewSubmit(); // Trigger the prop function to refresh the reviews
    } else {
      const errorData = await response.json();
      console.error("Failed to submit review:", errorData);
      alert("Failed to submit review. Please check your input.");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Rating (1 to 5):</label>
        <input
          type="number"
          min="1"
          max="5"
          value={rating}
          onChange={(e) => setRating(e.target.value)}
          required
        />
      </div>
      <div>
        <label>Review:</label>
        <textarea value={review} onChange={(e) => setReview(e.target.value)} />
      </div>
      <button type="submit">Submit Review</button>
    </form>
  );
};

export default ReviewForm;
