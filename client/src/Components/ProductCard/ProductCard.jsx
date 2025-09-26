import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

function ProductCard({ product, addToCart }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      whileHover={{ scale: 1.05 }}
      className="bg-white rounded-xl shadow-md hover:shadow-xl flex flex-col p-4 border border-gray-100"
    >
      <Link to={`/product/${product._id}`} className="block group flex-1">
        {/* Product Image */}
        {product.images?.length > 0 ? (
          <div className="w-full h-40 flex items-center justify-center bg-gray-50 rounded-lg mb-4">
            <img
              src={product.images[0]}
              alt={product.title}
              className="max-h-36 object-contain group-hover:scale-105 transition-transform"
            />
          </div>
        ) : (
          <div className="w-full h-40 bg-gray-200 rounded-lg flex items-center justify-center mb-4">
            <span className="text-gray-400 text-sm">No Image</span>
          </div>
        )}

        {/* Product Info */}
        <h3 className="font-bold text-lg text-gray-900 mb-1 line-clamp-2 group-hover:text-blue-700">
          {product.title}
        </h3>
        <p className="text-xs text-gray-500 mb-2">{product.brand}</p>
        <p className="text-green-600 font-bold text-base mb-4">
          ${product.price}
        </p>
      </Link>
      {/* Add to Cart */}
      <motion.button
        whileTap={{ scale: 0.95 }}
        onClick={() => addToCart(product)}
        className="bg-blue-600 text-white w-full py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors mt-auto"
      >
        Add to Cart
      </motion.button>
    </motion.div>
  );
}

export default ProductCard;
