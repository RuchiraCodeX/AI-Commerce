import React, { useState, useEffect, useCallback } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./AuthContext";
import { fetchCart, updateCart, addToCart as apiAddToCart, removeFromCart as apiRemoveFromCart } from "./api/cart";

import ProductsList from "./Components/Product List/ProductsList";
import Cart from "./Components/Cart/Cart";
import Header from "./Components/Header";
import Footer from "./Components/Footer";
import CartPage from "./CartPage";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ForgotPassword from "./pages/ForgotPassword";
import Profile from "./pages/Profile";
import SearchBar from "./Components/Searchbar/SearchBar";
import ProductDetail from "./pages/ProductDetail";

function PrivateRoute({ children }) {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" />;
}

function AppRoutes(props) {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <div className="min-h-screen bg-gray-100 flex flex-col">
            <Header cartCount={props.cart?.length || 0} />
            <main className="flex-1 p-6">
              <section className="max-w-2xl mx-auto text-center mb-8">
                <h1 className="text-4xl font-extrabold text-gray-900 mb-2">Welcome to AI-Commerce</h1>
                <p className="text-gray-600 text-lg">Your modern marketplace for smart shopping. Browse products, add to cart, and enjoy a seamless experience!</p>
              </section>
              <div className="mb-8 max-w-xl mx-auto">
                <SearchBar onResults={props.setResults} />
              </div>
              <div className="flex flex-col lg:flex-row gap-8">
                <div className="flex-1">
                  <ProductsList products={props.results} addToCart={props.addToCart} />
                </div>
              </div>
            </main>
            <Footer />
          </div>
        }
      />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/forgot" element={<ForgotPassword />} />
      <Route path="/profile" element={<PrivateRoute><Profile cart={props.cart} /></PrivateRoute>} />
      <Route
        path="/cart"
        element={
          <CartPage
            cart={props.cart}
            updateQuantity={props.updateQuantity}
            removeFromCart={props.removeFromCart}
          />
        }
      />
  <Route path="/product/:id" element={<ProductDetail addToCart={props.addToCart} />} />
      </Routes>
    );
  }

function AppWithAuth() {
  const [results, setResults] = useState([]); // search results
  const [cart, setCart] = useState([]);
  const { token, user } = useAuth();
  const [cartLoading, setCartLoading] = useState(false);

  // Fetch cart from backend when user/token changes
  useEffect(() => {
    if (!token) {
      setCart([]);
      return;
    }
    setCartLoading(true);
    fetchCart(token)
      .then((data) => {
        setCart(data.cart || []);
      })
      .catch(() => setCart([]))
      .finally(() => setCartLoading(false));
  }, [token]);

  // Add product to cart (API)
  const addToCart = useCallback(async (product) => {
    if (!token) return;
    setCartLoading(true);
    try {
      const updated = await apiAddToCart(token, product._id, 1);
      setCart(updated.cart || []);
    } catch {
      // Optionally show error
    } finally {
      setCartLoading(false);
    }
  }, [token]);

  // Update quantity in cart (API)
  const updateQuantity = useCallback(async (id, qty) => {
    if (!token) return;
    setCartLoading(true);
    try {
      const updated = await updateCart(token, [
        ...cart.map((item) =>
          item._id === id ? { ...item, qty: Math.max(1, qty) } : item
        ),
      ]);
      setCart(updated.cart || []);
    } catch {
      // Optionally show error
    } finally {
      setCartLoading(false);
    }
  }, [token, cart]);

  // Remove from cart (API)
  const removeFromCart = useCallback(async (id) => {
    if (!token) return;
    setCartLoading(true);
    try {
      const updated = await apiRemoveFromCart(token, id);
      setCart(updated.cart || []);
    } catch {
      // Optionally show error
    } finally {
      setCartLoading(false);
    }
  }, [token]);

  return (
    <AppRoutes
      results={results}
      setResults={setResults}
      cart={cart}
      addToCart={addToCart}
      updateQuantity={updateQuantity}
      removeFromCart={removeFromCart}
    />
  );
}

function App() {
  return (
    <AuthProvider>
      <AppWithAuth />
    </AuthProvider>
  );
}
export default App;
