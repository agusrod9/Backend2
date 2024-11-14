import express from 'express';
import prodsRouter from './routes/products.router.js';
import cartsRouter from './routes/carts.router.js';
import config from './config.js';
import handlebars from 'express-handlebars';
import viewsRouter from './routes/views.router.js';
import {Server} from 'socket.io';
import mongoose from 'mongoose';
import "dotenv/config.js"
import morgan from 'morgan';
import pathHandler from './middlewares/pathHandler.mid.js';
import errorHandler from './middlewares/errorHandler.mid.js';

const app = express();
const port = process.env.PORT;

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static(`${config.dirName}/public`));
app.use(morgan("dev"));
app.use('/api/products', prodsRouter);
app.use('/api/carts', cartsRouter);
app.use('/views', viewsRouter);
app.use(pathHandler);
app.use(errorHandler)


app.engine('handlebars', handlebars.engine());
app.set('views',`${config.dirName}/views`);
app.set('view engine', 'handlebars');


const httpServer = app.listen(port, async ()=>{
    try{
        await mongoose.connect(process.env.MONGO_REMOTE_URI)
        console.log(`Listening on Port ${port}`);
    }catch{
        console.log("Could not connect with DataBase.")
        process.exit;
    }
})

const socketServer = new Server(httpServer);

socketServer.on('connection', socket => {
    console.log(`Client CONNECTION: ${socket.id}`);
    socket.on('disconnect', ()=>{
        console.log(`Client DISCONNECTION: ${socket.id}`);
    })

    socket.on('newProd', prod => {
        socketServer.emit('refreshNewProd', prod)
    })

    socket.on('dropProd', prod =>{
        socketServer.emit('refreshDropProduct', prod)
    })
});

