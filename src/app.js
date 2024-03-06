import express from 'express';
import { ProductManager } from './ProductManager.js';

const app = express();

// Instanciamos la clase ProductManager con la ruta del archivo de productos
const productManager = new ProductManager('./src/utils/products.json');

// Middleware para analizar el cuerpo de la solicitud
app.use(express.json());

// Endpoint para obtener todos los productos con límite opcional
app.get('/products', async (req, res) => {
    try {
        const limit = req.query.limit;
        const products = await productManager.getProducts(limit);
        res.json(products);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
})

// Endpoint para obtener un producto por ID
app.get('/products/:pid', async (req, res) => {
    try {
        const productId = req.params.pid;
        const product = await productManager.getProductById(productId);
        res.json(product);
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
})

const PORT = 8080;

app.listen(PORT, () => {
    console.log(`Servidor activo en http://localhost:${PORT}`);
})