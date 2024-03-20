import express from 'express';
import handlebars from 'express-handlebars';
import fs from 'fs';
import __dirname from './utils/utils.js';
import productsRouter from './routes/products.router.js';
import cartsRouter from './routes/carts.router.js';
import viewsRouter from './routes/views.router.js';
import realTimeProductsRouter from './routes/realTimeProducts.router.js';
import { Server } from 'socket.io';

const app = express();

app.engine('handlebars', handlebars.engine());
app.set('views', `${__dirname}/../views`);
app.set('view engine', 'handlebars');

app.use(express.static(`${__dirname}/../../public`));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/', viewsRouter);
app.use('/realtimeproducts', realTimeProductsRouter);
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);

const PORT = 8080;
const BASE_URL = "http://localhost"
const httpServer = app.listen(PORT, () => {
    console.log(`Servidor activo en ${BASE_URL}:${PORT}`);
});

const io = new Server(httpServer);

let products = [];

function sendProductList() {
    io.emit('productList', products);
}

fs.readFile('./src/utils/products.json', 'utf8', (error, data) => {
    if (error) {
        console.error("Error al leer el archivo:", error);
        return;
    }
    products = JSON.parse(data);
    sendProductList();
});

function updateProductListInFile(products) {
    fs.writeFile('./src/utils/products.json', JSON.stringify(products, null, '\t'), (error) => {
        if (error) {
            console.error("Error al guardar productos en el archivo:", error);
        } else {
            console.log("Productos guardados en el archivo correctamente.");
        }
    });
}

io.on('connection', socket => {
    console.log("Nuevo cliente conectado:", socket.id);

    sendProductList();

    socket.on('addProduct', newProduct => {
        const productId = products.length > 0 ? products[products.length - 1].id + 1 : 1;
        
        newProduct.id = parseInt(productId);
        newProduct.price = parseInt(newProduct.price);
        newProduct.stock = parseInt(newProduct.stock);

        products.push(newProduct);

        updateProductListInFile(products);

        sendProductList();
    });

    socket.on('productClicked', productId => {
        products = products.filter(product => product.id !== productId);

        updateProductListInFile(products);

        sendProductList();
    });

    socket.on('disconnect', () => {
        console.log("Cliente desconectado:", socket.id);
    });
});