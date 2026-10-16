// src/controllers/products.controllers.js
import productsService from "../services/products.service.js";

export const getAllProducts = async (req, res) => {
    res.status(200).json(await productsService.getAllProducts(req, res));
};

export const getProductById = async (req, res) => {
    res.status(200).json(await productsService.getProductById(req, res));
};

export const createProduct = async (req, res) => {
    res.status(201).json(await productsService.createProduct(req, res));
};
