import productModel from './dao/models/productModel.js';

export default (io) => {
    io.on('connection', socket => {
        console.log("Nuevo cliente conectado:", socket.id);
    
        productModel.find({})
        .then(products => {
            socket.emit('productList', products);
        })
        .catch(error => {
            console.error("Error al obtener productos:", error);
        });

        socket.on('addProduct', newProduct => {
            productModel.create(newProduct)
                .then(() => {
                    productModel.find({})
                        .then(products => {
                            socket.emit('productList', products);
                        })
                        .catch(error => {
                            console.error("Error al obtener productos:", error);
                        });
                })
                .catch(error => {
                    console.error("Error al agregar producto:", error);
                });
        });

        socket.on('productClicked', productId => {
            productModel.findByIdAndDelete(productId)
                .then(() => {
                    productModel.find({})
                        .then(products => {
                            socket.emit('productList', products);
                        })
                        .catch(error => {
                            console.error("Error al obtener productos:", error);
                        });
                })
                .catch(error => {
                    console.error("Error al eliminar producto:", error);
                });
        });        
    
        socket.on('disconnect', () => {
            console.log("Cliente desconectado:", socket.id);
        });
    });
}