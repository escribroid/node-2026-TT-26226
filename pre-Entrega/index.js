// Configuración de APIs
const APIS = {
    primary: { name: "FakeStore", url: "https://fakestoreapi.com" },
    fallback: { name: "DummyJSON", url: "https://dummyjson.com" },
};

// Obtener argumentos de la línea de comandos
const args = process.argv.slice(2);
const [method, resource, ...rest] = args;

// Función para separar la ruta y el id del recurso
const parseResource = (resource) => {
    const parts = resource.split("/");
    return { path: parts[0], id: parts[1] };
};

// FUNCIÓN CENTRAL CON FALLBACK
const fetchWithFallback = async ({ primaryEndpoint, fallbackEndpoint, method = "GET", body = null }) => {
    // Helper interno para hacer la petición a una API específica
    const tryApi = async (baseUrl, endpoint) => {
        const url = `${baseUrl}${endpoint}`;
        const options = {
            method,
            headers: { "Content-Type": "application/json" },
        };
        if (body) options.body = JSON.stringify(body);

        const response = await fetch(url, options);

        // fetch NO lanza error en 404 o 500, verificacion manual
        if (!response.ok) {
            throw new Error(`HTTP ${response.status} (${response.statusText})`);
        }
        return await response.json();
    };

    try {
        // Intento con la API principal
        return await tryApi(APIS.primary.url, primaryEndpoint);
    } catch (error) {
        // Si falla, avisamos y probamos con la de respaldo
        console.warn(`\n #### [${APIS.primary.name}] falló: ${error.message}`);
        console.warn(`##### Cambiando a API de respaldo (${APIS.fallback.name})...\n`);

        try {
            const data = await tryApi(APIS.fallback.url, fallbackEndpoint);

            // Modificacion para DummyJSON, devuelve { products: [...], total, skip }
            // FakeStore devuelve directo [...]. Unificacion salida para GET /products
            if (method === "GET" && primaryEndpoint === "/products" && data.products) {
                return data.products;
            }

            return data;
        } catch (fallbackError) {
            // Si ambas fallan, lanza error final
            console.error(`===> [${APIS.fallback.name}] también falló: ${fallbackError.message}`);
            throw new Error("No se pudo conectar con ninguna API.");
        }
    }
};

// FUNCIONES DE LÓGICA
const getProducts = async (id) => {
    const endpoint = id ? `/products/${id}` : "/products";

    // Obtenemos los datos de la API (con fallback)
    const data = await fetchWithFallback({
        primaryEndpoint: endpoint,
        fallbackEndpoint: endpoint,
        method: "GET",
    });

    // Si NO hay ID (es la lista completa) y es un array, aplicamos slice
    if (!id && Array.isArray(data)) {
        return data.slice(0, 10);
    }

    return data;
};

const createProduct = async (title, price, category) => {
    const body = {
        title,
        price: Number(price),
        category,
        description: "Descripción de ejemplo para fallback",
        image: "https://via.placeholder.com/150",
    };

    return await fetchWithFallback({
        primaryEndpoint: "/products", // FakeStore usa esto
        fallbackEndpoint: "/products/add", // DummyJSON requiere "/add"
        method: "POST",
        body,
    });
};

const deleteProduct = async (id) => {
    const endpoint = `/products/${id}`;
    return await fetchWithFallback({
        primaryEndpoint: endpoint,
        fallbackEndpoint: endpoint,
        method: "DELETE",
    });
};

// Muestra resultados en consola
const showResult = (data, label = "Respuesta") => {
    console.log(`\n <----- ${label} ----->`);
    console.log(JSON.stringify(data, null, 3));
};

// FUNCIÓN PRINCIPAL (ROUTER)
const main = async () => {
    if (!method || !resource) {
        console.log("Uso: npm run start <MÉTODO> <recurso> [args...]");
        console.log("Ej: npm run start GET products");
        return;
    }

    const { path, id } = parseResource(resource);

    // Validación
    if (path !== "products") {
        console.log(`Recurso "${path}" no soportado. Usa "products".`);
        return;
    }

    try {
        switch (method.toUpperCase()) {
            case "GET": {
                const data = await getProducts(id);
                const mensaje = id ? `Producto ${id}` : "Primeros 10 productos (con .slice)";
                showResult(data, mensaje);
                break;
            }
            case "POST": {
                const [title, price, category] = rest;
                if (!title || !price || !category) {
                    console.log("Faltan datos. Uso: POST products <titulo> <precio> <categoría>");
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
                console.log(`Método "${method}" no soportado. Usa GET, POST o DELETE.`);
        }
    } catch (error) {
        console.error("\n XXXXX Error fatal:", error.message);
    }
};

main();
