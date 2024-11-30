import express from 'express';
import mongoose from 'mongoose';
import "dotenv/config.js";
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import MongoStore from 'connect-mongo';
import session from 'express-session';
import {Server} from 'socket.io';
import config from './utils/config.js';
import handlebars from 'express-handlebars';
import prodsRouter from './routes/products.router.js';
import cartsRouter from './routes/carts.router.js';
import viewsRouter from './routes/views.router.js';
import cookiesRouter from './routes/cookies.router.js';
import sessionsRouter from './routes/sessions.router.js';
import pathHandler from './middlewares/pathHandler.mid.js';
import errorHandler from './middlewares/errorHandler.mid.js';


//Environment variables
const {PORT, MONGO_REMOTE_URI, COOKIES_SECRET, SESSION_SECRET} = process.env

//Server Instance
const app = express();
const httpServer = app.listen(PORT, ready);


//Socket Server Instance
const socketServer = new Server(httpServer);

//Middlewares
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static(`${config.dirName}/public`));
app.use(morgan("dev"));
app.use(cookieParser(COOKIES_SECRET));
app.use(session({
    name: "sessionCookie",
    secret: SESSION_SECRET,
    resave: true,
    saveUninitialized: true,
    store: new MongoStore({mongoUrl: MONGO_REMOTE_URI, ttl: 60*60*24})
}))

//Routers
app.use('/api/products', prodsRouter);
app.use('/api/carts', cartsRouter);
app.use('/api/cookies', cookiesRouter);
app.use('/api/sessions', sessionsRouter);
app.use('/views', viewsRouter);

///Handlers
app.use(pathHandler);
app.use(errorHandler);

//Handlebars
app.engine('handlebars', handlebars.engine());
app.set('views',`${config.dirName}/views`);
app.set('view engine', 'handlebars');

//Socket Server methods
socketServer.on('connection', socket => {
    console.log(`Client CONNECTION: ${socket.id}`);
    socket.on('disconnect', ()=>{
        console.log(`Client DISCONNECTION: ${socket.id}`);
    })

    socket.on('newProd', prod => {
        socketServer.emit('refreshNewProd', prod);
    })

    socket.on('dropProd', prod =>{
        socketServer.emit('refreshDropProduct', prod);
    })
});

//Server methods
async function ready (){
    console.log(`SERVER LISTENING ON PORT ${PORT}`);
    await dbConnect();
}

async function dbConnect(){
    try{
        await mongoose.connect(MONGO_REMOTE_URI);
        console.log("DATABASE CONNECTION : SUCCESS");
    }catch{
        console.log("DATABASE CONNECTION : ERROR - COULD NOT CONNECT TO DATABASE");
        process.exit;
    }
}
