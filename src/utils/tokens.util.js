import jwt from 'jsonwebtoken';
import envUtil from './env.util.js';

const {TOKEN_SECRET} = envUtil;

function createTokenUtil(data){
    const token = jwt.sign(data, TOKEN_SECRET, {expiresIn: 60*60*24}); 
    return token;
}

function createLogoutTokenUtil(data){
    const token = jwt.sign(data, TOKEN_SECRET, {expiresIn: 1}); //Expira en 1 segundo
    return token;
}

function verifyTokenUtil(token){
    const verifies = jwt.verify(token, TOKEN_SECRET);
    return verifies;
}

export {createTokenUtil, createLogoutTokenUtil, verifyTokenUtil}