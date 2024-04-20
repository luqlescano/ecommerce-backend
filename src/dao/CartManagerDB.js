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
            const cart = await cartModel.findById(cartId).populate('products.product');
            
            if (!cart) {
                throw new Error("Carrito no encontrado.");
            }
            
            return { products: cart.products };
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

    async deleteProductFromCart(cartId, productId) {
        try {
            const cart = await cartModel.findById(cartId);

            if (!cart) {
                throw new Error("Carrito no encontrado.");
            }

            cart.products = cart.products.filter(product => product._id.toString() !== productId);
            await cart.save();

            return cart;
        } catch (error) {
            throw new Error(`Error al eliminar producto del carrito: ${error.message}`);
        }
    }

    async updateCart(cartId, products) {
        try {
            const cart = await cartModel.findById(cartId);

            if (!cart) {
                throw new Error("Carrito no encontrado.");
            }

            cart.products = [...products];
            await cart.save();

            return cart;
        } catch (error) {
            throw new Error(`Error al actualizar el carrito: ${error.message}`);
        }
    }

    async updateProductQuantityInCart(cartId, productId, quantity) {
        try {
            const cart = await cartModel.findById(cartId);

            if (!cart) {
                throw new Error("Carrito no encontrado.");
            }

            const productIndex = cart.products.findIndex(product => product._id.toString() === productId);

            if (productIndex !== -1) {
                cart.products[productIndex].quantity = quantity;
                await cart.save();
            }

            return cart;
        } catch (error) {
            throw new Error(`Error al actualizar la cantidad de ejemplares del producto en el carrito: ${error.message}`);
        }
    }

    async clearCart(cartId) {
        try {
            const cart = await cartModel.findById(cartId);

            if (!cart) {
                throw new Error("Carrito no encontrado.");
            }

            cart.products = [];
            await cart.save();

            return cart;
        } catch (error) {
            throw new Error(`Error al limpiar el carrito: ${error.message}`);
        }
    }

    async populateProducts(cart, productRefs) {
        try {
            const populatedCart = await cartModel.populate(cart, {
                path: 'products.product',
                select: productRefs
            });
            return populatedCart;
        } catch (error) {
            throw new Error('Error al poblar los productos en el carrito:', error);
        }
    }    
}

export { CartManagerDB };