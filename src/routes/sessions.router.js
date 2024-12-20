import { Router } from "express";
import passport from '../middlewares/passport.mid.js';
import isOnline from "../middlewares/isOnlineVerifier.mid.js";
import { register, login, isOnlineResponse, logoutResponse, isAdminResponse, google } from "../controllers/sessions.controller.js";


const sessionsRouter = Router();

sessionsRouter.post('/register', passport.authenticate('register', {session: false}), register);
sessionsRouter.post('/login', passport.authenticate('login', {session: false}) ,login);
sessionsRouter.post('/online', isOnline, isOnlineResponse);
sessionsRouter.post('/logout', passport.authenticate('logout', {session: false}) ,logoutResponse);
sessionsRouter.post('/isadmin', passport.authenticate('isAdmin', {session:false}), isAdminResponse);
sessionsRouter.get('/google', passport.authenticate('google', { scope: ['email', 'profile']}));
sessionsRouter.get('/google/cb', passport.authenticate('google', { session: false}), google);

export default sessionsRouter;