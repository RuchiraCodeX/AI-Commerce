// src/api/cart.js
// API helpers for user-specific cart operations

// Use import.meta.env for Vite or fallback to localhost
const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export async function fetchCart(token) {
  const res = await fetch(`${API_BASE}/cart/me`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
  if (!res.ok) throw new Error('Failed to fetch cart');
  return res.json();
}

export async function updateCart(token, cart) {
  const res = await fetch(`${API_BASE}/cart/me`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ cart }),
  });
  if (!res.ok) throw new Error('Failed to update cart');
  return res.json();
}

// Optionally, add helpers for add/remove item if your backend supports it
export async function addToCart(token, productId, quantity = 1) {
  const res = await fetch(`${API_BASE}/cart/me/add`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ productId, quantity }),
  });
  if (!res.ok) throw new Error('Failed to add to cart');
  return res.json();
}

export async function removeFromCart(token, productId) {
  const res = await fetch(`${API_BASE}/cart/me/remove`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ productId }),
  });
  if (!res.ok) throw new Error('Failed to remove from cart');
  return res.json();
}
