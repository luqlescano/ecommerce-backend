import express from 'express';
import productModel from '../dao/models/productModel.js';

const productsRouter = express.Router();

productsRouter.get('/', async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 10;
        let filter = {};
        if (limit) {
            filter = { limit };
        }
        const products = await productModel.find(filter);
        res.json(products);
    } catch (error) {
        res.status(500).json({  error: error.message });
    }
});

productsRouter.get('/:pid', async (req, res) => {
    try {
        const productId = req.params.pid;
        const product = await productModel.findById(productId);
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
        const newProduct = new productModel(req.body);
        await newProduct.save();
        res.json(newProduct);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

productsRouter.put('/:pid', async (req, res) => {
    try {
        const productId = req.params.pid;
        const updatedProduct = await productModel.findByIdAndUpdate(
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
        await productModel.findByIdAndDelete(productId);
        res.json({ message: 'Producto eliminado correctamente.' });
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
});

export default productsRouter;