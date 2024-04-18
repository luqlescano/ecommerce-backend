import productModel from './models/productModel.js';

class ProductManagerDB {
    async getProducts({ page = 1, limit = 10, sort, query } = {}) {
        try {
            const options = {
                page: parseInt(page),
                limit: parseInt(limit),
                lean: true,
                sort: sort ? { price: sort === 'asc' ? 1 : -1 } : undefined,
                query: query ? { category: query } : {}
            };

            const result = await productModel.paginate({}, options);

            return result;
        } catch (error) {
            throw new Error("Error al obtener producto/s.");
        }
    }

    async getProductById(productId) {
        try {
            const product = await productModel.findById(productId);

            if (!product) {
                throw new Error("Producto no encontrado.");
            }

            return product;
        } catch (error) {
            if (error.name === "CastError") {
                throw new Error(`El ID del producto no es válido: ${productId}.`);
            } else if (error.name === "NotFoundError") {
                throw new Error("Producto no encontrado.");
            } else {
                throw new Error(`Error al obtener el producto con ID ${productId}: ${error.message}`);
            }
        }
    }

    async addProduct({ title, description, code, price, status = true, stock, category, thumbnails = [] }) {
        try {
            if (!title || !description || !code || !price || !stock || !category) {
                throw new Error("Todos los campos son obligatorios.");
            }

            const isCodeDuplicate = await productModel.exists({ code });

            if (isCodeDuplicate) {
                throw new Error("El código del producto ya está en uso.");
            }

            const newProduct = new productModel({
                title,
                description,
                code,
                price: parseInt(price),
                stock: parseInt(stock),
                status,
                category,
                thumbnails,
            });

            await newProduct.save();

            return newProduct;
        } catch (error) {
            throw new Error(`Error al agregar producto: ${error.message}`);
        }
    }

    async updateProduct(productId, updatedFields) {
        try {
            const allowedUpdates = ["title", "description", "price", "stock", "status", "category", "thumbnails"];
            const filteredUpdates = Object.fromEntries(
                Object.entries(updatedFields).filter(([key]) => allowedUpdates.includes(key))
            );

            const product = await productModel.findById(productId);

            if (!product) {
                throw new Error("Producto no encontrado.");
            }

            Object.assign(product, filteredUpdates);
            await product.save();

            return product;
        } catch (error) {
            throw new Error(`Error al actualizar producto: ${error.message}`);
        }
    }
      
    async deleteProduct(productId) {
        try {
            const product = await productModel.findByIdAndDelete(productId);

            if (!product) {
                throw new Error("Producto no encontrado.");
            }

            return "Producto eliminado correctamente";
        } catch (error) {
            throw new Error(`Error al eliminar producto: ${error.message}`);
        }
    }
}

export { ProductManagerDB };