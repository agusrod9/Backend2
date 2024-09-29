import { Router } from 'express';
import { ProductManager } from './../ProductManager.js';

const router = Router();
const prodManager = new ProductManager('../products.json');

//prev api/products pero ahora está en product.routes
router.get('/', (req,res)=>{
    prodManager.init();
    let prods = prodManager.getProducts();
    res.status(200).send({error: null , prods});
    
});

export default router;