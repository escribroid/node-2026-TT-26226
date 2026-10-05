import express from "express";
import {join, dirname} from "path";
import {fileURLToPath} from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

//app.use(express.static(join(__dirname, "public")));

// Middleware de aplicación
app.use((req, res, next) => {
console.log(`Datos recibidos: ${req.method} ${req.url}`);
next(); // Pasa el control al siguiente middleware o ruta
});

app.get("/", (req, res) => {
  res.send("Hola mundo desde Express");
});

app.get("/productos", (req, res) => {
  res.send("Aquí se mostrarán los productos");
});

app.get("/productos/14", (req, res) => {
  res.send("Aquí se mostrará el producto con ID: 14");
});








const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});