import { Router } from 'express';
import passport from '../middlewares/passport.mid.js';
import { readProductById, readAllProductsPaginated, createProduct, updateProduct, deleteProduct } from '../controllers/products.controller.js';

const router = Router();

router.get('/:pid', readProductById);

router.get('/:limit?:page?:sort?:qry?', readAllProductsPaginated);

router.post('/', passport.authenticate('isAdmin', {session:false}), createProduct);

router.put('/:pid', passport.authenticate('isAdmin', {session:false}), updateProduct);

router.delete('/:pid', passport.authenticate('isAdmin', {session:false}), deleteProduct);


export default router;