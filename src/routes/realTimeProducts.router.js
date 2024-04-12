import { Router } from 'express';
import { ProductManagerDB } from '../dao/ProductManagerDB.js';

const realTimeProductsRouter = Router();
const ProductService = new ProductManagerDB();

realTimeProductsRouter.get('/', async (req, res) => {
    try {
        const products = await ProductService.getProducts();
        const productsData = products.map(product => product.toObject());
        res.render('realTimeProducts', { products: productsData });
    } catch (error) {
        console.error('Error al obtener el producto:', error);
        res.status(500).send('Error al obtener los productos.');
    }
});

export default realTimeProductsRouter;