import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const [userData, setUserData] = useState({});
  const [deliveryZones, setDeliveryZones] = useState([]);
  const [deliveryLocations, setDeliveryLocations] = useState([]);
  const [isEditing, setIsEditing] = useState(false); // For edit form visibility
  const [editedUserData, setEditedUserData] = useState({
    name: "",
    phone: "",
    email: "",
  });
  const [profileImage, setProfileImage] = useState(null); // For image upload

  const navigate = useNavigate();

  // Fetch profile and related data using Fetch API
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        // Fetch user profile
        const userResponse = await fetch(
          "https://www.maizeai.me/api/user/profile",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        const userData = await userResponse.json();
        setUserData(userData.user);
        setEditedUserData({
          name: userData.user.name || "",
          phone: userData.user.phone || "",
          email: userData.user.email || "",
        });
      } catch (error) {
        console.error("Error fetching profile data", error);
      }
    };

    fetchUserProfile();
  }, []);

  // Handle form input change for editing
  const handleInputChange = (e) => {
    setEditedUserData({
      ...editedUserData,
      [e.target.name]: e.target.value,
    });
  };

  // Handle image upload
  const handleImageChange = (e) => {
    setProfileImage(e.target.files[0]);
  };

  // Submit edited profile including the image upload
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", editedUserData.name);
    formData.append("email", editedUserData.email);
    formData.append("phone", editedUserData.phone);
    if (profileImage) {
      formData.append("photo", profileImage); // Append image to the form data with key "photo"
    }

    try {
      const response = await fetch(
        "https://www.maizeai.me/api/user/update-profile",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: formData,
        }
      );
      const result = await response.json();
      if (response.ok) {
        setUserData({
          ...userData,
          ...editedUserData,
          file_path: result.file_path,
        });
        setIsEditing(false); // Hide edit form after submission
      } else {
        console.error(result.message);
      }
    } catch (error) {
      console.error("Error updating profile", error);
    }
  };

  return (
    <div className="profile-page">
      <h1>Your Profile</h1>
      <div>
        <img
          src={userData.file_path || "/default-avatar.png"} // Show default if no image
          alt="Profile"
          style={{ width: 100, height: 100, objectFit: "cover" }}
        />
        <p>Name: {userData.name}</p>
        <p>Email: {userData.email}</p>
        <p>Phone: {userData.phone}</p>
      </div>

      <h2>Delivery Zones</h2>
      <ul>
        {deliveryZones.map((zone) => (
          <li key={zone.id}>{zone.zone_name}</li>
        ))}
      </ul>

      <h2>Delivery Locations</h2>
      <ul>
        {deliveryLocations.map((location) => (
          <li key={location.id}>
            {location.location_name} (Fee: {location.delivery_fee})
          </li>
        ))}
      </ul>

      <button onClick={() => setIsEditing(true)}>Edit Profile</button>

      {isEditing && (
        <div className="edit-form" style={editFormStyles}>
          <form onSubmit={handleEditSubmit} encType="multipart/form-data">
            <div>
              <label>Name:</label>
              <input
                type="text"
                name="name"
                value={editedUserData.name}
                onChange={handleInputChange}
                required
              />
            </div>
            <div>
              <label>Email:</label>
              <input
                type="email"
                name="email"
                value={editedUserData.email}
                onChange={handleInputChange}
                required
              />
            </div>
            <div>
              <label>Phone:</label>
              <input
                type="text"
                name="phone"
                value={editedUserData.phone}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <label>Profile Image:</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
              />
            </div>
            <div>
              <button type="submit">Save</button>
              <button type="button" onClick={() => setIsEditing(false)}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

// Simple styles for the edit form, to be displayed on top of the profile page
const editFormStyles = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  backgroundColor: "#fff",
  padding: "20px",
  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
  zIndex: 1000,
};

export default Profile;
