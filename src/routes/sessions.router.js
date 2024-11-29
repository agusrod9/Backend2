import { Router } from "express";
import passport from "passport";

const sessionsRouter = Router();

sessionsRouter.post('/signup', async(req, res, next)=>{
    try {
        
    } catch (error) {
        return next(error);
    }
})

sessionsRouter.post('/login', async(req, res, next)=>{
    try {
        
    } catch (error) {
        return next(error);
    }
})

sessionsRouter.post('/logout', async(req, res, next)=>{
    try {
        
    } catch (error) {
        return next(error);
    }
})

sessionsRouter.post('/online', async(req, res, next)=>{
    try {
        
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