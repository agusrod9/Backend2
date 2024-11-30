import Product from '../models/products.model.js'
import { Manager } from './manager.js'

const productsManager = new Manager(Product);
export const { create, readAll, readAllPopulated, readAllPaginated, readById, readByIdPopulated, update, deleteById} = productsManager;
