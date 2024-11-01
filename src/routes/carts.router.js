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

router.get('/', async(req,res)=>{
    let process = await cartsModel.find().lean();
    if(process){
        res.status(200).send({error: null , data: process});
    }else{
        res.status(404).send({ error: 'No Cart found.', data: [] });
    }
})

router.post('/', async(req,res)=>{
    //insertCartFS(res);
    insertCartBD(req,res);
});

router.put('/:cid', async(req,res)=>{
    let cid = req.params.cid;
    if(mongoose.isObjectIdOrHexString(cid)){
        let idObj = {_id: cid};
        let newProd = req.body._id;
        if(mongoose.isObjectIdOrHexString(newProd)){
            let options = {new : true};
            let process = await cartsModel.findById(cid);
            if(process){
                let foundFlag =false;
                for(let i=0; i<process.productList.length; i++){
                    if(process.productList[i]._id == newProd){
                        foundFlag=true;
                        process.productList[i].qty+=1;
                    }
                }

                if(!foundFlag){
                    process.productList.push({qty : 1, _id: newProd})
                }

                let processUpdated = await cartsModel.findOneAndUpdate(idObj, process, options); //-> Busca carrito por id
                if(processUpdated){
                    res.status(200).send({error: null , data: processUpdated});
                }else{
                    res.status(500).send({ error: 'Internal Server Error.', data: [] });
                }
            }else{
                res.status(404).send({ error: 'Cart not found.', data: [] });
            }
        }else{
            res.status(400).send({ error: 'Product Id sent in body must be a 24 character hex string.', data: [] });
        }
        
        
    }else{
        res.status(400).send({ error: 'Cart Id must be a 24 character hex string.', data: [] });
    }
});

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

const insertProdIntoCartFS= async(req,res)=>{
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
}

const insertProdIntoCartBD= async(req,res)=>{
    let cid = req.params.cid;
    let pid = req.params.pid;    
    if(mongoose.isObjectIdOrHexString(cid)){
        if(mongoose.isObjectIdOrHexString(pid)){
            let cartIdObj = {_id: cid};
            let productIdObj = {_id: pid};
            let process = cartsModel.findByIdAndUpdate(cartIdObj, );
        }else{
            res.status(400).send({ error: 'Product Id must be a 24 character hex string.', data: [] });
        }
    }else{
        res.status(400).send({ error: 'Cart Id must be a 24 character hex string.', data: [] });
    }
}

router.post('/:cid/product/:pid', async(req,res)=>{
    
})


export default router;