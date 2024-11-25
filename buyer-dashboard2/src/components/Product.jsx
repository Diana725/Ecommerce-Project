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
  const [zonesLoading, setZonesLoading] = useState(true); // Loading state for zones
  const [error, setError] = useState(null);
  const [zonesError, setZonesError] = useState(null); // Error state for zones
  const [deliveryZones, setDeliveryZones] = useState([]); // State for delivery zones
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
    if (!id) {
      console.error("Product ID is not defined.");
      return;
    }

    const getProduct = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(
          `https://www.maizeai.me/api/buyer/products/${id}`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch product details");
        }

        const productData = await response.json();
        setProduct(productData);

        // Fetch delivery zones for the farmer
        const zonesResponse = await fetch(
          `https://www.maizeai.me/api/buyers/farmers/${productData.farmer_id}/delivery-zones`
        );

        if (!zonesResponse.ok) {
          throw new Error("Failed to fetch delivery zones");
        }

        const zonesData = await zonesResponse.json();
        const zonesWithLocations = await Promise.all(
          zonesData.map(async (zone) => {
            const locationsResponse = await fetch(
              `https://www.maizeai.me/api/buyers/delivery-zones/${zone.id}/locations`
            );
            if (!locationsResponse.ok) {
              throw new Error("Failed to fetch delivery locations");
            }
            const locationsData = await locationsResponse.json();
            return { ...zone, locations: locationsData };
          })
        );

        setDeliveryZones(zonesWithLocations);
      } catch (err) {
        console.error("Error fetching product or zones:", err);
        setError(err.message);
      } finally {
        setLoading(false);
        setZonesLoading(false);
      }
    };

    getProduct();
  }, [id]);

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

  const ShowProduct = () => {
    if (!product) return null;

    return (
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
          <h3 className="display-6 fw-bold my-4">ksh {product.price}</h3>
          <p className="lead">{product.quantity} Kgs</p>
          <p className="lead">{product.description}</p>
          {product.stock_status === "Out of Stock" && (
            <p className="card-text" style={{ color: "red" }}>
              {product.stock_status}
            </p>
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
      </>
    );
  };

  const ShowDeliveryZones = () => {
    if (zonesLoading) {
      return <Skeleton count={5} />;
    }

    if (zonesError) {
      return (
        <div className="alert alert-danger" role="alert">
          {zonesError}
        </div>
      );
    }

    if (deliveryZones.length === 0) {
      return <p className="text-muted">No delivery zones available.</p>;
    }

    return (
      <div>
        <h3 className="my-4">Delivery Zones</h3>
        <div className="accordion" id="deliveryZonesAccordion">
          {deliveryZones.map((zone, index) => (
            <div className="accordion-item" key={zone.id}>
              <h2 className="accordion-header" id={`heading-${index}`}>
                <button
                  className="accordion-button"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target={`#collapse-${index}`}
                  aria-expanded="true"
                  aria-controls={`collapse-${index}`}
                >
                  {zone.name}
                </button>
              </h2>
              <div
                id={`collapse-${index}`}
                className="accordion-collapse collapse show"
                aria-labelledby={`heading-${index}`}
                data-bs-parent="#deliveryZonesAccordion"
              >
                <div className="accordion-body">
                  <ul className="list-group">
                    {zone.locations.map((location) => (
                      <li
                        className="list-group-item d-flex justify-content-between align-items-center"
                        key={location.id}
                      >
                        {location.name}
                        <span className="badge bg-primary rounded-pill">
                          Ksh {location.delivery_fee}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

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
        <div className="row py-4">{!loading && <ShowDeliveryZones />}</div>
      </div>

      <div className="container">
        <hr />
        {product && <Reviews productId={product.id} />}
      </div>
      <br />
      <hr />
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
