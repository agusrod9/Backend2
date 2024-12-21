import { Router } from 'express';
import passport from '../middlewares/passport.mid.js';
import { readAllCarts, readCartById, createEmptyCart, addProductToCartById, deleteCartById } from '../controllers/carts.controller.js';


const router = Router();

router.get('/' , passport.authenticate('isAdmin', {session:false}),  readAllCarts)
router.get('/:cid', readCartById);
router.post('/', createEmptyCart);
router.put('/:cid', addProductToCartById);
router.delete('/:cid', deleteCartById);

export default router;