import express from 'express';
import prodsRouter from './routes/products.router.js';
import cartsRouter from './routes/carts.router.js';
import config from './config.js';
import { CartManager } from './utils/CartManager.js';


const cartsManager = new CartManager('./carts.json');


await cartsManager.init();
const app = express();
const port = config.port;

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use('/api/products', prodsRouter);
app.use('/api/carts', cartsRouter);



app.listen(port, ()=>{
    console.log(`Listening on Port ${port}`);
})


