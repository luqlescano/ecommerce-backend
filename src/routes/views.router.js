import { Router } from 'express';
import productModel from '../dao/models/productModel.js';

const viewsRouter = Router();

viewsRouter.get('/', async (req, res) => {
    try {
        const products = await productModel.find();
        const productsData = products.map(product => product.toObject());
        res.render('home', { products: productsData });
    } catch (error) {
        console.error('Error al obtener el producto:', error);
        res.status(500).send('Error al obtener los productos.');
    }
});

export default viewsRouter;