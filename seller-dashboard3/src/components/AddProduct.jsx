import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const AddProduct = () => {
  const [name, setName] = useState("");
  const [file, setFile] = useState(null);
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [payment_method, setPaymentMethod] = useState("");

  const navigate = useNavigate();
  async function addProduct() {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("You must be logged in to add a product.");
      return;
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("price", price);
    formData.append("quantity", quantity);
    formData.append("file", file);
    formData.append("payment_method", payment_method);

    try {
      let result = await fetch("http://localhost:8000/api/addProduct", {
        method: "POST",
        body: formData,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (result.ok) {
        const data = await result.json();
        alert(data.message || "Product has been added successfully!");
        navigate("/products");
      } else {
        const errorText = await result.text();
        throw new Error(errorText);
      }
    } catch (error) {
      console.error("Error:", error.message);
      alert("Failed to add product. Please check the console for details.");
    }
  }

  return (
    <div>
      <div className="col-sm-6 offset-sm-3">
        <br />
        <input
          type="text"
          className="form-control"
          onChange={(e) => setName(e.target.value)}
          placeholder="Maize Seed Variety"
        />
        <br />
        <input
          type="file"
          className="form-control"
          onChange={(e) => setFile(e.target.files[0])}
          placeholder="File"
        />
        <br />
        <input
          type="text"
          className="form-control"
          onChange={(e) => setPrice(e.target.value)}
          placeholder="Price in Ksh"
        />
        <br />
        <input
          type="text"
          className="form-control"
          onChange={(e) => setQuantity(e.target.value)}
          placeholder="Quantity in Kgs"
        />
        <br />
        <input
          type="text"
          className="form-control"
          onChange={(e) => setPaymentMethod(e.target.value)}
          placeholder="Enter Your Preferred Payment Method"
        />
        <br />
        <button onClick={() => addProduct()} className="btn btn-primary">
          Add Product
        </button>
      </div>
    </div>
  );
};

export default AddProduct;
// import React, { useState } from "react";

// const AddProduct = () => {
//   const [name, setName] = useState("");
//   const [file, setFile] = useState(null);
//   const [price, setPrice] = useState("");
//   const [quantity, setQuantity] = useState("");

//   async function addProduct() {
//     const token = localStorage.getItem("token");

//     if (!token) {
//       alert("You must be logged in to add a product.");
//       return;
//     }

//     try {
//       // Prepare the FormData with product details and file
//       const formData = new FormData();
//       formData.append("name", name);
//       formData.append("price", price);
//       formData.append("quantity", quantity);
//       if (file) {
//         formData.append("file_path", file);
//       }

//       const response = await fetch("http://localhost:8000/api/addProduct", {
//         method: "POST",
//         body: formData,
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });

//       if (!response.ok) {
//         const errorText = await response.text();
//         throw new Error(errorText);
//       }

//       const data = await response.json();
//       alert(data.message || "Product has been added successfully!");

//       // Clear the form after successful submission
//       setName("");
//       setFile(null);
//       setPrice("");
//       setQuantity("");
//     } catch (error) {
//       console.error("Error:", error.message);
//       alert("Failed to add product. Please check the console for details.");
//     }
//   }

//   return (
//     <div>
//       <div className="col-sm-6 offset-sm-3">
//         <br />
//         <input
//           type="text"
//           className="form-control"
//           onChange={(e) => setName(e.target.value)}
//           placeholder="Product Name"
//           value={name}
//         />
//         <br />
//         <input
//           type="file"
//           className="form-control"
//           onChange={(e) => setFile(e.target.files[0])}
//           placeholder="Upload Image"
//         />
//         <br />
//         <input
//           type="text"
//           className="form-control"
//           onChange={(e) => setPrice(e.target.value)}
//           placeholder="Price in Ksh"
//           value={price}
//         />
//         <br />
//         <input
//           type="number"
//           className="form-control"
//           onChange={(e) => setQuantity(e.target.value)}
//           placeholder="Quantity in Kgs"
//           value={quantity}
//         />
//         <br />
//         <button onClick={addProduct} className="btn btn-primary">
//           Add Product
//         </button>
//       </div>
//     </div>
//   );
// };

// export default AddProduct;
