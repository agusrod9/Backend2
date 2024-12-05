

export default function isOnline(req,res,next){
    if(req.signedCookies.token){        
        return next();
    }
    const error = new Error('USER IS NOT LOGGED IN');
    error.statusCode = 401;
    return next(error);
};