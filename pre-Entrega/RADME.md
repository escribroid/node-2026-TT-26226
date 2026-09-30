# FakeStore CLI 🛒

CLI en Node.js para consumir la API de [FakeStore](https://fakestoreapi.com/) desde la terminal. Permite consultar, crear y eliminar productos mediante comandos simples.

## 🚀 Requisitos

- [Node.js](https://nodejs.org/) v18 o superior (para soporte nativo de `fetch` y ESModules).
- npm (viene incluido con Node).

## 📦 Instalación

```bash
# Clonar el repositorio

# Instalar dependencias (no tiene, pero es buena práctica)
npm install
```

## ⚙️ Configuración

El proyecto usa **ESModules**. Esto ya está configurado en `package.json`:

```json
"type": "module"
```

## 💻 Uso

Todos los comandos se ejecutan con `npm run start` seguido del método HTTP, el recurso y los argumentos necesarios.

### 🔍 Consultar todos los productos

```bash
npm run start GET products
```

### 🔍 Consultar un producto por ID

```bash
npm run start GET products/15
```

### ➕ Crear un producto nuevo

```bash
npm run start POST products <title> <price> <category>
```

**Ejemplo:**

```bash
npm run start POST products T-Shirt-Rex 300 remeras
```

### ❌ Eliminar un producto

```bash
npm run start DELETE products/<id>
```

**Ejemplo:**

```bash
npm run start DELETE products/7
```

## 📂 Estructura del proyecto

```
fakestore-cli/
├── index.js        # Punto de entrada y lógica principal
├── package.json    # Configuración de npm y scripts
└── README.md       # Este archivo
```

## 🧠 Conceptos clave

- **`process.argv`**: captura los argumentos pasados por terminal.
- **Destructuring**: para separar método, recurso y argumentos extra.
- **`fetch` + `async/await`**: para peticiones HTTP asíncronas.
- **`JSON.stringify(data, null, 2)`**: formatea la salida en consola con indentación.

## ⚠️ Nota importante

La API de FakeStore es un **mock**: las operaciones `POST` y `DELETE` se simulan pero **no persisten** realmente. Si eliminás un producto y lo volvés a consultar, seguirá apareciendo.

## 👨‍🏫 Autor

Proyecto de referencia, creado por **Sebastián**.

## 📄 Licencia

ISC