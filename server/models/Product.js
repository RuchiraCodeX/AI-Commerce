const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    sku: {
      type: String,
      unique: true,
      required: true,          // must have SKU
      trim: true
    },
    title: {
      type: String,
      required: true,          // product must have a name
      trim: true
    },
    brand: {
      type: String,
      trim: true
    },
    category: {
      type: String,
      index: true              // faster queries by category
    },
    tags: {
      type: [String],
      default: []
    },
    price: {
      type: Number,
      required: true,
      min: 0                   // no negative prices
    },
    stock: {
      type: Number,
      default: 0,
      min: 0                   // no negative stock
    },
    images: {
      type: [String],
      default: []
    },
    specs: {
      type: Map,               // flexible key:value pairs
      of: String
    },
    ratingAvg: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },
    ratingCount: {
      type: Number,
      default: 0,
      min: 0
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);
