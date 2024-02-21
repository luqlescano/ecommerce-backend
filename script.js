class ProductManager {
    constructor() {
        this.products = [];
        this.idCounter = 1;
    }

    generateUniqueId() {
        return this.idCounter++;
    }

    getProducts() {
        return this.products;
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

        return newProduct;
    }

    getProductById(productId) {
        const product = this.products.find(product => product.id === productId);

        if (!product) {
            throw new Error("Not found.");
        }

        return product;
    }
}

/* -------------------------------- */
/* -------------------------------- */
/* ------ PROCESO DE TESTING ------ */
/* -------------------------------- */
/* -------------------------------- */

// se crea una instancia de la clase ProductManager
const productManager = new ProductManager();

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

// se muestra getProducts despues de agregar el producto
console.log(productManager.getProducts());

// se intenta agregar un producto con el mismo codigo, debe arrojar un error
try {
    productManager.addProduct({
        title: "producto prueba",
        description: "Este es un producto prueba",
        price: 200,
        thumbnail: "Sin imagen",
        code: "abc123",
        stock: 25
    });
} catch (error) {
    console.error(error.message); // se muestra el mensaje de error
}

// getProductById debe devolver el producto agregado
const retrievedProduct = productManager.getProductById(newProduct.id);

console.log(retrievedProduct); // se muestra el producto recuperado

// getProductById debe arrojar un error si el producto no existe
try {
    productManager.getProductById("prueba");
} catch (error) {
    console.error(error.message); // se muestra el mensaje de error
}