import React from "react";
import { motion } from "framer-motion";
import ProductCard from "../ProductCard/ProductCard";

function ProductsList({ products, addToCart }) {
  if (!products.length) {
    return (
      <p className="text-gray-500 text-center mt-6">No products found</p>
    );
  }

  return (
    <section className="px-4 py-6">
      <div className="mb-8 text-center max-w-2xl mx-auto">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Products</h2>
      </div>

      <motion.div
        initial="hidden"
        animate="visible"
        variants={{
          hidden: {},
          visible: {
            transition: { staggerChildren: 0.1 },
          },
        }}
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
      >
        {products.map((product) => (
          <ProductCard
            key={product._id}
            product={product}
            addToCart={addToCart}
          />
        ))}
      </motion.div>
    </section>
  );
}

export default ProductsList;
