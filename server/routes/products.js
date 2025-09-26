
const express = require("express");
const multer = require("multer");
const path = require("path");
const Product = require("../models/Product");
const Trie = require("../utils/trie");

const mongoose = require("mongoose");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");

const router = express.Router();
const trie = new Trie();

// Multer config for image upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../..", "uploads"));
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    cb(null, Date.now() + ext);
  },
});
const upload = multer({ storage });

// Image upload endpoint (admin only)
// ...existing code...
router.post("/upload", auth, admin, upload.single("image"), (req, res) => {
  if (!req.file) return res.status(400).json({ error: "No file uploaded" });
  // Return relative URL for frontend
  res.json({ url: `/uploads/${req.file.filename}` });
});

// Load products into Trie at server startup
async function loadTrie() {
  try {
    const products = await Product.find();
    products.forEach(p => {
      if (p.title) trie.insert(p.title.toLowerCase()); // lowercase for consistent search
    });
    console.log("✅ Trie loaded with product titles");
  } catch (err) {
    console.error("❌ Error loading Trie:", err);
  }
}

loadTrie();

// Get all products
router.get("/", async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Autocomplete search
router.get("/search/:prefix", async (req, res) => {
  try {
    const prefix = req.params.prefix.toLowerCase();

    // Search Trie
    const matches = trie.search(prefix);

    if (!matches.length) return res.json([]); // no matches

    // Fetch products that match any of the titles
    const products = await Product.find({
      title: { $regex: matches.join("|"), $options: "i" } // partial & case-insensitive
    });

    res.json(products);
  } catch (err) {
    console.error("❌ Search error:", err);
    res.status(500).json({ error: err.message });
  }
});


// Add new product (admin only)
router.post("/", auth, admin, async (req, res) => {
  try {
    const product = new Product(req.body);
    await product.save();
    if (product.title) trie.insert(product.title.toLowerCase());
    res.status(201).json(product);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Update product (admin only)
router.put("/:id", auth, admin, async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ error: "Invalid product ID" });
    }
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!product) return res.status(404).json({ error: "Product not found" });
    if (product.title) trie.insert(product.title.toLowerCase());
    res.json(product);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete product (admin only)
router.delete("/:id", auth, admin, async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ error: "Invalid product ID" });
    }
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ error: "Product not found" });
    res.json({ message: "Product deleted" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get product by ID
router.get("/:id", async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ error: "Invalid product ID" });
    }
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ error: "Product not found" });
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
