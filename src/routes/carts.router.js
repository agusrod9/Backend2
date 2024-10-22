import { Router } from 'express';
import { CartManager } from '../utils/CartManager.js';
import { incrementLastCartId } from '../utils/filesystem.js';
import cartsModel from '../dao/models/carts.model.js';
import mongoose from "mongoose";

const router = Router();
const cartsManager = new CartManager('./carts.json');

//await cartsManager.init(); //Descomentar para utilizar FS

router.get('/:cid', async(req,res)=>{
    //getCartByIdFS(req,res);
    getCartByIdBD(req,res);
});

const insertCartFS = async(res)=>{
    let newCart = {id: incrementLastCartId(), products : []}
    cartsManager.addCart(newCart);
    res.status(200).send({error: null, data: newCart})
}

const insertCartBD = async(req,res)=>{
    if(!req.body.hasOwnProperty('user')){
        res.status(400).send({ error: 'Missing mandatory fields.', data: [] });
    }else{
        let userId = req.body.user;
        if(mongoose.isObjectIdOrHexString(userId)){
            let userIdObj = {_id: userId};
            let newEmptyCart = {userId : userIdObj, producList : [], totalAmount : 0, purchased : false, purchaseDate : null};
            let process = await cartsModel.create(newEmptyCart)
            if(process){
                res.status(201).send({ error: null, data: process});
            }else{
                res.status(500).send({ error: 'Internal Server Error', data: []});
              }
        }else{
            res.status(400).send({ error: 'User Id must be a 24 character hex string.', data: [] });
        }
    }   
}

router.post('/', async(req,res)=>{
    //insertCartFS(res);
    insertCartBD(req,res);
})

router.post('/:cid/product/:pid', async(req,res)=>{
    let carts = await cartsManager.getCarts();
    let cid = +req.params.cid;
    let pid = +req.params.pid;
    let index = carts.findIndex(element=>element.id===cid);

    if(index>-1){
        let prodIndex = carts[index].products.findIndex(element=>element.id===pid);
        //prod encontrado en el cart dado, incremento la cantidad.
        if(prodIndex>-1){
            let qty = carts[index].products[prodIndex].quantity;
            qty++;
            carts[index].products[prodIndex].quantity = qty; 
        }else{
            carts[index].products.push({id: pid, quantity:1})
        };
        cartsManager.replaceCart(cid,carts[index]);
        res.status(200).send({error: null, data: carts[index]});
    }else{
        res.status(404).send({error: 'Cart not found.', data: []});
    }
})

//----> Métodos, para mantener ambos comportamientos de utilizar filesystem o database

const getCartByIdFS= async(req,res)=>{
    let cid = +req.params.cid;
    let carts = await cartsManager.getCarts();
    let index = carts.findIndex(element=>element.id===cid)

    if(index>-1){
        res.status(200).send({error: null, data: carts[index]});
    }else{
        res.status(404).send({error: 'Cart not found.', data: []});
    }
}

const getCartByIdBD= async(req,res)=>{
    let cid = req.params.cid;
    if(mongoose.isObjectIdOrHexString(cid)){
        let idObj = {_id: cid};
        let process = await cartsModel.findById(idObj);
        if(process){
            res.status(200).send({error: null , data: process});
        }else{
            res.status(404).send({ error: 'Cart not found.', data: [] });
        }
    }else{
        res.status(400).send({ error: 'Cart Id must be a 24 character hex string.', data: [] });
    }
}



export default router;