import express from 'express';
import { ProductManager } from '../ProductManager.js';

const productsRouter = express.Router();
const productManager = new ProductManager('./src/utils/products.json');

productsRouter.get('/', async (req, res) => {
    try {
        const limit = req.query.limit;
        const products = await productManager.getProducts(limit);
        res.json(products);
    } catch (error) {
        res.status(500).json({  error: error.message });
    }
});

productsRouter.get('/:pid', async (req, res) => {
    try {
        const productId = req.params.pid;
        const product = await productManager.getProductById(productId);
        res.json(product);
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
});

productsRouter.post('/', async (req, res) => {
    try {
        const newProduct = await productManager.addProduct(req.body);
        res.json(newProduct);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

productsRouter.put('/:pid', async (req, res) => {
    try {
        const productId = parseInt(req.params.pid, 10);
        const updateProduct = await productManager.updateProduct(productId, req.body);
        res.json(updateProduct);
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
});

productsRouter.delete('/:pid', async (req, res) => {
    try {
        const productId = parseInt(req.params.pid, 10);
        const successMessage = await productManager.deleteProduct(productId);
        res.json({ message: successMessage });
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
});

export default productsRouter;