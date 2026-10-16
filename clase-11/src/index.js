import express from "express";
import cors from "cors";

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

const productos = [
    {
        id: 1,
        nombre: "Laptop HP Pavilion",
        categoria: "Electrónica",
        precio: 850.0,
        stock: 15,
    },
    {
        id: 2,
        nombre: "Silla de Oficina Ergonómica",
        categoria: "Muebles",
        precio: 120.5,
        stock: 30,
    },
    {
        id: 3,
        nombre: "Cafetera Espresso",
        categoria: "Electrodomésticos",
        precio: 89.99,
        stock: 0,
    },
    {
        id: 4,
        nombre: "Cuaderno Universitario A4",
        categoria: "Papelería",
        precio: 3.5,
        stock: 200,
    },
    {
        id: 5,
        nombre: "Auriculares Bluetooth",
        categoria: "Accesorios",
        precio: 45.0,
        stock: 75,
    },
];

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

app.get("/", (req, res) => {
    res.send("Hola clase 10");
});



app.get("/productos/:id", (req, res) => {
    const { id } = req.params;
    const producto = productos.find((p) => p.id === parseInt(id));
    if (!producto) {
        return res.status(404).json({ error: "Producto no encontrado" });
    }
    res.json(producto);
});


app.get("/productos", (req, res) => {
    const { categoria, stock } = req.query;
    console.log("Querys recibidos:", req.query);

    // Si no hay filtros, devuelve todos los productos
    if (!categoria && !stock) {
        return res.json(productos);
    }

    // Filtra según los parámetros recibidos
    let resultado = productos;
    
    if (categoria) {
        resultado = resultado.filter(p => p.categoria === categoria);
    }
    
    if (stock) {
        resultado = resultado.filter(p => p.stock >= parseInt(stock));
    }

    // Responder con JSON en una API
    res.json(resultado); 
});

// Middleware para manejar errores 404
app.use((req, res, next) => {
    res.status(404).send("404 - Recurso no encontrado");
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
