import { Router } from "express";
import passport from '../middlewares/passport.mid.js';
import isOnline from "../middlewares/isOnlineVerifier.mid.js";
import { createLogoutTokenUtil } from "../utils/tokens.util.js";
import { readById } from "../dao/managers/userManager.js";

const sessionsRouter = Router();

sessionsRouter.post('/register', passport.authenticate('register', {session: false}), register);
sessionsRouter.post('/login', passport.authenticate('login', {session: false}) ,login);
sessionsRouter.post('/online', isOnline, isOnlineResponse);
sessionsRouter.post('/logout', passport.authenticate('logout', {session: false}) ,logoutResponse);
sessionsRouter.post('/isadmin', passport.authenticate('isAdmin', {session:false}), isAdminResponse);

sessionsRouter.get('/google', passport.authenticate('google', { scope: ['email', 'profile']}));
sessionsRouter.get('/google/cb', passport.authenticate('google', { session: false}), google);


function register(req,res,next){
    try {
        const message = 'USER REGISTERED'
        return res.status(201).json({message})
    } catch (error) {
        return next(error);
    }
}

function login(req, res, next) {
    try {
        const message = 'USER LOGGED IN';
        const {token} = req;
        const cookieOpts = {maxAge: 60*60*24*1000, httpOnly: true, signed: true};
        return res.status(200).cookie('token', token, cookieOpts).json({message});
    } catch (error) {
        return next(error);
    }
}

async function isOnlineResponse(req, res, next) {
    try {
        const message = 'USER ONLINE';
        return res.status(200).json({message});
        
    } catch (error) {
        return next(error);
    }
}

async function logoutResponse(req, res, next) {
    try {
        const userId = req.user;
        const user = await readById(userId);
        const cookieOpts = {httpOnly: true, signed: true}
        const message = 'USER LOGGED OUT';
        req.token = createLogoutTokenUtil({user_id: user._id, role: user.role});
        req.user = null;
        return res.status(200).clearCookie("token",cookieOpts).json({message});
    } catch (error) {
        return next(error);
    }
}

async function isAdminResponse(req,res,next){
    const message = 'USER IS ADMINISTRATOR';
    return res.status(200).json({message});
}

async function google(req,res,next){
    try {
        const message = 'USER LOGGED IN';
        const {token} = req
        const cookieOpts = {maxAge: 60*60*24, httpOnly: true, signed: true};
        return res.status(200).cookie('token', token, cookieOpts).json({message});
        //return res.status(200).cookie('token', token, cookieOpts).render('home');
    } catch (error) {
        return next(error);
    }
}

export default sessionsRouter;