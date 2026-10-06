// Configuración de APIs
const APIS = {
    primary: { name: "FakeStore", url: "https://fakestoreapi.com" },
    fallback: { name: "DummyJSON", url: "https://dummyjson.com" }
};

// Obtener argumentos de la línea de comandos
const args = process.argv.slice(2);
const [method, resource, ...rest] = args;

// Función para separar la ruta y el id del recurso
const parseResource = (resource) => {
    const parts = resource.split("/");
    return { path: parts[0], id: parts[1] };
};

// ==========================================================
// 🛡️ FUNCIÓN CENTRAL CON FALLBACK
// ==========================================================
const fetchWithFallback = async ({ primaryEndpoint, fallbackEndpoint, method = "GET", body = null }) => {
    
    // Helper interno para hacer la petición a una API específica
    const tryApi = async (baseUrl, endpoint) => {
        const url = `${baseUrl}${endpoint}`;
        const options = { 
            method, 
            headers: { "Content-Type": "application/json" } 
        };
        if (body) options.body = JSON.stringify(body);

        const response = await fetch(url, options);
        
        // fetch NO lanza error en 404 o 500, hay que verificarlo manualmente
        if (!response.ok) {
            throw new Error(`HTTP ${response.status} (${response.statusText})`);
        }
        return await response.json();
    };

    try {
        // 1️⃣ Intentamos con la API principal
        return await tryApi(APIS.primary.url, primaryEndpoint);
        
    } catch (error) {
        // 2️⃣ Si falla, avisamos y probamos con la de respaldo
        console.warn(`\n⚠️ [${APIS.primary.name}] falló: ${error.message}`);
        console.warn(`🔄 Cambiando a API de respaldo (${APIS.fallback.name})...\n`);
        
        try {
            const data = await tryApi(APIS.fallback.url, fallbackEndpoint);
            
            // 🧩 Normalización: DummyJSON devuelve { products: [...], total, skip }
            // FakeStore devuelve directamente [...]. Unificamos la salida para GET /products
            if (method === "GET" && primaryEndpoint === "/products" && data.products) {
                return data.products; 
            }
            
            return data;
            
        } catch (fallbackError) {
            // 3️⃣ Si ambas fallan, lanzamos el error final
            console.error(`❌ [${APIS.fallback.name}] también falló: ${fallbackError.message}`);
            throw new Error("No se pudo conectar con ninguna API.");
        }
    }
};

// ==========================================================
// FUNCIONES DE LÓGICA DE NEGOCIO
// ==========================================================

const getProducts = async (id) => {
    const endpoint = id ? `/products/${id}` : "/products";
    return await fetchWithFallback({
        primaryEndpoint: endpoint,
        fallbackEndpoint: endpoint,
        method: "GET"
    });
};

const createProduct = async (title, price, category) => {
    const body = {
        title,
        price: Number(price),
        category,
        description: "Descripción de ejemplo para fallback",
        image: "https://via.placeholder.com/150"
    };
    
    return await fetchWithFallback({
        primaryEndpoint: "/products",          // FakeStore usa esto
        fallbackEndpoint: "/products/add",     // DummyJSON requiere "/add"
        method: "POST",
        body
    });
};

const deleteProduct = async (id) => {
    const endpoint = `/products/${id}`;
    return await fetchWithFallback({
        primaryEndpoint: endpoint,
        fallbackEndpoint: endpoint,
        method: "DELETE"
    });
};

// Muestra resultados en consola
const showResult = (data, label = "Respuesta") => {
    console.log(`\n✅ --- ${label} ---`);
    console.log(JSON.stringify(data, null, 2));
};

// ==========================================================
// FUNCIÓN PRINCIPAL (ROUTER)
// ==========================================================
const main = async () => {
    if (!method || !resource) {
        console.log("Uso: npm run start <MÉTODO> <recurso> [args...]");
        console.log("Ej: npm run start GET products");
        return;
    }

    const { path, id } = parseResource(resource);

    // Validación básica de recurso
    if (path !== "products") {
        console.log(`Recurso "${path}" no soportado. Usa "products".`);
        return;
    }

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
        console.error("\n💥 Error fatal:", error.message);
    }
};

main();