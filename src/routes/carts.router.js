import express from 'express';
import cartModel from '../dao/models/cartModel.js';
import productModel from '../dao/models/productModel.js';

const cartsRouter = express.Router();

cartsRouter.post('/', async (req, res) => {
    try {
        const products = req.body.products || [];
        const productIds = products.map(product => product._id);
        const foundProducts = await productModel.find({ _id: { $in: productIds } });
        const cartProducts = foundProducts.map(product => ({
            product: product._id,
            quantity: products.find(p => p._id === product._id).quantity
        }));
        const newCart = new cartModel({ products: cartProducts });
        await newCart.save();
        res.json(newCart);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

cartsRouter.get('/:cid', async (req, res) => {
    try {
        const cartId = req.params.cid;
        const cart = await cartModel.findById(cartId).populate('products');
        if (!cart) {
            return res.status(404).json({ error: 'Carrito no encontrado.' });
        }
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
        const cart = await cartModel.findById(cartId);
        if (!cart) {
            return res.status(404).json({ error: 'Carrito no encontrado.' });
        }
        const product = await productModel.findById(productId);
        if (!product) {
            return res.status(404).json({ error: 'Producto no encontrado.' });
        }
        const existingProductIndex = cart.products.findIndex(p => p.product.toString() === productId);
        if (existingProductIndex !== -1) {
            cart.products[existingProductIndex].quantity += quantity;
        } else {
            cart.products.push({ product: productId, quantity });
        }
        await cart.save();
        res.json(cart);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }  
});

export default cartsRouter;