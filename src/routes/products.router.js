import { Router } from 'express';
import { ProductManager } from '../utils/ProductManager.js';
import { incrementLastProductId } from '../utils/filesystem.js';
import { io } from 'socket.io-client';
import producstModel from '../dao/models/products.model.js';

const router = Router();
const prodManager = new ProductManager('./products.json');


prodManager.init();


router.get('/', async(req,res)=>{

    let prods = await prodManager.getProducts();
    let prodsFromDb = await producstModel.find().lean();
    if(req.query.limit!=null){
        let limit = +req.query.limit;
        prods = prods.slice(0,limit);
        res.status(200).send({error: null , data: prods});
    }else{
        res.status(200).send({error: null , data: prods});
    }
});


router.get('/:pid', async(req,res)=>{
    
    let prods = await prodManager.getProducts();
    let pid = +req.params.pid;
    let index = prods.findIndex(element => element.id===pid);
    if(index>-1){
        res.status(200).send({error: null , data: prods[index]});
    }else{
        res.status(404).send({ error: 'Product not found.', data: [] });
    }
})

router.post('/',async(req, res)=>{
    const socket = io('http://localhost:8080');
    if(req.body.hasOwnProperty('title') && req.body.hasOwnProperty('description') && req.body.hasOwnProperty('code') && req.body.hasOwnProperty('price') && req.body.hasOwnProperty('stock') && req.body.hasOwnProperty('category')){
        
        if(req.body.hasOwnProperty('thumbnails')){
            var newProduct = {id : incrementLastProductId(), title: req.body.title, description: req.body.description, code: req.body.code, price: req.body.price, status: true, stock: req.body.stock, category: req.body.category, thumbnails: req.body.thumbnails };
        }else{
            var newProduct = {id : incrementLastProductId(), title: req.body.title, description: req.body.description, code: req.body.code, price: req.body.price, status: true, stock: req.body.stock, category: req.body.category, thumbnails: [] }
        }
        //let process = await producstModel.create(newProduct);
        prodManager.addProduct(newProduct);
        res.status(200).send({ error: null, data: process });
        socket.emit('newProd',newProduct);

    }else{
        res.status(400).send({ error: 'Missing mandatory fields.', data: [] });
    }
})

router.put('/:pid', async(req,res)=>{
    let prods = await prodManager.getProducts();
    let pid = req.params.pid;
    let index = prods.findIndex(element => element.id===pid);
    
    if(req.body.hasOwnProperty('title') && req.body.hasOwnProperty('description') && req.body.hasOwnProperty('code') && req.body.hasOwnProperty('price') && req.body.hasOwnProperty('stock') && req.body.hasOwnProperty('category') && req.body.hasOwnProperty('thumbnails') && req.body.hasOwnProperty('status')){
        //DB
        let filter = {_id: pid};
        let updated = req.body;
        let options = {new: true};
        let process = await producstModel.findOneAndUpdate(filter, updated, options)
        res.status(200).send({error: null, data: process}); //cambio updatedProd por process
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

})

router.delete('/:pid', async(req,res)=>{
    const socket = io('http://localhost:8080');
    let prods = await prodManager.getProducts();
    let pid = req.params.pid;   //era +req.params.pid; para archivos, lo saco para bd 
    let index = prods.findIndex(element => element.id===pid);

    //DB
    let filter = {_id: pid};
    let updated = req.body;
    let options = {new: true};
    let process = await producstModel.findOneAndDelete(filter, updated, options)
    res.status(200).send({error: null, data: process}); //cambio updatedProd por process
/* //DESCOMENTAR PARA TRABAJAR SIN BD --> es porquie sinó me daba error Error [ERR_HTTP_HEADERS_SENT]: Cannot set headers after they are sent to the client por mandar muchos request
    if(index>-1){
        let prodToDelete = prods[index];
        prods.splice(index,1);
        prodManager.deleteProduct(prodToDelete);
        res.status(200).send({error: null, data: prodToDelete});
        socket.emit('dropProd',prodToDelete);
    }else{
        res.status(404).send({ error: 'Product not found.', data: [] });
    }
        */
})

export default router;