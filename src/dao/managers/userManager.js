import User from '../models/users.model.js';
import { Manager } from './manager.js';

const usersManager = new Manager(User)
export const { create, read, readByEmail, readById, update, deleteById } = usersManager