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
        const cart = await CartService.getCartById(cartId); // Obtener el carrito usando el ID
        
        // Verificar si el carrito existe
        if (!cart) {
            throw new Error("Carrito no encontrado.");
        }
        
        // Crear un arreglo para almacenar los productos con detalles extendidos
        const productsWithDetails = [];
        
        // Iterar sobre los productos en el carrito
        for (const item of cart.products) {
            // Verificar si el producto es nulo o indefinido
            if (!item.product) {
                continue; // Saltar a la siguiente iteración si el producto es nulo o indefinido
            }
            
            // Obtener los detalles del producto relacionado usando la referencia ObjectId
            const product = await ProductService.getProductById(item.product);
            if (product) {
                // Agregar el producto con los detalles extendidos al arreglo
                productsWithDetails.push({
                    title: product.title,
                    price: product.price,
                    quantity: item.quantity
                });
            }
        }
        
        // Renderizar la plantilla con el carrito y los productos con detalles extendidos
        res.render('carts', { cart: cart, products: productsWithDetails });
    } catch (error) {
        console.error('Error al obtener el carrito:', error);
        res.status(500).send('Error al obtener el carrito.');
    }
});

export default viewsRouter;