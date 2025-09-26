const mongoose = require("mongoose");
const { faker } = require("@faker-js/faker");
require("dotenv").config();

const Product = require("./models/Product");

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("✅ Connected for seeding...");

  await Product.deleteMany(); // clear old data

  for (let i = 0; i < 20; i++) {
    const product = new Product({
      sku: faker.string.alphanumeric(8),
      title: faker.commerce.productName(),
      brand: faker.company.name(),
      category: faker.commerce.department(),
      tags: [faker.commerce.productAdjective(), faker.commerce.productMaterial()],
      price: faker.commerce.price(),
      stock: faker.number.int({ min: 5, max: 50 }),
      images: [faker.image.url()],
      specs: { color: faker.color.human(), size: faker.commerce.productMaterial() }
    });
    await product.save();
  }

  console.log("🎉 20 products inserted!");
  mongoose.disconnect();
}

seed();
