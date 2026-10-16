// src/models/products.model.js
import fs from "fs";
import path from "path";

const __dirname = import.meta.dirname;

// Ruta al archivo JSON que simula la "base de datos"
const dataPath = path.join(__dirname, "../data/products.json");

const products = JSON.parse(fs.readFileSync(dataPath, "utf-8"), null, 2);

// Método para buscar un producto por su ID
export function getProductById(id) {
    return products.find((product) => product.id === id);
}

// Método para obtener todos los productos
export function getAllProducts() {
    return products;
}

// Método para guardar un producto en el archivo JSON
export function saveProduct(name, price) {
    const products = this.getAllProducts();
    products.push({ id: products.length, nombre, categoria, precio, stock });
    fs.writeFileSync(dataPath, JSON.stringify(products, null, 2));
}
// Método para eliminar un producto por su ID
export function deleteProduct(id) {
    const products = this.getAllProducts();
    products = products.filter((product) => product.id !== id);
    fs.writeFileSync(dataPath, JSON.stringify(products, null, 2));
}
