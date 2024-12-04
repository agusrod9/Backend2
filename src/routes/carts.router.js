import { Router } from 'express';
import productsModel from '../dao/models/products.model.js';
import { create, readAllPopulated, readByIdPopulated, update, deleteById, readById } from '../dao/managers/cartManager.js';
import passport from '../middlewares/passport.mid.js';
import mongoose from "mongoose";

const router = Router();

router.get('/' , passport.authenticate('isAdmin', {session:false}),  readAllCarts)
router.get('/:cid', readCartById);
router.post('/', createEmptyCart);
router.put('/:cid', addProductToCartById);
router.delete('/:cid', deleteCartById);


async function readAllCarts(req,res){
    let populateOpts = {path: 'productList._id', model: productsModel};
    let process = await readAllPopulated(populateOpts);
    if(process){
        res.status(200).send({error: null , data: process});
    }else{
        res.status(404).send({ error: 'No Cart found.', data: [] });
    }
}

async function readCartById(req,res) {
    let {cid} = req.params;
    if(mongoose.isObjectIdOrHexString(cid)){
        let populateOpts = {path: 'productList._id', model: productsModel}
        let process = await readByIdPopulated(cid, populateOpts);
        if(process){
            res.status(200).send({error: null , data: process});
        }else{
            res.status(404).send({ error: 'Cart not found.', data: [] });
        }
    }else{
        res.status(400).send({ error: 'Cart Id must be a 24 character hex string.', data: [] });
    }
}

async function createEmptyCart(req, res) {
    if(!req.body.hasOwnProperty('user')){
        res.status(400).send({ error: 'Missing mandatory fields.', data: [] });
    }else{
        let userId = req.body.user;
        if(mongoose.isObjectIdOrHexString(userId)){
            let userIdObj = {_id: userId};
            let newEmptyCart = {userId : userIdObj};
            let process = await create(newEmptyCart);
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

async function addProductToCartById(req,res){
    let {cid} = req.params;
    if(mongoose.isObjectIdOrHexString(cid)){
        let idObj = {_id: cid};
        let newProd = req.body._id;
        if(mongoose.isObjectIdOrHexString(newProd)){
            let process = await readById(cid);
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

                let processUpdated = await update(idObj, process);
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
}

async function deleteCartById(req,res){
    let {cid} = req.params;
    if(mongoose.isObjectIdOrHexString(cid)){
        let idObj = {_id: cid};
        let process = await deleteById(idObj)
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