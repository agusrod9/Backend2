import Cart from '../models/carts.model.js'
import { Manager } from './manager.js'

const cartsManager = new Manager(Cart);
export const { create, readAllPopulated, readById, readByIdPopulated, update, deleteById} = cartsManager;

