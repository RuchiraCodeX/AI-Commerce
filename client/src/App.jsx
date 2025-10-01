import React, { useState, useEffect, useCallback } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./AuthContext";

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
import AdminDashboard from "./pages/AdminDashboard";
import AdminProducts from "./pages/AdminProducts";
import AdminOrders from "./pages/AdminOrders";
import AdminUsers from "./pages/AdminUsers";

import {
  fetchCart,
  updateCart,
  addToCart as apiAddToCart,
  removeFromCart as apiRemoveFromCart,
} from "./api/cart";

// ------------------ ROUTE COMPONENTS ------------------
function AdminRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return null; // or a loader
  return user && user.isAdmin ? children : <Navigate to="/" />;
}

function PrivateRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return null;
  return user ? children : <Navigate to="/login" />;
}

// ------------------ APP ROUTES ------------------
function AppRoutes({ results, setResults, cart, addToCart, updateQuantity, removeFromCart }) {
  const { user } = useAuth();

  return (
    <Routes>
      <Route
        path="/"
        element={
          <div className="min-h-screen bg-gray-100 flex flex-col">
            <Header cartCount={cart?.length || 0} />
            <main className="flex-1 p-6">
              {/* Intro Section */}
              <section className="max-w-2xl mx-auto text-center mb-8">
                <h1 className="text-4xl font-extrabold text-gray-900 mb-2">
                  Welcome to AI-Commerce
                </h1>
                <p className="text-gray-600 text-lg">
                  Your modern marketplace for smart shopping. Browse products, add to cart, and enjoy a seamless experience!
                </p>
              </section>

              {/* Search Bar */}
              <div className="mb-8 max-w-xl mx-auto">
                <SearchBar onResults={setResults} />
              </div>

              {/* Main Content */}
              <div className="flex flex-col lg:flex-row gap-8">
                <div className="flex-1">
                  <ProductsList
                    products={results}
                    addToCart={addToCart}
                    removeFromCart={removeFromCart}
                  />
                </div>

                {user?.isAdmin && (
                  <div className="w-full lg:w-80">
                    <AdminDashboard />
                  </div>
                )}
              </div>
            </main>
            <Footer />
          </div>
        }
      />

      {/* Auth Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/forgot" element={<ForgotPassword />} />

      {/* Private/User Routes */}
      <Route
        path="/profile"
        element={
          <PrivateRoute>
            <Profile cart={cart} />
          </PrivateRoute>
        }
      />
      <Route
        path="/cart"
        element={
          <CartPage
            cart={cart}
            updateQuantity={updateQuantity}
            removeFromCart={removeFromCart}
          />
        }
      />
      <Route
        path="/product/:id"
        element={<ProductDetail addToCart={addToCart} />}
      />

      {/* Admin Routes */}
      <Route
        path="/admin"
        element={
          <AdminRoute>
            <AdminDashboard />
          </AdminRoute>
        }
      >
        <Route
          path="products"
          element={
            <AdminRoute>
              <AdminProducts />
            </AdminRoute>
          }
        />
        <Route
          path="orders"
          element={
            <AdminRoute>
              <AdminOrders />
            </AdminRoute>
          }
        />
        <Route
          path="users"
          element={
            <AdminRoute>
              <AdminUsers />
            </AdminRoute>
          }
        />
      </Route>
    </Routes>
  );
}

// ------------------ APP WITH AUTH ------------------
function AppWithAuth() {
  const { token } = useAuth();
  const [results, setResults] = useState([]);
  const [cart, setCart] = useState([]);
  const [cartLoading, setCartLoading] = useState(false);

  // Fetch cart from backend
  useEffect(() => {
    if (!token) {
      setCart([]);
      return;
    }
    setCartLoading(true);
    fetchCart(token)
      .then((data) => setCart(data.cart || []))
      .catch(() => setCart([]))
      .finally(() => setCartLoading(false));
  }, [token]);

  // Add to cart
  const addToCart = useCallback(
    async (product) => {
      if (!token) return;
      setCartLoading(true);
      try {
        const updated = await apiAddToCart(token, product._id, 1);
        setCart(updated.cart || []);
      } finally {
        setCartLoading(false);
      }
    },
    [token]
  );

  // Update quantity
  const updateQuantity = useCallback(
    async (id, qty) => {
      if (!token) return;
      setCartLoading(true);
      try {
        const updated = await updateCart(
          token,
          cart.map((item) =>
            item._id === id ? { ...item, qty: Math.max(1, qty) } : item
          )
        );
        setCart(updated.cart || []);
      } finally {
        setCartLoading(false);
      }
    },
    [token, cart]
  );

  // Remove from cart
  const removeFromCart = useCallback(
    async (id) => {
      if (!token) return;
      setCartLoading(true);
      try {
        const updated = await apiRemoveFromCart(token, id);
        setCart(updated.cart || []);
      } finally {
        setCartLoading(false);
      }
    },
    [token]
  );

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

// ------------------ MAIN APP ------------------
function App() {
  return (
    <AuthProvider>
      <AppWithAuth />
    </AuthProvider>
  );
}

export default App;
