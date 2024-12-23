import { Router } from "express";
import passport from '../middlewares/passport.mid.js';
import isOnline from "../middlewares/isOnlineVerifier.mid.js";
import verifyCode from "../middlewares/usersVerifier.mid.js";
import {register,
        login,
        isOnlineResponse, 
        logoutResponse, 
        isAdminResponse, 
        google, 
        verifyCodeResponse, 
        sendTokenEmailResponse, 
        confirmResetPasswordResponse 
        } from "../controllers/sessions.controller.js";
import { sendTokenEmail, confirmResetPassword } from "../middlewares/forgotPassword.mid.js";


const sessionsRouter = Router();

sessionsRouter.post('/register', passport.authenticate('register', {session: false}), register);
sessionsRouter.post('/login', passport.authenticate('login', {session: false}) ,login);
sessionsRouter.post('/online', isOnline, isOnlineResponse);
sessionsRouter.post('/logout', passport.authenticate('logout', {session: false}) ,logoutResponse);
sessionsRouter.post('/isadmin', passport.authenticate('isAdmin', {session:false}), isAdminResponse);
sessionsRouter.post('/verify', verifyCode, verifyCodeResponse);
sessionsRouter.post('/forgotpassword', sendTokenEmail, sendTokenEmailResponse);
sessionsRouter.get('/passwordreset', );
sessionsRouter.post('/confirmnewpassword',confirmResetPassword, confirmResetPasswordResponse );
sessionsRouter.get('/google', passport.authenticate('google', { scope: ['email', 'profile']}));
sessionsRouter.get('/google/cb', passport.authenticate('google', { session: false}), google);

export default sessionsRouter;