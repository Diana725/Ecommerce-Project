import React, { useState, useEffect } from "react";
import axios from "axios";

const SellerChatbox = ({ sellerId, buyerId, productId }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  const fetchMessages = async () => {
    try {
      const response = await axios.get(`/api/seller/messages/${sellerId}`);
      setMessages(response.data);
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    try {
      const messageData = {
        message: newMessage,
        buyer_id: buyerId, // ID of the buyer
        product_id: productId, // ID of the product
      };

      await axios.post("/api/seller/messages", messageData); // Send message as a seller
      setNewMessage(""); // Clear input field after sending
      fetchMessages(); // Refresh messages after sending
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  return (
    <div className="chatbox">
      <div className="chatbox-messages">
        {messages.map((msg, index) => (
          <div key={index} className={msg.seller_id ? "sent" : "received"}>
            <p>{msg.message}</p>
            <small>{new Date(msg.created_at).toLocaleTimeString()}</small>
          </div>
        ))}
      </div>

      <form className="chatbox-input" onSubmit={handleSendMessage}>
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type your message..."
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
};

export default SellerChatbox;
