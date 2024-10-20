import { Router } from 'express';
import { ProductManager } from '../utils/ProductManager.js';
import { incrementLastProductId } from '../utils/filesystem.js';
import { io } from 'socket.io-client';
import producstModel from '../dao/models/products.model.js';
import mongoose from "mongoose";

const router = Router();
const prodManager = new ProductManager('./products.json');
prodManager.init();

router.get('/', async(req,res)=>{
    //getAllProductsFromFile(req,res);
    getAllProductsFromDB(req, res);
    
});

router.get('/:pid', async(req,res)=>{
    //getProductByIdFromFile(req,res)
    getProductByIdFromDB(req,res);
    
})

router.post('/',async(req, res)=>{
    const socket = io('http://localhost:8080');
    if(req.body.hasOwnProperty('title') && req.body.hasOwnProperty('description') && req.body.hasOwnProperty('code') && req.body.hasOwnProperty('price') && req.body.hasOwnProperty('stock') && req.body.hasOwnProperty('category')){
        let newProduct={};
        if(req.body.hasOwnProperty('thumbnails')){
            newProduct = {id : incrementLastProductId(), title: req.body.title, description: req.body.description, code: req.body.code, price: req.body.price, status: true, stock: req.body.stock, category: req.body.category, thumbnails: req.body.thumbnails};
        }else{
            newProduct = {id : incrementLastProductId(), title: req.body.title, description: req.body.description, code: req.body.code, price: req.body.price, status: true, stock: req.body.stock, category: req.body.category, thumbnails: []}
        }
        //insertProductFS(newProduct,res,socket);
        insertProductBD(newProduct,res,socket);
    }else{
        res.status(400).send({ error: 'Missing mandatory fields.', data: [] });
    }
})

router.put('/:pid', async(req,res)=>{
    //updateProductFS(req,res);
    updateProductBD(req,res);
})

router.delete('/:pid', async(req,res)=>{
    const socket = io('http://localhost:8080');
    //deleteProductFS(req,res,socket);
    deleteProductBD(req,res,socket);
})


//----> Métodos, para mantener ambos comportamientos de utilizar filesystem o database

const getAllProductsFromDB=async(req, res)=>{
    let prodsFromDb = await producstModel.find().lean();
    if(req.query.limit!=null){
        let limit = +req.query.limit;
        prodsFromDb = prodsFromDb.slice(0,limit);
        res.status(200).send({error: null , data: prodsFromDb});
    }else{
        res.status(200).send({error: null , data: prodsFromDb});
    }
}

const getAllProductsFromFile=async(req,res)=>{
    let prods = await prodManager.getProducts();
    if(req.query.limit!=null){
        let limit = +req.query.limit;
        prods = prods.slice(0,limit);
        res.status(200).send({error: null , data: prods});
    }else{
        res.status(200).send({error: null , data: prods});
    }
}

const getProductByIdFromDB=async(req,res)=>{
    let pid = req.params.pid
    if(mongoose.isObjectIdOrHexString(pid)){
        let idObj = {_id: pid};
        let process = await producstModel.findById(idObj);
        if(process){
            res.status(200).send({error: null , data: process});
        }else{
            res.status(404).send({ error: 'Product not found.', data: [] });
        }
    }else{
        res.status(400).send({ error: 'Product Id must be a 24 character hex string.', data: [] });
    }
}

const getProductByIdFromFile=async(req, res)=>{
    let prods = await prodManager.getProducts();
    let pid = +req.params.pid;
    let index = prods.findIndex(element => element.id===pid);
    if(index>-1){
        res.status(200).send({error: null , data: prods[index]});
    }else{
        res.status(404).send({ error: 'Product not found.', data: [] });
    }
}

const insertProductBD = async(product, res, socket)=>{
    let process = await producstModel.create(product);
    if(process){
        res.status(200).send({ error: null, data: process});
        socket.emit('newProd',process);
    }else{
        res.status(500).send({ error: 'Internal Server Error', data: []});
    }
}

const insertProductFS = async(product, res, socket)=>{
    prodManager.addProduct(product);
    res.status(200).send({ error: null, data: product});
    socket.emit('newProd',product);
}

const updateProductBD = async(req,res)=>{
    let pid = req.params.pid;
    let filter = {_id: pid};

    if(req.body.hasOwnProperty('title') && req.body.hasOwnProperty('description') && req.body.hasOwnProperty('code') && req.body.hasOwnProperty('price') && req.body.hasOwnProperty('stock') && req.body.hasOwnProperty('category') && req.body.hasOwnProperty('thumbnails') && req.body.hasOwnProperty('status')){
        let updated = req.body;
        let options = {new: true}; // para que retorne el objeto nuevo, no el original. Así visualizo el cambio en el response.
        let process = await producstModel.findOneAndUpdate(filter, updated, options);
        
        if(process){
            res.status(200).send({error: null, data: process});
        }else{
            res.status(404).send({ error: 'Product not found.', data: [] });
        }
    }else{
        res.status(400).send({ error: 'Missing mandatory fields.', data: [] });
    }
}

const updateProductFS = async(req,res)=>{
    let prods = await prodManager.getProducts();
    let pid = +req.params.pid;
    let index = prods.findIndex(element => element.id===pid);
    
    if(req.body.hasOwnProperty('title') && req.body.hasOwnProperty('description') && req.body.hasOwnProperty('code') && req.body.hasOwnProperty('price') && req.body.hasOwnProperty('stock') && req.body.hasOwnProperty('category') && req.body.hasOwnProperty('thumbnails') && req.body.hasOwnProperty('status')){
        if(index>-1){
            let updatedProd = prods[index];
            updatedProd.title = req.body.title;
            updatedProd.description = req.body.description;
            updatedProd.code = req.body.code;
            updatedProd.price = req.body.price;
            updatedProd.status = req.body.status;
            updatedProd.stock = req.body.stock;
            updatedProd.category = req.body.category;
            updatedProd.thumbnails = req.body.thumbnails;
            prods[index]=updatedProd;
            prodManager.replaceProduct(pid,updatedProd);
            res.status(200).send({error: null, data: updatedProd});
        }else{
            res.status(404).send({ error: 'Product not found.', data: [] });
        }
    }else{
        res.status(400).send({ error: 'Missing mandatory fields.', data: [] });
    }
}

const deleteProductBD=async(req,res, socket)=>{
    let pid = req.params.pid;
    if(mongoose.isObjectIdOrHexString(pid)){
        let idObj = {_id: pid};
        let options = {new: true};
        let process = await producstModel.findOneAndDelete(idObj, options)
        if(process){
            res.status(200).send({error: null , data: process});
            socket.emit('dropProd',process);
        }else{
            res.status(404).send({ error: 'Product not found.', data: [] });
        }
    }else{
        res.status(400).send({ error: 'Product Id must be a 24 character hex string.', data: [] });
    }
}

const deleteProductFS=async(req,res, socket)=>{
    let prods = await prodManager.getProducts();
    let pid = +req.params.pid;   //era +req.params.pid; para archivos, lo saco para bd 
    let index = prods.findIndex(element => element.id===pid);

    if(index>-1){
        let prodToDelete = prods[index];
        prods.splice(index,1);
        prodManager.deleteProduct(prodToDelete);
        res.status(200).send({error: null, data: prodToDelete});
        socket.emit('dropProd',prodToDelete);
    }else{
        res.status(404).send({ error: 'Product not found.', data: [] });
    }
}

export default router;