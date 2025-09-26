const express = require("express");

const Order = require("../models/Order");
const Product = require("../models/Product");
const Cart = require("../models/Cart");
const auth = require("../middleware/auth");

const router = express.Router();
// Get current user's cart
router.get("/me", auth, async (req, res) => {
  try {
    let cart = await Cart.findOne({ userId: req.user.id }).populate("items.productId");
    if (!cart) cart = await Cart.create({ userId: req.user.id, items: [] });
    res.json({ cart: cart.items });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update current user's cart (replace all items)
router.put("/me", auth, async (req, res) => {
  try {
    const { cart } = req.body;
    let userCart = await Cart.findOneAndUpdate(
      { userId: req.user.id },
      { items: cart },
      { new: true, upsert: true }
    ).populate("items.productId");
    res.json({ cart: userCart.items });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add item to cart
router.post("/me/add", auth, async (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body;
    let cart = await Cart.findOne({ userId: req.user.id });
    if (!cart) cart = await Cart.create({ userId: req.user.id, items: [] });
    const idx = cart.items.findIndex(i => i.productId.toString() === productId);
    if (idx > -1) {
      cart.items[idx].qty += quantity;
    } else {
      cart.items.push({ productId, qty: quantity });
    }
    await cart.save();
    await cart.populate("items.productId");
    res.json({ cart: cart.items });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Remove item from cart
router.post("/me/remove", auth, async (req, res) => {
  try {
    const { productId } = req.body;
    let cart = await Cart.findOne({ userId: req.user.id });
    if (!cart) return res.status(404).json({ error: "Cart not found" });
    cart.items = cart.items.filter(i => i.productId.toString() !== productId);
    await cart.save();
    await cart.populate("items.productId");
    res.json({ cart: cart.items });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create a new order (checkout)
router.post("/checkout", async (req, res) => {
  try {
    const { userId, items } = req.body;

    // Calculate total price
    let totalPrice = 0;
    for (const item of items) {
      const product = await Product.findById(item.productId);
      if (!product) return res.status(404).json({ error: "Product not found" });
      totalPrice += product.price * item.quantity;
    }

    const order = new Order({ userId, items, totalPrice });
    await order.save();

    res.status(201).json(order);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get user orders
router.get("/:userId", async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.params.userId }).populate("items.productId");
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
