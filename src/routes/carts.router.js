import express from 'express';
import { CartManagerDB } from '../dao/CartManagerDB.js';

const cartsRouter = express.Router();
const CartService = new CartManagerDB();

cartsRouter.post('/', async (req, res) => {
    try {
        const products = req.body.products || [];
        const newCart = await CartService.createCart(products);
        res.json(newCart);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

cartsRouter.get('/:cid', async (req, res) => {
    try {
        const cartId = req.params.cid;
        const cart = await CartService.getCartById(cartId);
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
        const updatedCart = await CartService.addProductToCart(cartId, productId, quantity); 
        res.json(updatedCart);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }  
});

cartsRouter.delete('/:cid/products/:pid', async (req, res) => {
    try {
        const cartId = req.params.cid;
        const productId = req.params.pid;
        const updatedCart = await CartService.deleteProductFromCart(cartId, productId);
        res.json(updatedCart);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }  
});

cartsRouter.put('/:cid', async (req, res) => {
    try {
        const cartId = req.params.cid;
        const products = req.body.products || [];
        const updatedCart = await CartService.updateCart(cartId, products);
        res.json(updatedCart);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

cartsRouter.put('/:cid/products/:pid', async (req, res) => {
    try {
        const cartId = req.params.cid;
        const productId = req.params.pid;
        const quantity = req.body.quantity;
        const updatedCart = await CartService.updateProductQuantityInCart(cartId, productId, quantity);
        res.json(updatedCart);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

cartsRouter.delete('/:cid', async (req, res) => {
    try {
        const cartId = req.params.cid;
        const updatedCart = await CartService.clearCart(cartId);
        res.json(updatedCart);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

export default cartsRouter;