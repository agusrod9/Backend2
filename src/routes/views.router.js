import { Router } from 'express';
import productsModel from '../dao/models/products.model.js';
import cartsModel from '../dao/models/carts.model.js';

const router = Router();

router.get('/', async(req, res)=>{
    let products = await productsModel.find().lean();
    res.status(200).render('products', {products, title: "Products"})
})


router.get('/realtimeproducts', async(req, res)=>{
    let products = await productsModel.find().lean();
    res.status(200).render('rtProducts', {products});
})

router.get('/cart:cid', async(req,res)=>{
    let cid = req.params.cid;
    let cart = await cartsModel.find({_id: cid}).populate({path: 'productList._id', model: productsModel}).lean();
    res.status(200).render('cart', {cart});
})

router.get('/cart', async(req,res)=>{
    //funciona porque mi modelo sería con un cart siempre. al comprarlo o borrarlo se borra. Nunca hay más de uno.
    let cart = await cartsModel.find().populate({path: 'productList._id', model: productsModel}).lean(); 
    res.status(200).render('cart', {cart});
})


export default router;