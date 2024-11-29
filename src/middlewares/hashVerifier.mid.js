import { verifyHashUtil } from "../utils/hash.util.js";

async function verifyHash(req, res, next){
    try {
        let {email, password} = req.body;
        const user =  await readByEmail(email);
        const dbPassword = user.password;
        const verifies = verifyHashUtil(password, dbPassword);
        if(verifies){
            return next();
        }else{
            const error = new Error("INVALID CREDENTIALS");
            error.statusCode = 401;
            throw error;
        }

    } catch (error) {
        return next(error);
    }
}

export default verifyHash;