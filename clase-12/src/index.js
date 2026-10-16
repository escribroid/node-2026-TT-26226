// src/index.js
import express from "express";
import cors from "cors";
import productsRouter from "./routes/products.routes.js";

const app = express();

/* 
// Configuración básica: Permitir todos los orígenes
app.use(cors());
 */

// Configuración avanzada: Permitir dominios específicos
const corsOptions = {
    // Dominios permitidos
    origin: ["https://example.com", "https://anotherdomain.com"],
    // Métodos HTTP permitidos
    methods: ["GET", "POST", "PUT", "DELETE"],
    // Encabezados permitidos
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true, // Permitir cookies o credenciales
};

app.use(cors(corsOptions));

/* // Sin CORS library
app.use((req, res, next) => {
    // Permitir un dominio
    res.header("Access-Control-Allow-Origin", "https://example.com");
    // Métodos permitidos
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
    // Encabezados permitidos
    res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
    // Permitir cookies/credenciales
    res.header("Access-Control-Allow-Credentials", "true");
    next();
}); */

/* app.get("/", (req, res) => {
    res.send("Hola clase 12");
}); */

app.use("/api", productsRouter);

// Middleware para manejar errores 404
app.use((req, res, next) => {
    res.status(404).send("404 - Recurso no encontrado");
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
