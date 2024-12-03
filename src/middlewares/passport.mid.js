import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Strategy as GoogleStrategy } from "passport-google-oauth2";
import { createHashUtil, verifyHashUtil } from "../utils/hash.util.js";
import { create, readByEmail, readById } from "../dao/managers/userManager.js";
import { createTokenUtil } from "../utils/tokens.util.js";

const {GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, API_BASE_URL} = process.env

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

passport.use("google", new GoogleStrategy(
    { clientID: GOOGLE_CLIENT_ID, clientSecret: GOOGLE_CLIENT_SECRET, passReqToCallback: true, callbackURL: `${API_BASE_URL}sessions/google/cb` },
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