// src/models/products.model.js
import fs from "fs";
import path from "path";

const __dirname = import.meta.dirname;


// Ruta al archivo JSON que simula la "base de datos"
const dataPath = path.join(__dirname, "../data/products.json");

console.log(`Ruta al archivo JSON: ${dataPath}`); // Agrega esta línea para depuración

// Leer los productos desde el archivo JSON


const products = JSON.parse(fs.readFileSync(dataPath, "utf-8"), null, 2);

//console.log("Productos cargados:", products); // Agrega esta línea para depuración

//console.log(`Productos cargados: ${JSON.stringify(products, null, 2)}`); // Agrega esta línea para depuración


// Método para buscar un producto por su ID
export function getProductById(id) {
    return products.find((product) => product.id === id);
}

//console.log(`Producto buscado por ID: ${JSON.stringify(getProductById(1), null, 2)}`); // Agrega esta línea para depuración

// Método para obtener todos los productos
export function getAllProducts() {
    return products;
}
//console.log(`Todos los productos: ${JSON.stringify(getAllProducts(), null, 2)}`); // Agrega esta línea para depuración

// Método para guardar un producto en el archivo JSON
export function saveProduct(name, category, price, stock) {
    let products = getAllProducts();
    products.push({ id: products.length + 1, name, category, price, stock });
    fs.writeFileSync(dataPath, JSON.stringify(products, null, 2));
}

//saveProduct("Producto de prueba", "Categoría de prueba", 100, 10); // Agrega esta línea para depuración 

// Metodo para actualizar un producto por su ID
export function updateProduct(id, updatedData) {
    let products = getAllProducts();
    const index = products.findIndex((product) => product.id === id);
    if (index !== -1) {
        products[index] = { ...products[index], ...updatedData };
        fs.writeFileSync(dataPath, JSON.stringify(products, null, 2));
        return products[index];
    }
    return null;
}

//updateProduct(1, { name: "Producto actualizado", price: 200 }); // Agrega esta línea para depuración


// Método para eliminar un producto por su ID
export function deleteProduct(id) {
    let products = getAllProducts();
    products = products.filter((product) => product.id !== id);
    fs.writeFileSync(dataPath, JSON.stringify(products, null, 2));
}

//deleteProduct(9); // Agrega esta línea para depuración
