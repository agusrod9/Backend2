import { createLogoutTokenUtil } from "../utils/tokens.util.js";
import { readById } from "../dao/managers/userManager.js";

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

function isOnlineResponse(req, res, next) {
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

function isAdminResponse(req,res,next){
    const message = 'USER IS ADMINISTRATOR';
    return res.status(200).json({message});
}

function google(req,res,next){
    try {
        const message = 'USER LOGGED IN';
        const {token} = req
        const cookieOpts = {maxAge: 60*60*24*1000, httpOnly: true, signed: true};
        return res.status(200).cookie('token', token, cookieOpts).json({message});
    } catch (error) {
        return next(error);
    }
}

function verifyCodeResponse(req, res, next){
    const message = 'USER VERIFIED';
    return res.status(200).json({message});
}

function sendTokenEmailResponse(req,res,next){
    const message = 'RESET PASSWORD EMAIL SENT';
    return res.status(200).json({message});
}

function confirmResetPasswordResponse(req, res, next){
    const message = 'PASSWORD RESET SUCCESSFULLY';
    return res.status(200).json({message});
}

export {google, isAdminResponse, logoutResponse, isOnlineResponse, login, register, verifyCodeResponse, sendTokenEmailResponse, confirmResetPasswordResponse}