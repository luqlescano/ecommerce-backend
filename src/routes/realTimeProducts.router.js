import { Router } from 'express';
import productModel from '../dao/models/productModel.js';

const realTimeProductsRouter = Router();

realTimeProductsRouter.get('/', async (req, res) => {
    try {
        const products = await productModel.find();
        const productosData = products.map(producto => producto.toObject());
        res.render('realTimeProducts', { productos: productosData });
    } catch (error) {
        console.error('Error al obtener el producto:', error);
        res.status(500).send('Error al obtener los productos.');
    }
});

export default realTimeProductsRouter;