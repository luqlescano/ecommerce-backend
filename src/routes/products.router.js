import express from 'express';
import { ProductManagerDB } from '../dao/ProductManagerDB.js';

const productsRouter = express.Router();
const ProductService = new ProductManagerDB();

productsRouter.get('/', async (req, res) => {
    try {
        const page = req.query.page || 1;
        const limit = req.query.limit || 10;
        const sort = req.query.sort || null;
        const query = req.query.category || null;

        const products = await ProductService.getProducts({ page, limit, sort, query });
        res.json(products);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
    // VIEJO NO DAR IMPORTANCIA
    /* try {
        const limit = parseInt(req.query.limit) || 20;
        const products = await ProductService.getProducts(limit);
        res.json(products);
    } catch (error) {
        res.status(500).json({  error: error.message });
    } */
});

productsRouter.get('/:pid', async (req, res) => {
    try {
        const productId = req.params.pid;
        const product = await ProductService.getProductById(productId);
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
        const newProduct = await ProductService.addProduct(req.body);
        res.json(newProduct);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

productsRouter.put('/:pid', async (req, res) => {
    try {
        const productId = req.params.pid;
        const updatedProduct = await ProductService.updateProduct(
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
        await ProductService.deleteProduct(productId);
        res.json({ message: 'Producto eliminado correctamente.' });
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
});

export default productsRouter;