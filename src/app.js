import { ProductManager } from "./ProductManager.js";
import express from "express";

const productManager = new ProductManager("./src/Products.json");

const app = express();

app.use(express.urlencoded({ extended: true }));

app.get("/products", async (req, res) => {
  const products = await productManager.getProducts();
  let { limit } = req.query;
  if (limit) {
    return res.send(products.slice(0, limit));
  }

  res.send(products);
});
app.get("/products/:pid", async (req, res) => {
  const product = await productManager.getProductById(parseInt(req.params.pid));
  if (!product) {
    return res.send({ error: "Product not found" });
  }
  res.send(product);
});

app.listen(8080, () => console.log("Server on port 8080"));
