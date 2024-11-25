import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { addToCart } from "../redux/action";
import Skeleton from "react-loading-skeleton";
import { NavLink, useParams, useNavigate } from "react-router-dom";
import ChatBox from "./ChatBox";
import Reviews from "./Reviews";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";

const Product = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [zones, setZones] = useState({});
  const [locations, setLocations] = useState({});
  const [showModal, setShowModal] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const isAuthenticated = () => !!localStorage.getItem("token");

  const handleCloseModal = () => setShowModal(false);
  const handleShowModal = () => setShowModal(true);

  const addProduct = (product) => {
    if (product.stock_status === "Out of Stock") {
      handleShowModal();
      return;
    }
    if (isAuthenticated()) {
      dispatch(addToCart(product));
    } else {
      navigate("/login");
    }
  };

  const goToCart = () => {
    if (isAuthenticated()) {
      navigate("/cart");
    } else {
      navigate("/login");
    }
  };

  // Fetch product details
  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `https://www.maizeai.me/api/buyer/products/${id}`
        );
        if (!response.ok) throw new Error("Failed to fetch product details");

        const productData = await response.json();
        setProduct(productData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  // Fetch delivery zones for a farmer
  useEffect(() => {
    const fetchZonesAndLocations = async () => {
      if (!product?.farmer_id) return;

      try {
        // Fetch delivery zones for the farmer
        const zonesResponse = await fetch(
          `https://www.maizeai.me/api/buyers/farmers/${product.farmer_id}/delivery-zones`
        );

        if (!zonesResponse.ok) {
          throw new Error("Failed to fetch delivery zones");
        }

        const zonesData = await zonesResponse.json();
        setZones(zonesData);

        // Fetch locations for each delivery zone in parallel
        const locationsPromises = zonesData.map(async (zone) => {
          const locationsResponse = await fetch(
            `https://www.maizeai.me/api/buyers/delivery-zones/${zone.id}/locations`
          );

          if (!locationsResponse.ok) {
            throw new Error(
              `Failed to fetch delivery locations for zone ${zone.id}`
            );
          }

          const locationsData = await locationsResponse.json();
          return { zoneId: zone.id, locations: locationsData };
        });

        // Resolve all location fetches
        const allLocations = await Promise.all(locationsPromises);

        // Update locations state
        const locationsMap = allLocations.reduce((acc, curr) => {
          acc[curr.zoneId] = curr.locations;
          return acc;
        }, {});

        setLocations(locationsMap);
      } catch (error) {
        console.error("Error fetching delivery zones or locations:", error);
      }
    };

    fetchZonesAndLocations();
  }, [product]);

  const Loading = () => (
    <>
      <div className="col-md-6">
        <Skeleton height={400} />
      </div>
      <div className="col-md-6" style={{ lineHeight: 2 }}>
        <Skeleton height={75} />
        <Skeleton height={25} width={300} />
        <Skeleton height={50} />
        <Skeleton height={150} />
        <Skeleton height={50} width={100} />
        <Skeleton height={50} width={100} style={{ marginLeft: 6 }} />
      </div>
    </>
  );

  const ShowDeliveryZones = () => {
    if (!Object.keys(zones).length) {
      return (
        <p className="text-muted">
          No delivery zones or locations are available for this product.
        </p>
      );
    }

    return (
      <div>
        <h4>Delivery Zones</h4>
        {zones.map((zone) => (
          <div key={zone.id} className="mb-3">
            <h5>{zone.zone_name}</h5>
            {locations[zone.id] && locations[zone.id].length > 0 ? (
              <ul className="list-group">
                {locations[zone.id].map((location) => (
                  <li
                    key={location.id}
                    className="list-group-item d-flex justify-content-between align-items-center"
                  >
                    {location.name}
                    <span className="badge bg-primary rounded-pill">
                      Fee: Ksh {location.delivery_fee}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-muted">
                No locations available for this zone.
              </p>
            )}
          </div>
        ))}
      </div>
    );
  };

  const ShowProduct = () => (
    <>
      <div className="col-md-6">
        <img
          src={`https://www.maizeai.me/${product.file_path}`}
          alt={product.name}
          height="400px"
          width="500px"
        />
      </div>
      <div className="col-md-6">
        <h1 className="display-5">{product.name} Maize</h1>
        <h3 className="display-6 fw-bold my-4">Ksh {product.price}</h3>
        <p className="lead">{product.quantity} Kgs</p>
        <p className="lead">{product.description}</p>
        {product.stock_status === "Out of Stock" && (
          <p className="card-text text-danger">{product.stock_status}</p>
        )}
        <button
          className="btn btn-outline-dark px-4 py-2"
          onClick={() => addProduct(product)}
        >
          Add to Cart
        </button>
        <button className="btn btn-dark ms-2 px-3 py-2" onClick={goToCart}>
          Go to Cart
        </button>
      </div>
      <hr />
      <ShowDeliveryZones />
    </>
  );

  return (
    <div>
      <div className="container py-5">
        <div className="row py-4">
          {loading ? (
            <Loading />
          ) : error ? (
            <div className="alert alert-danger" role="alert">
              {error}
            </div>
          ) : (
            <ShowProduct />
          )}
        </div>
      </div>

      <div className="container">
        <hr />
        {product && <Reviews productId={product.id} />}
      </div>

      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Product Out of Stock</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          This product is currently out of stock and cannot be added to the
          cart.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Product;
