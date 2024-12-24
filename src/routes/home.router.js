import { Router } from 'express';

const router = Router();

router.get('/', render);
router.get('/register', (req,res)=>{
    res.render('register', {title: "Register"});
})

router.get('/login', (req,res)=>{
    res.render('login', {title:"Login"});
})

//em este endpoint se manda el mail
router.get('/forgotPassword', (req,res)=>{
    res.render('forgotPassword', {title:"Reset Password"});
})

router.get('/confirmPassword', (req, res)=>{
    let token = req.query.t;
    res.render('confirmPassword', {title:"Confirm new Password", token})
})

function render(req, res, next){
    if(req.signedCookies.token){
        res.status(200).render('home', {title:"Home"});
    }else{
        res.status(200).render('login', {title:"Login"});
    }
}

export default router;