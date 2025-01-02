import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

const Profile = () => {
  const [userData, setUserData] = useState({});
  const [deliveryZones, setDeliveryZones] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editedUserData, setEditedUserData] = useState({
    name: "",
    phone: "",
    email: "",
  });
  const [profileImage, setProfileImage] = useState(null); // For image upload

  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const userResponse = await fetch(
          "https://www.maizeai.me/api/user/profile",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        const data = await userResponse.json();
        setUserData({
          name: data.name,
          email: data.email,
          phone: data.phone,
          photo: data.photo,
        });
        setEditedUserData({
          name: data.name || "",
          phone: data.phone || "",
          email: data.email || "",
        });
        setDeliveryZones(data.delivery_zones || []);
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
          photo: result.photo,
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
    <div className="container mt-5">
      <h1 className="text-center mb-4">Your Profile</h1>

      <div className="card">
        <div className="card-body">
          <div className="row">
            <div className="col-md-4 text-center">
              {userData.photo ? (
                <img
                  src={userData.photo}
                  alt="Profile"
                  className="img-thumbnail"
                  style={{
                    width: "200px",
                    height: "200px",
                    objectFit: "cover",
                  }}
                />
              ) : (
                <div className="alert alert-warning" role="alert">
                  No image added
                </div>
              )}
            </div>
            <div className="col-md-8">
              <p>
                <strong>Name:</strong> {userData.name}
              </p>
              <p>
                <strong>Email:</strong> {userData.email}
              </p>
              <p>
                <strong>Phone:</strong> {userData.phone}
              </p>
            </div>
          </div>

          <h4 className="mt-4">Delivery Zones</h4>
          <ul className="list-group">
            {deliveryZones.length > 0 ? (
              deliveryZones.map((zone) => (
                <li key={zone.id} className="list-group-item">
                  <strong>{zone.zone_name}</strong>
                  <ul className="list-group mt-2">
                    {zone.delivery_locations.map((location) => (
                      <li key={location.id} className="list-group-item">
                        {location.location_name} (Fee: {location.delivery_fee})
                      </li>
                    ))}
                  </ul>
                </li>
              ))
            ) : (
              <p>No delivery zones added</p>
            )}
          </ul>

          <div className="text-right mt-4">
            <button
              className="btn btn-primary"
              onClick={() => setIsEditing(true)}
            >
              Edit Profile
            </button>
          </div>
        </div>
      </div>

      {isEditing && (
        <div className="modal fade show d-block" role="dialog">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Edit Profile</h5>
                <button
                  type="button"
                  className="close"
                  aria-label="Close"
                  onClick={() => setIsEditing(false)}
                >
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="modal-body">
                <form onSubmit={handleEditSubmit} encType="multipart/form-data">
                  <div className="form-group">
                    <label>Name:</label>
                    <input
                      type="text"
                      name="name"
                      className="form-control"
                      value={editedUserData.name}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Email:</label>
                    <input
                      type="email"
                      name="email"
                      className="form-control"
                      value={editedUserData.email}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Phone:</label>
                    <input
                      type="text"
                      name="phone"
                      className="form-control"
                      value={editedUserData.phone}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="form-group">
                    <label>Profile Image:</label>
                    <input
                      type="file"
                      className="form-control-file"
                      accept="image/*"
                      onChange={handleImageChange}
                    />
                  </div>
                  <div className="modal-footer">
                    <button type="submit" className="btn btn-success">
                      Save
                    </button>
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={() => setIsEditing(false)}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
