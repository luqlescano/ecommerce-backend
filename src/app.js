import express from 'express';
import handlebars from 'express-handlebars';
import __dirname from './utils/utils.js';
import productsRouter from './routes/products.router.js';
import cartsRouter from './routes/carts.router.js';
import viewsRouter from './routes/views.router.js';
import realTimeProductsRouter from './routes/realTimeProducts.router.js';
import chatRouter from './routes/chat.router.js';
import usersRouter from './routes/users.router.js';
import { Server } from 'socket.io';
import websocket from './websocket.js';
import mongoose from 'mongoose';
import session from 'express-session';
import mongoStore from 'connect-mongo';
import { auth } from './middlewares/auth.js';
import passport from 'passport';
import initializePassport from './config/passportConfig.js';

const app = express();

const uri = "mongodb+srv://llescano:JGjSxK4EBecgPUCY@cluster0.k2krnep.mongodb.net/ecommerce?retryWrites=true&w=majority&appName=Cluster0";
mongoose.connect(uri)
        .then(() => console.log("Conexión con MongoDB Atlas exitosa"))
        .catch((error) => console.error("Hubo un error al querer conectar con MongoDB Atlas:", error));

app.engine('handlebars', handlebars.engine());
app.set('views', `${__dirname}/../views`);
app.set('view engine', 'handlebars');

app.use(express.static(`${__dirname}/../../public`));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(session(
    {
        store: mongoStore.create(
            {
                mongoUrl: uri,
                ttl: 20
            }
        ),
        secret: 'secretPhrase',
        resave: true,
        saveUninitialized: true
    }
));

initializePassport();
app.use(passport.initialize());
app.use(passport.session());

app.use('/', viewsRouter);
app.use('/realtimeproducts', auth, realTimeProductsRouter);
app.use('/chat', auth, chatRouter);
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);
app.use('/api/sessions', usersRouter);

app.get('/logout', (req, res) => {
    req.session.destroy((e) => {
      if (e) {
        console.error(e);
        res.status(500).send('Error al cerrar sesión');
        return;
      }
  
      res.redirect('/login')
    });
  });

const PORT = 8080;
const BASE_URL = "http://localhost"
const httpServer = app.listen(PORT, () => {
    console.log(`Servidor activo en ${BASE_URL}:${PORT}`);
});

const io = new Server(httpServer);

websocket(io);