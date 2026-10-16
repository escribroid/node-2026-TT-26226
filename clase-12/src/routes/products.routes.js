// src/routes/products.routes.js
import express from "express";
import { getAllProducts, getProductById, createProduct } from "../controllers/products.controllers.js";

const router = express.Router();

router.get("/", (req, res) => {
    res.send("Bienvenido a la API de Productos");
});

router.get("/products", getAllProducts);
router.get("/products/:id", getProductById);
router.post("/products", createProduct);

export default router;
