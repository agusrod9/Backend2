import { Router } from "express";
import passport from '../middlewares/passport.mid.js';

const sessionsRouter = Router();

sessionsRouter.post('/register', passport.authenticate('register', {session: false}), register)
sessionsRouter.post('/login', passport.authenticate('login', {session: false}) ,login)
sessionsRouter.post('/online', online)
sessionsRouter.post('/logout', logout)

sessionsRouter.get('/google', passport.authenticate('google', { scope: ['email', 'profile']}));
sessionsRouter.get('/google/cb', passport.authenticate('google', { session: false}), google);


async function register(req,res,next){
    try {
        const user = req.user; //viene del done(null, newUser) de passport
        const message = 'USER REGISTERED'
        return res.status(201).json({message, user_id: user._id})
    } catch (error) {
        return next(error);
    }
}

async function login(req, res, next) {
    try {
        const user = req.user;
        const message = 'USER LOGGED IN';
        return res.status(200).json({message, user_id: user._id});
    } catch (error) {
        return next(error);
    }
}

async function online(req, res, next) {
    try {
        const session = req.session;
        if(session.online){
            const message = 'USER ONLINE'
            return res.status(200).json({message, session})
        }
        const message = 'USER OFFLINE'
        return res.status(401).json({message})
    } catch (error) {
        return next(error);
    }
}

async function logout(req, res, next) {
    try {
        const session = req.session;
        const message = 'USER LOGGED OUT';
        req.session.destroy();
        return res.status(200).json({message, user: session.user_id});
    } catch (error) {
        return next(error);
    }
}

function google(req,res,next){
    try {
        const user = req.user;
        return res.status(200).json({message: "USER LOGGED IN", user_id : user.id});
    } catch (error) {
        return next(error);
    }
}

export default sessionsRouter;