import { Router } from 'express';
import { productManager } from '../dao/managers/productManager.js';
import { io } from 'socket.io-client';
import productsModel from '../dao/models/products.model.js';
import mongoose from "mongoose";

const router = Router();
const prodManager = new productManager('./products.json');
//prodManager.init();  //Descomentar para utilizar FS

router.get('/:pid', async(req,res)=>{
    //getProductByIdFromFile(req,res); //--> Comentado para que ejecute solamente los métodos de Bases de Datos 
    getProductByIdFromDB(req,res);
    
})

router.get('/:limit?:page?:sort?:qry?', async(req,res)=>{
    //getAllProductsFromFile(req,res); //--> Comentado para que ejecute solamente los métodos de Bases de Datos
    //getAllProductsFromDB(req, res);
    getAllProductsFromDbByPage(req,res);
    
});


router.post('/',async(req, res)=>{
    const socket = io('http://localhost:8080');
    //insertProductFS(req,res,socket); //--> Comentado para que ejecute solamente los métodos de Bases de Datos
    insertProductBD(req,res,socket);
})

router.put('/:pid', async(req,res)=>{
    //updateProductFS(req,res); //--> Comentado para que ejecute solamente los métodos de Bases de Datos
    updateProductBD(req,res);
})

router.delete('/:pid', async(req,res)=>{
    const socket = io('http://localhost:8080');
    //deleteProductFS(req,res,socket); //--> Comentado para que ejecute solamente los métodos de Bases de Datos
    deleteProductBD(req,res,socket);
})


//----> Métodos, para mantener ambos comportamientos de utilizar filesystem o database

const getAllProductsFromDB=async(req, res)=>{
    
    if(req.query.limit!=null){
        let limit = +req.query.limit;
        let prodsFromDb = await productsModel.find().lean().limit(limit);
        res.status(200).send({error: null , data: prodsFromDb});
    }else{
        let prodsFromDb = await productsModel.find().lean();
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
        let process = await productsModel.findById(idObj);
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

const insertProductBD = async(req, res, socket)=>{
    if(req.body.hasOwnProperty('title') && req.body.hasOwnProperty('description') && req.body.hasOwnProperty('code') && req.body.hasOwnProperty('price') && req.body.hasOwnProperty('stock') && req.body.hasOwnProperty('category')){
        let newProduct={};
        if(req.body.hasOwnProperty('thumbnails')){
            newProduct = {id : incrementLastProductId(), title: req.body.title, description: req.body.description, code: req.body.code, price: req.body.price, status: true, stock: req.body.stock, category: req.body.category, thumbnails: req.body.thumbnails};
        }else{
            newProduct = {id : incrementLastProductId(), title: req.body.title, description: req.body.description, code: req.body.code, price: req.body.price, status: true, stock: req.body.stock, category: req.body.category, thumbnails: []}
        }
        let process = await productsModel.create(newProduct);
        if(process){
            res.status(201).send({ error: null, data: process});
            socket.emit('newProd',process);
        }else{
            res.status(500).send({ error: 'Internal Server Error', data: []});
        }
    }else{
        res.status(400).send({ error: 'Missing mandatory fields.', data: [] });
    }

}

const insertProductFS = async(req, res, socket)=>{
    if(req.body.hasOwnProperty('title') && req.body.hasOwnProperty('description') && req.body.hasOwnProperty('code') && req.body.hasOwnProperty('price') && req.body.hasOwnProperty('stock') && req.body.hasOwnProperty('category')){
        let newProduct={};
        if(req.body.hasOwnProperty('thumbnails')){
            newProduct = {id : incrementLastProductId(), title: req.body.title, description: req.body.description, code: req.body.code, price: req.body.price, status: true, stock: req.body.stock, category: req.body.category, thumbnails: req.body.thumbnails};
        }else{
            newProduct = {id : incrementLastProductId(), title: req.body.title, description: req.body.description, code: req.body.code, price: req.body.price, status: true, stock: req.body.stock, category: req.body.category, thumbnails: []}
        }
        prodManager.addProduct(newProduct);
        res.status(201).send({ error: null, data: newProduct});
        socket.emit('newProd',newProduct);
    }else{
        res.status(400).send({ error: 'Missing mandatory fields.', data: [] });
    }
    
}

const updateProductBD = async(req,res)=>{
    let pid = req.params.pid;
    let filter = {_id: pid};

    if(req.body.hasOwnProperty('title') && req.body.hasOwnProperty('description') && req.body.hasOwnProperty('code') && req.body.hasOwnProperty('price') && req.body.hasOwnProperty('stock') && req.body.hasOwnProperty('category') && req.body.hasOwnProperty('thumbnails') && req.body.hasOwnProperty('status')){
        let updated = req.body;
        let options = {new: true}; // para que retorne el objeto nuevo, no el original. Así visualizo el cambio en el response.
        let process = await productsModel.findOneAndUpdate(filter, updated, options);
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
        let process = await productsModel.findOneAndDelete(idObj, options)
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

const getAllProductsFromDbByPage = async(req,res)=>{
    let page = +req.query.page || 1;
    let limit = +req.query.limit || 10;
    let process = null;
    if(req.query.sort){
        let sort = req.query.sort;
        if(req.query.qry){
            let qry = req.query.qry;
            process = await productsModel.paginate({title:{$regex: '.*' + qry + '.*'}},{limit:limit, page:page, sort: {price: sort}, lean:true});
        }else{
            process = await productsModel.paginate({},{limit:limit, page:page, sort: {price: sort}, lean:true});
        }
    }else{
        if(req.query.qry){
            let qry = req.query.qry;
            process = await productsModel.paginate({title:{$regex: '.*' + qry + '.*'}},{limit:limit, page:page, lean:true});
        }else{
            process = await productsModel.paginate({},{limit:limit, page:page, lean:true});
        }
    }

    if(process){
        res.status(200).send({error: null , data: process});
    }else{
        res.status(500).send({ error: 'Internal Server Error.', data: [] });
    }
}

export default router;