import { Router } from "express";

const cookiesRouter = Router();

cookiesRouter.post('/set', (req, res, next)=>{
    try {
        const message = 'COOKIE SET'
        return res
                .status(201)
                .cookie("clave", "valor", {signed: true}) 
                .cookie("cookieTemporal", "valorTemporal", {maxAge: 10000})
                .json({message});
    } catch (error) {
        return next(error);
    }
});

cookiesRouter.get('/get', (req, res, next)=>{
    try {
        const cookies = req.cookies;
        const signedCookies = req.signedCookies;
        const message = 'COOKIES READ';
        return res
                .status(200)
                .json({message, cookies, signedCookies})
    } catch (error) {
        return next(error);
    }
});

cookiesRouter.delete('/delete', (req,res,next)=>{
    try {
        const {toDelete} = req.query;
        const message = 'COOKIE DELETED';
        return res
                .status(204)
                .clearCookie(toDelete)
                .json({message})
    } catch (error) {
        return next(error);
    }
});


export default cookiesRouter