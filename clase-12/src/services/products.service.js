// src/services/products.service.js
import { products } from "../data/data.local.db.js";
import * as productsModel from "../models/products.model.js";

const getAllProducts = (req, res) => {
    const { categoria, stock } = req.query;
    console.log("Querys recibidos:", req.query);

    // Si no hay filtros, devuelve todos los productos
    if (!categoria && !stock) {
        return res.json(productos);
    }

    // Filtra según los parámetros recibidos
    let resultado = productos;

    if (categoria) {
        resultado = resultado.filter((p) => p.categoria === categoria);
    }

    if (stock) {
        resultado = resultado.filter((p) => p.stock >= parseInt(stock));
    }

    // Responder con JSON en una API
    res.json(resultado);
};

const getProductById = async (req, res) => {
    /* const { id } = req.params;
    const producto = productos.find((p) => p.id === parseInt(id));
    if (!producto) {
        return res.status(404).json({ error: "Producto no encontrado" });
    }

    return producto; */
    return productsModel.getProductById(req.params.id);
};

const createProduct = async (req, res) => {
    const { nombre, categoria, precio, stock } = req.body;
    const newProduct = {
        id: products.length + 1,
        nombre,
        categoria,
        precio,
        stock,
    };
    products.push(newProduct);
    return newProduct;
};

const updateProduct = async (id, productData) => {
    const index = products.findIndex((product) => product.id == id);
    if (index === -1) {
        throw new Error("Producto no encontrado");
    }
    products[index] = { ...products[index], ...productData };
    return products[index];
};

const deleteProduct = async (id) => {
    const index = products.findIndex((product) => product.id == id);
    if (index === -1) {
        throw new Error("Producto no encontrado");
    }
    const deletedProduct = products.splice(index, 1);
    return deletedProduct[0];
};

const productsService = {
    getAllProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
};

export default productsService;
