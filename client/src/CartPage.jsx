import React from "react";
import Cart from "./Components/Cart/Cart";
import Footer from "./Components/Footer";
import Header from "./Components/Header";

const CartPage = ({ cart, updateQuantity, removeFromCart }) => (
  <div className="min-h-screen bg-gray-100 flex flex-col">
    <Header />
    <main className="flex-1 p-6 max-w-2xl mx-auto">
      <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">Your Cart</h2>
      <Cart cart={cart} updateQuantity={updateQuantity} removeFromCart={removeFromCart} />
    </main>
    <Footer />
  </div>
);

export default CartPage;
