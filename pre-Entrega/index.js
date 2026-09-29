// URL base de la API
const urlBase = `https://fakestoreapi.com`;

// Obtener los argumentos de la línea de comandos evitando npm(0) y run(1)
const args = process.argv.slice(2);

const [method, resource, ...rest] = args;

// Función para separar la ruta y el id del recurso
const partsResource = (resource) => {
    const parts = resource.split("/");
    return { path: parts[0], id: parts[1] };
};

// GET: obtiene todos los productos o un producto específico por ID
const getProducts = async (id) => {
    try {
        const url = id ? `${urlBase}/products/${id}` : `${urlBase}/products`;
        const response = await fetch(url);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error al obtener los productos:", error);
        throw error;
    }
};

// POST: crea un nuevo producto
const createProduct = async (title, price, category) => {
  try {
    const body = {
        title,
        price: Number(price),
        category,
        description: "Descripción sarasa",
        image: "https://fakestoreapi.com/img/placeholder.png",
    };

    const response = await fetch(`${urlBase}/products`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error al crear el producto:", error);
    throw error;
  }
};

// DELETE: elimina un producto por ID
const deleteProduct = async (id) => {
  try {
    const response = await fetch(`${urlBase}/products/${id}`, {
        method: "DELETE",
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error al eliminar el producto:", error);
    throw error;
  }
};

// Muestra resultados en consola
const showResult = (data, label = "Respuesta") => {
    console.log(`\n--- ${label} ---`);
    console.log(JSON.stringify(data, null, 2));
};

// Función principal
const main = async () => {
    if (!method || !resource) {
        console.log("Uso: npm run start <MÉTODO> <Productos> [args...]");
        return;
    }

    const { path, id } = partsResource(resource);

    try {
        switch (method.toUpperCase()) {
            case "GET": {
                const data = await getProducts(id);
                showResult(data, id ? `Producto ${id}` : "Todos los productos");
                break;
            }
            case "POST": {
                const [title, price, category] = rest;
                if (!title || !price || !category) {
                    console.log("Faltan datos. Uso: POST productos <titulo> <precio> <categoría>");
                    return;
                }
                const data = await createProduct(title, price, category);
                showResult(data, "Producto creado");
                break;
            }
            case "DELETE": {
                if (!id) {
                    console.log("Falta el ID. Uso: DELETE products/<id>");
                    return;
                }
                const data = await deleteProduct(id);
                showResult(data, `Producto ${id} eliminado`);
                break;
            }
            default:
                console.log(`Método "${method}" no soportado.`);
        }
    } catch (error) {
        console.error("Error:", error.message);
    }
};

main();
