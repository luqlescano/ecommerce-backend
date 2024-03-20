import { Router } from 'express';
import { ProductManager } from '../ProductManager.js';

const realTimeProductsRouter = Router();
const productManager = new ProductManager('./src/utils/products.json');

realTimeProductsRouter.get('/', async (req, res) => {
    try {
        const products = await productManager.getProducts();
        res.render('realTimeProducts', { products });
    } catch (error) {
        console.error('Error al obtener el producto:', error);
        res.status(500).send('Error al obtener los productos.');
    }
});

export default realTimeProductsRouter;