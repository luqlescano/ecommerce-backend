import { Router } from 'express';
import { ProductManagerDB } from '../dao/ProductManagerDB.js';
import { CartManagerDB } from '../dao/CartManagerDB.js';
import { auth } from '../middlewares/auth.js';

const viewsRouter = Router();
const ProductService = new ProductManagerDB();
const CartService = new CartManagerDB();

viewsRouter.get('/', auth, async (req, res) => {
    try {
        const products = await ProductService.getProducts();
        const productsData = products.docs; //products.map(product => product.toObject());
        res.render('home', { products: productsData });
    } catch (error) {
        console.error('Error al obtener el producto:', error);
        res.status(500).send('Error al obtener los productos.');
    }
});

viewsRouter.get('/products', auth, async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = 10;
        const sort = req.query.sort || null;
        const query = req.query.category || null;

        const result = await ProductService.getProducts({ page, limit, sort, query });

        result.prevLink = result.hasPrevPage ? `?page=${result.prevPage}` : "";
        result.nextLink = result.hasNextPage ? `?page=${result.nextPage}` : "";

        res.render('products', { products: result.docs, paginate: result, user: req.session.user });
    } catch (error) {
        console.error('Error al obtener los productos:', error);
        res.status(500).send('Error al obtener los productos.');
    }
});

viewsRouter.get('/carts/:cid', auth, async (req, res) => {
    try {
        const cartId = req.params.cid;
        const cart = await CartService.getCartById(cartId);
        res.render('carts', { cart });
    } catch (error) {
        console.error('Error al obtener el carrito:', error);
        res.status(500).send('Error al obtener el carrito.');
    }
});

viewsRouter.get('/login', (req, res) => {
    res.render(
        'login',
        {
            failLogin: req.session.failLogin ?? false
        }
    )
});

viewsRouter.get('/register', (req, res) => {
    res.render(
        'register',
        {
            failRegister: req.session.failRegister ?? false
        }
    )
});

export default viewsRouter;