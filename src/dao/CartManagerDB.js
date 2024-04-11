import cartModel from './models/cartModel';

export class CartManagerDB {
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

            const productoExistente = cart.productos.find(p => p.producto.toString() === productId);

            if (productoExistente) {
                productoExistente.cantidad += quantity;
            } else {
                cart.productos.push({ producto: mongoose.Types.ObjectId(productId), cantidad });
            }

            await cart.save();

            return await this.getCartById(cartId);
        } catch (error) {
            throw new Error(`Error al agregar producto al carrito: ${error.message}`);
        }
    }
}