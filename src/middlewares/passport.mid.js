import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Strategy as GoogleStrategy } from "passport-google-oauth2";
import { ExtractJwt, Strategy as JwtStrategy } from "passport-jwt";
import { createHashUtil, verifyHashUtil } from "../utils/hash.util.js";
import { create, readByEmail } from "../dao/managers/userManager.js";
import { createTokenUtil } from "../utils/tokens.util.js";
import envUtil from "../utils/env.util.js";

const {GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, API_BASE_URL, TOKEN_SECRET} = envUtil;

passport.use("register", new LocalStrategy(
    { passReqToCallback: true, usernameField: "email" }, 
    async(req, email, password, done)=>{
        const one = await readByEmail(email);
        if(one){
            const error = new Error('USER ALREADY REGISTERED');
            error.statusCode = 401;
            return done(error);
        }
        req.body.password = createHashUtil(password);
        const data = req.body;
        const newUsr = await create(data);
        return done(null, newUsr);

    }
));

passport.use("login", new LocalStrategy(
    { passReqToCallback: true, usernameField: "email" }, 
    async(req, email, password, done)=>{
        const user = await readByEmail(email);
        if(!user){
            const error = new Error('USER NOT FOUND');
            error.statusCode= 401;
            return done(error);
        }
        const verifies = verifyHashUtil(password, user.password);
        if(verifies){
            req.token = createTokenUtil({user_id: user._id, role: user.role});
            return done(null, user);
        }
        const error = new Error('INVALID CREDENTIALS');
        error.statusCode= 401;
        return done(error);

    }
));

passport.use("isAdmin", new JwtStrategy(
    {jwtFromRequest: ExtractJwt.fromExtractors([req=>req?.signedCookies?.token]), secretOrKey: TOKEN_SECRET},
    (data, done)=>{
        const userId = data.user_id;
        if(data.role != "ADMIN"){
            const error = new Error('UNAUTHORIZED');
            error.statusCode = 403;
            return done(error);
        }
        return done(null, userId);
    }
));

passport.use("isOnline", new JwtStrategy(
    {jwtFromRequest: ExtractJwt.fromExtractors([req=>req?.signedCookies?.token]), secretOrKey: TOKEN_SECRET},
    (data, done)=>{
        const userId = data.user_id;
        return done(null, userId);
    }
))

passport.use("logout", new JwtStrategy(
    {jwtFromRequest: ExtractJwt.fromExtractors([req=>req?.signedCookies?.token]), secretOrKey: TOKEN_SECRET},
    (data, done)=>{
        const userId = data.user_id;
        return done(null, {_id: userId});
    }
))

passport.use("google", new GoogleStrategy(
    { clientID: GOOGLE_CLIENT_ID, clientSecret: GOOGLE_CLIENT_SECRET, passReqToCallback: true, callbackURL: `${API_BASE_URL}sessions/google/cb`},
    async (req, accessToken, refreshToken, profile, done)=>{
        try {
            const { id, given_name, family_name } = profile;
            let user = await readByEmail(id); //Para evitar usar email, así no tengo que pedir crear una contraseña.
            if(!user){
                user = await create({email: id, password: createHashUtil(id), firstName : given_name, lastName : family_name});
            }
            req.token = createTokenUtil({user_id: user._id, role: user.role});
            return done(null, user);

        } catch (error) {
            return done(error);
        }
    }
));


export default passport