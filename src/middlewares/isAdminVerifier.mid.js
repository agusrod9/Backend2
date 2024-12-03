import { readById } from "../dao/managers/userManager.js";
import { verifyTokenUtil } from "../utils/tokens.util.js";

export default async function isAdmin(req,res,next){
    try {
        const {token} = req.headers;
        const data = verifyTokenUtil(token);
        const user = await readById(data.user_id);
        if(user.role == "ADMIN"){
            return next();
        }
        const error = new Error("USER IS NOT AN ADMINISTRATOR");
        error.statusCode = 403;
        throw error;
    } catch (error) {
        return next(error);
    }
}