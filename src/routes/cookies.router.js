import { Router } from "express";

const cookiesRouter = Router();


cookiesRouter.post('/set', (req, res, next)=>{
    try {
        const message = 'COOKIE SET'
        return res
                .status(200)
                .cookie("clave", "valor")
                .cookie("cookieTemporal", "valorTemporal", {maxAge: 10000})
                .json({message});
    } catch (error) {
        return next(error);
    }
});

cookiesRouter.get('/get', (req, res, next)=>{
    try {
        const cookies = req.cookies;
        const message = 'COOKIES READ';
        return res
                .status(200)
                .json({message, cookies})
    } catch (error) {
        return next(error);
    }
});

cookiesRouter.delete('/delete:toDelete', (req,res,next)=>{
    try {
        const {toDelete} = req.query;
        const message = 'COOKIE DELETED';
        return res
                .status(201)
                .clearCookie(toDelete)
                .json({message})
    } catch (error) {
        return next(error);
    }
});


export default cookiesRouter