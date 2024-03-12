import express from 'express';
import { CartManager } from '../CartManager.js';

const cartsRouter = express.Router();
const cartManager = new CartManager('./src/utils/carts.json');

cartsRouter.post('/', async (req, res) => {
    try {
        const products = req.body.products || [];
        const newCart = await cartManager.createCart(products);
        res.json(newCart);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

cartsRouter.get('/:cid', async (req, res) => {
    try {
        const cartId = req.params.cid;
        const cart = await cartManager.getCartById(cartId);
        res.json(cart);
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
});

cartsRouter.post('/:cid/product/:pid', async (req, res) => {
    try {
        const cartId = req.params.cid;
        const productId = req.params.pid;
        const quantity = req.body.quantity || 1;
        const updatedCart = await cartManager.addProductToCart(cartId, productId, quantity);
        res.json(updatedCart);
    } catch (error) {
        res.status(404).json({ error: error.message });
    }  
});

export default cartsRouter;