import express from "express";

const app = express();

const productos = [
  {
    "id": 1,
    "nombre": "Laptop HP Pavilion",
    "categoria": "Electrónica",
    "precio": 850.00,
    "stock": 15
  },
  {
    "id": 2,
    "nombre": "Silla de Oficina Ergonómica",
    "categoria": "Muebles",
    "precio": 120.50,
    "stock": 30
  },
  {
    "id": 3,
    "nombre": "Cafetera Espresso",
    "categoria": "Electrodomésticos",
    "precio": 89.99,
    "stock": 50
  },
  {
    "id": 4,
    "nombre": "Cuaderno Universitario A4",
    "categoria": "Papelería",
    "precio": 3.50,
    "stock": 200
  },
  {
    "id": 5,
    "nombre": "Auriculares Bluetooth",
    "categoria": "Accesorios",
    "precio": 45.00,
    "stock": 75
  }
];

app.get("/", (req, res) => {
  res.send("Hola clase 10");
});

app.get("/productos", (req, res) => {
  res.json(productos);
});

app.get("/productos/:id", (req, res) => {
  const { id } = req.params;
  const producto = productos.find(p => p.id === parseInt(id));
  if (producto) {
    res.json(producto);
  } else {
    res.status(404).json({ error: "404 - Producto no encontrado" });
  }
});



const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});