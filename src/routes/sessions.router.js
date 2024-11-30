import { Router } from "express";
import passport from "passport";
import { create } from "../dao/managers/userManager.js";

const sessionsRouter = Router();

sessionsRouter.post('/register', async(req, res, next)=>{
    try {
        const data = req.body;
        const one = await create(data);
        const message = 'USER REGISTERED'
        return res.status(201).json({message, one})
    } catch (error) {
        return next(error);
    }
})

sessionsRouter.post('/login', (req, res, next)=>{
    try {
        req.session.online = true;
        const {email} = req.body;
        req.session.email = email;
        const message = 'USER LOGGED IN';
        return res.status(200).json({message, email})
    } catch (error) {
        return next(error);
    }
})

sessionsRouter.post('/logout', async(req, res, next)=>{
    try {
        const session = req.session;
        req.session.destroy();
        const message = 'USER LOGGED OUT';
        return res.status(200).json({message, session});
    } catch (error) {
        return next(error);
    }
})

sessionsRouter.post('/online', async(req, res, next)=>{
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
})

sessionsRouter.post('/google', passport.authenticate('google', { scope: ['email', 'profile']}));
sessionsRouter.post('/google/cb', passport.authenticate('google', { session: false}), google);

function google(req,res,next){
    try {
        const user = req.user;
        return res.status(200).json({message: "USER LOGGED IN", user_id : user.id});
    } catch (error) {
        return next(error);
    }
}


export default sessionsRouter;