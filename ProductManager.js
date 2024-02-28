const fs = require('fs');

class ProductManager {
    constructor(filePath) {
        this.path = filePath;
        this.products = [];
        this.idCounter = 1;
    }

    generateUniqueId() {
        return this.idCounter++;
    }

    saveProducts() {
        fs.writeFileSync(this.path, JSON.stringify(this.products, null, '\t'));
    }

    addProduct({title, description, price, thumbnail, code, stock}) {
        if (!title || !description || !price || !thumbnail || !code || !stock) {
            throw new Error("Todos los campos son obligatorios.");
        }
        
        const isCodeDuplicate = this.products.some(product => product.code === code);

        if (isCodeDuplicate) {
            throw new Error("El codigo del producto ya esta en uso.")
        }

        const id = this.generateUniqueId();

        const newProduct = {
            id,
            title,
            description,
            price,
            thumbnail,
            code,
            stock
        };

        this.products.push(newProduct);
        this.saveProducts();

        return newProduct;
    }

    getProducts() {
        return this.products;
    }

    getProductById(productId) {
        const product = this.products.find(product => product.id === productId);

        if (!product) {
            throw new Error("Not found.");
        }

        return product;
    }

    updateProduct(productId, updatedFields) {
        const productIndex = this.products.findIndex(product => product.id === productId);

        if (productIndex === -1) {
            throw new Error("Not found.");
        }

        this.products[productIndex] = { ...this.products[productIndex], ...updatedFields };
        this.saveProducts();

        return this.products[productIndex];
    }

    deleteProduct(productId) {
        const initialLength = this.products.length;

        this.products = this.products.filter(product => product.id !== productId);

        if (this.products.length === initialLength) {
            throw new Error("Not found.");
        }

        this.saveProducts();

        return true;
    }
}

/* -------------------------------- */
/* -------------------------------- */
/* ------ PROCESO DE TESTING ------ */
/* -------------------------------- */
/* -------------------------------- */

const testProductManager = () => {
    try {
        // se crea una instancia de la clase ProductManager
        const productManager = new ProductManager('./products.json');

        // getProducts debe devolver un arreglo vacio
        console.log(productManager.getProducts());

        // se agrega un producto nuevo
        const newProduct = productManager.addProduct({
            title: "producto prueba",
            description: "Este es un producto prueba",
            price: 200,
            thumbnail: "Sin imagen",
            code: "abc123",
            stock: 25
        });

        // se muestra el producto recien agregado con un id unico
        console.log(newProduct);

        // se llama a getProducts despues de agregar el producto
        console.log(productManager.getProducts());

        // getProductById debe devolver el producto agregado
        const retrievedProduct = productManager.getProductById(newProduct.id);

        // se muestra el producto recuperado
        console.log(retrievedProduct); 

        // getProductById debe arrojar un error si el producto no existe
        try {
            productManager.getProductById("prueba");
        } catch (error) {
            console.error(error.message); // se muestra el mensaje de error
        }

        // se llama a updateProduct para cambiar un campo del producto
        const updatedProduct = productManager.updateProduct(newProduct.id, { price: 250 });

        // se muestra la actualizacion
        console.log("Producto actualizado:", updatedProduct);

        // se llama a deleteProduct
        const deleted = productManager.deleteProduct(newProduct.id);

        // se muestra si el producto fue eliminado
        console.log("Producto eliminado:", deleted);
    } catch (error) {
        console.error(error.message);
    }
}

testProductManager();