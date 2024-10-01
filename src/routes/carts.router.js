import { Router } from 'express';
import { CartManager } from '../utils/CartManager.js';
import { incrementLastCartId } from '../utils/filesystem.js';


const router = Router();
const cartsManager = new CartManager('./carts.json');

await cartsManager.init();

router.get('/:cid', async(req,res)=>{
    let carts = await cartsManager.getCarts();
    let cid = +req.params.cid;
    let index = carts.findIndex(element=>element.id===cid)

    if(index>-1){
        res.status(200).send({error: null, data: carts[index]});
    }else{
        res.status(404).send({error: 'Cart not found.', data: []});
    }
    
});

router.post('/', async(req,res)=>{
    let newCart = {id: incrementLastCartId(), products : []}
    cartsManager.addCart(newCart);
    res.status(200).send({error: null, data: newCart})
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
            console.log("NO lo encontro, lo agrego")
            carts[index].products.push({id: pid, quantity:1})
        };
        cartsManager.replaceCart(cid,carts[index]);
        res.status(200).send({error: null, data: carts[index]});
    }else{
        res.status(404).send({error: 'Cart not found.', data: []});
    }
})

export default router;