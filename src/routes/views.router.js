import { Router } from 'express';
import { ProductManager } from '../utils/ProductManager.js';
import producstModel from '../dao/models/products.model.js';

const router = Router();
const prodManager = new ProductManager('./products.json');




router.get('/', async(req, res)=>{
    //const products = await prodManager.getProducts();
    let products = await producstModel.find().lean();
    res.status(200).render('home', {products})
})


router.get('/realtimeproducts', async(req, res)=>{
    //const products = await prodManager.getProducts();
    let products = await producstModel.find().lean();
    res.status(200).render('rtProducts', {products});
})



export default router;