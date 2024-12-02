import { readById } from "../dao/managers/userManager.js";

export default async function isAdmin(req,res,next){
    try {
        const session = req.session;
        const loggedUsrId = session.user_id;
        const user = await readById(loggedUsrId);
        if(user.role == session.role && session.role=="ADMIN"){
            return next();
        }
        const message = "FORBIDDEN";
        return res.status(403).json({message, user_id : session.user_id});
    } catch (error) {
        return next(error);
    }
}