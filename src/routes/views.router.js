import { Router } from 'express';
import { ProductManager } from '../ProductManager.js';

const viewsRouter = Router();
const productManager = new ProductManager('./src/utils/products.json');

viewsRouter.get('/', async (req, res) => {
    try {
        const products = await productManager.getProducts();
        res.render('home', { products });
    } catch (error) {
        console.error('Error al obtener el producto:', error);
        res.status(500).send('Error al obtener los productos.');
    }
});

export default viewsRouter;