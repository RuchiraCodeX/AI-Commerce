const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

// Connect MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch(err => console.error(err));

// Import Routes
const authRoutes = require("./routes/auth");  // 👈 add this
app.use("/auth", authRoutes);                 // 👈 add this

// Root test route
app.get("/", (req, res) => {
  res.send("Server running 🚀");
});

const productRoutes = require("./routes/products");
app.use("/products", productRoutes);

const cartRoutes = require("./routes/cart");
app.use("/cart", cartRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
