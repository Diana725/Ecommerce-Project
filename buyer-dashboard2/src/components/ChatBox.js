import React, { useState } from "react";

const BuyerMessageForm = ({ productId }) => {
  const [message, setMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSendMessage = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");

    try {
      const response = await fetch(
        "https://www.maizeai.me/api/send-buyer-message",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            message,
            product_id: productId,
          }),
          mode: "no-cors", // Set to 'no-cors'
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Error sending message.");
      }

      setSuccessMessage("Message sent successfully");
      setMessage(""); // Clear message input after sending
      setErrorMessage(""); // Clear any previous error messages
    } catch (error) {
      if (error.response && error.response.status === 422) {
        const errors = error.response.data.errors;
        setErrorMessage(Object.values(errors).flat().join(", "));
      } else {
        setErrorMessage(
          error.message || "Error sending message. Please try again."
        );
      }
    }
  };

  return (
    <div className="message-form">
      <form onSubmit={handleSendMessage}>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Enter your message to the farmer..."
          required
        />
        <button type="submit">Send Message</button>
      </form>

      {successMessage && <p className="success-message">{successMessage}</p>}
      {errorMessage && <p className="error-message">{errorMessage}</p>}
    </div>
  );
};

export default BuyerMessageForm;
