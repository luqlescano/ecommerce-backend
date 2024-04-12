import express from 'express';
import { productManagerDB } from '../dao/ProductManagerDB.js';

const productsRouter = express.Router();
const productService = new productManagerDB();

productsRouter.get('/', async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 20;
        const products = await productService.getProducts(limit);
        res.json(products);
    } catch (error) {
        res.status(500).json({  error: error.message });
    }
});

productsRouter.get('/:pid', async (req, res) => {
    try {
        const productId = req.params.pid;
        const product = await productService.getProductById(productId);
        if (!product) {
            return res.status(404).json({ error: 'Producto no encontrado.' });
        }
        res.json(product);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

productsRouter.post('/', async (req, res) => {
    try {
        const newProduct = await productService.addProduct(req.body);
        res.json(newProduct);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

productsRouter.put('/:pid', async (req, res) => {
    try {
        const productId = req.params.pid;
        const updatedProduct = await productService.updateProduct(
            productId,
            req.body,
            { new: true }
        );
        if (!updatedProduct) {
            return res.status(404).json({ error: 'Producto no encontrado.' });
        }
        res.json(updatedProduct);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

productsRouter.delete('/:pid', async (req, res) => {
    try {
        const productId = req.params.pid;
        await productService.deleteProduct(productId);
        res.json({ message: 'Producto eliminado correctamente.' });
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
});

export default productsRouter;