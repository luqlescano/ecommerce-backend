import { Router } from 'express';
import { ProductManagerDB } from '../dao/ProductManagerDB.js';
import { CartManagerDB } from '../dao/CartManagerDB.js';

const viewsRouter = Router();
const ProductService = new ProductManagerDB();
const CartService = new CartManagerDB();

viewsRouter.get('/', async (req, res) => {
    try {
        const products = await ProductService.getProducts();
        const productsData = products.docs; //products.map(product => product.toObject());
        res.render('home', { products: productsData });
    } catch (error) {
        console.error('Error al obtener el producto:', error);
        res.status(500).send('Error al obtener los productos.');
    }
});

viewsRouter.get('/products', async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = 10;
        const sort = req.query.sort || null;
        const query = req.query.category || null;

        const result = await ProductService.getProducts({ page, limit, sort, query });

        result.prevLink = result.hasPrevPage ? `?page=${result.prevPage}` : "";
        result.nextLink = result.hasNextPage ? `?page=${result.nextPage}` : "";

        res.render('products', { products: result.docs, paginate: result });
    } catch (error) {
        console.error('Error al obtener los productos:', error);
        res.status(500).send('Error al obtener los productos.');
    }
});

viewsRouter.get('/carts/:cid', async (req, res) => {
    try {
        const cartId = req.params.cid;
        const cart = await CartService.getCartById(cartId);
        res.render('carts', { cart });
    } catch (error) {
        console.error('Error al obtener el carrito:', error);
        res.status(500).send('Error al obtener el carrito.');
    }
});

export default viewsRouter;