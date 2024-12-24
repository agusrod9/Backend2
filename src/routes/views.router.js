import { Router } from 'express';
import productsModel from '../dao/models/products.model.js';
import cartsModel from '../dao/models/carts.model.js';
import passport from '../middlewares/passport.mid.js';

const router = Router();

router.get('/', passport.authenticate('isOnline', {session:false}), async(req, res)=>{
    let products = await productsModel.find().lean();
    res.status(200).render('products', {products, title: "Products"})
})


router.get('/realtimeproducts', passport.authenticate('isOnline', {session:false}), async(req, res)=>{
    let products = await productsModel.find().lean();
    res.status(200).render('rtProducts', {products, title: "Real time products"});
})

router.get('/cart:cid', passport.authenticate('isOnline', {session:false}), async(req,res)=>{
    let cid = req.params.cid;
    let cart = await cartsModel.find({_id: cid}).populate({path: 'productList._id', model: productsModel}).lean();
    res.status(200).render('cart', {cart, title: "Cart" });
})

router.get('/cart', passport.authenticate('isOnline', {session:false}) ,async(req,res)=>{
    const userId = req.user;

    let cart = await cartsModel.find({userId : {_id: userId}, purchased : false}).populate({path: 'productList._id', model: productsModel}).lean(); 
    res.status(200).render('cart', {cart, title: "Cart"});
})

router.get('/addProduct', passport.authenticate('isOnline', {session:false}),(req,res)=>{
    res.status(200).render('addProduct', {title: "Add new product"});
})


export default router;