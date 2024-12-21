import express from 'express';
import mongoose from 'mongoose';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import {Server} from 'socket.io';
import config from './utils/config.js';
import argsUtil from './utils/args.util.js';
import envUtil from './utils/env.util.js';
import handlebars from 'express-handlebars';
import homeRouter from './routes/home.router.js';
import prodsRouter from './routes/products.router.js';
import cartsRouter from './routes/carts.router.js';
import viewsRouter from './routes/views.router.js';
import cookiesRouter from './routes/cookies.router.js';
import sessionsRouter from './routes/sessions.router.js';
import pathHandler from './middlewares/pathHandler.mid.js';
import errorHandler from './middlewares/errorHandler.mid.js';


//Environment variables
const {PORT, MONGO_REMOTE_URI, COOKIES_SECRET, MONGO_LOCAL_URI} = envUtil;

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

//Routers
app.use('/api/products', prodsRouter);
app.use('/api/carts', cartsRouter);
app.use('/api/cookies', cookiesRouter);
app.use('/api/sessions', sessionsRouter);
app.use('/views', viewsRouter);
app.use('/', homeRouter);

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
    console.log(`SERVER(mode:${argsUtil.env}) LISTENING ON PORT ${PORT}`);
    if(argsUtil.persistence === 'mongo'){ 
        await mongoDbConnect();
    }else if(argsUtil.persistence === 'mongolocal'){
        await mongoLocalConnect();
    }else{
        await mongoDbConnect(); //conecta x defecto a mongo aunque no lo indiquemos en args. (ejemplo si ejecutamos directamente src/app con node)
        
    }
}

async function mongoDbConnect(){
    try{
        await mongoose.connect(MONGO_REMOTE_URI);
        console.log("MONGO DB CONNECTION : SUCCESS");
    }catch{
        console.log("MONGO DB CONNECTION : ERROR - COULD NOT CONNECT TO DATABASE");
        process.exit;
    }
}

async function mongoLocalConnect(){
    try{
        await mongoose.connect(MONGO_LOCAL_URI);
        console.log("MONGO ---LOCAL--- DB CONNECTION : SUCCESS");
    }catch{
        console.log("MONGO ---LOCAL--- DB CONNECTION : ERROR - COULD NOT CONNECT TO DATABASE");
        process.exit;
    }
}
