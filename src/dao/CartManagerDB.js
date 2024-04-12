import cartModel from './models/cartModel.js';
import { ProductManagerDB } from './ProductManagerDB.js';

class CartManagerDB {
    async createCart(products = []) {
        const newCart = new cartModel({
            products: [...products],
        });

        const saveCart = await newCart.save();
        return saveCart;
    }

    async getCartById(cartId) {
        try {
            const cart = await cartModel.findById(cartId).populate('products');

            if (!cart) {
                throw new Error("Carrito no encontrado.");
            }

            return cart;
        } catch (error) {
            throw new Error(`Error al obtener el carrito con ID ${cartId}.`);
        }
    }

    async addProductToCart(cartId, productId, quantity) {
        try {
            const cart = await cartModel.findById(cartId);

            if (!cart) {
                throw new Error("Carrito no encontrado.");
            }

            const ProductService = new ProductManagerDB();
            const product = await ProductService.getProductById(productId);

            if (!product) {
                throw new Error("Producto no encontrado.");
            }

            const productInCartIndex = cart.products.findIndex(product => product._id.toString() === productId);

            if (productInCartIndex === -1) {
                cart.products.push({ _id: productId, quantity });
            } else {
                cart.products[productInCartIndex].quantity += quantity;
            }

            await cart.save();

            return cart;
        } catch (error) {
            throw new Error(`Error al agregar producto al carrito: ${error.message}`);
        }
    }
}

export { CartManagerDB };