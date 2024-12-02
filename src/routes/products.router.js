import { Router } from 'express';
import { io } from 'socket.io-client';
import { readById, readAllPaginated, create, update, deleteById} from '../dao/managers/productManager.js'
import mongoose from "mongoose";
import isAdmin from '../middlewares/isAdminVerifier.mid.js';

const router = Router();

router.get('/:pid', readProductById);

router.get('/:limit?:page?:sort?:qry?', readAllProductsPaginated);

router.post('/', isAdmin, createProduct);

router.put('/:pid', isAdmin, updateProduct);

router.delete('/:pid', isAdmin, deleteProduct);


async function readProductById(req,res){
    let {pid} = req.params;
    if(mongoose.isObjectIdOrHexString(pid)){
        let process = await readById(pid);
        if(process){
            res.status(200).send({error: null , data: process});
        }else{
            res.status(404).send({ error: 'Product not found.', data: [] });
        }
    }else{
        res.status(400).send({ error: 'Product Id must be a 24 character hex string.', data: [] });
    }
}

async function readAllProductsPaginated(req,res){
    let {page} = +req.query || 1;
    let {limit} = +req.query || 10;
    let process = null;
    if(req.query.sort){
        let {sort} = req.query;
        if(req.query.qry){
            let {qry} = req.query;
            process = await readAllPaginated({title:{$regex: '.*' + qry + '.*'}},{limit:limit, page:page, sort: {price: sort}, lean:true});
        }else{
            process = await readAllPaginated({},{limit:limit, page:page, sort: {price: sort}, lean:true});
        }
    }else{
        if(req.query.qry){
            let {qry} = req.query;
            process = await readAllPaginated({title:{$regex: '.*' + qry + '.*'}},{limit:limit, page:page, lean:true});
        }else{
            process = await readAllPaginated({},{limit:limit, page:page, lean:true});
        }
    }

    if(process){
        res.status(200).send({error: null , data: process});
    }else{
        res.status(500).send({ error: 'Internal Server Error.', data: [] });
    }
}

async function createProduct(req, res){
    const socket = io('http://localhost:8080');
    if(req.body.hasOwnProperty('title') && req.body.hasOwnProperty('description') && req.body.hasOwnProperty('code') && req.body.hasOwnProperty('price') && req.body.hasOwnProperty('stock') && req.body.hasOwnProperty('category')){
        let newProduct={};
        if(req.body.hasOwnProperty('thumbnails')){
            newProduct = {title: req.body.title, description: req.body.description, code: req.body.code, price: req.body.price, status: true, stock: req.body.stock, category: req.body.category, thumbnails: req.body.thumbnails};
        }else{
            newProduct = { title: req.body.title, description: req.body.description, code: req.body.code, price: req.body.price, status: true, stock: req.body.stock, category: req.body.category, thumbnails: []}
        }
        let process = await create(newProduct);
        if(process){
            socket.emit('newProd',process);
            res.status(201).send({ error: null, data: process});
        }else{
            res.status(500).send({ error: 'Internal Server Error', data: []});
        }
    }else{
        res.status(400).send({ error: 'Missing mandatory fields.', data: [] });
    }

}

async function updateProduct(req,res){
    let {pid} = req.params;
    if(req.body.hasOwnProperty('title') && req.body.hasOwnProperty('description') && req.body.hasOwnProperty('code') && req.body.hasOwnProperty('price') && req.body.hasOwnProperty('stock') && req.body.hasOwnProperty('category') && req.body.hasOwnProperty('thumbnails') && req.body.hasOwnProperty('status')){
        let updated = req.body;
        let process = await update(pid, updated);
        if(process){
            res.status(200).send({error: null, data: process});
        }else{
            res.status(404).send({ error: 'Product not found.', data: [] });
        }
    }else{
        res.status(400).send({ error: 'Missing mandatory fields.', data: [] });
    }
}

async function deleteProduct(req,res){
    const socket = io('http://localhost:8080');
    let {pid} = req.params;
    if(mongoose.isObjectIdOrHexString(pid)){
        let process = await deleteById(pid);
        if(process){
            socket.emit('dropProd',process);
            res.status(200).send({error: null , data: process});
        }else{
            res.status(404).send({ error: 'Product not found.', data: [] });
        }
    }else{
        res.status(400).send({ error: 'Product Id must be a 24 character hex string.', data: [] });
    }
}


export default router;