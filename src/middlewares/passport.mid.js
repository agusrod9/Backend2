import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Strategy as GoogleStrategy } from "passport-google-oauth2";
import createHashUtil from "hashCreator.mid.js";

const {GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, API_BASE_URL} = process.env

passport.use("register", new LocalStrategy(
    { passReqToCallback: true, usernameField: "email" }, ()=>{
        
    }
));

passport.use("login", new LocalStrategy({}, ()=>{

}));

passport.use("google", new GoogleStrategy(
    { clientID: GOOGLE_CLIENT_ID, clientSecret: GOOGLE_CLIENT_SECRET, passReqToCallback: true, callbackURL: `${API_BASE_URL}+sessions/google/cb` },
    async (req, accessToken, refreshToken, profile, done)=>{
        try {
            const { id, picture} = profile;
            let user = await readByMail(id);
            if(!user){
                user = await create({email: id, photo: picture, password: createHashUtil(id)})
            }
        } catch (error) {
            return done(error)
        }
}))


export default passport