import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext";


export default function ProductDetail({ addToCart: addToCartProp }) {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    fetch(`/products/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Product not found");
        return res.json();
      })
      .then((data) => {
        setProduct(data);
        setError(null);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  const handleAddToCart = () => {
    if (!user) {
      navigate("/login");
      return;
    }
    if (addToCartProp) {
      addToCartProp(product);
    } else {
      // fallback: reload or show error
      alert("Add to cart not available");
    }
  };

  if (loading) return <div className="p-8 text-center">Loading...</div>;
  if (error) return <div className="p-8 text-center text-red-600">{error}</div>;
  if (!product) return null;

  return (
    <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-lg p-8 mt-8 flex flex-col md:flex-row gap-8">
      <div className="flex-shrink-0 w-full md:w-1/2 flex items-center justify-center">
        <img
          src={product.image || "/placeholder.png"}
          alt={product.title}
          className="rounded-lg object-contain max-h-96 w-full"
        />
      </div>
      <div className="flex-1 flex flex-col gap-4">
        <h1 className="text-2xl font-bold text-gray-900">{product.title}</h1>
        <div className="text-lg text-green-700 font-semibold">${product.price}</div>
        <div className="text-gray-700">{product.description}</div>
        <div className="text-sm text-gray-400">Category: {product.category}</div>
        <button
          className="mt-6 bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          onClick={handleAddToCart}
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
}
