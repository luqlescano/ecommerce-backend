import productModel from './dao/models/productModel.js';
import messageModel from './dao/models/messageModel.js';

export default (io) => {
    const messages = []; 

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

        socket.on("message", data => {
            messages.push(data);

            io.emit("messagesLogs", messages);
        });

        socket.on("userConnect", data => {
            socket.emit("messagesLogs", messages);
            socket.broadcast.emit("newUser", data);
        });
    
        socket.on('disconnect', () => {
            console.log("Cliente desconectado:", socket.id);
        });
    });
}