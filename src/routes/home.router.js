import { Router } from 'express';

const router = Router();

router.get('/', render);
router.get('/register', (req,res)=>{
    res.render('register', {title: "Register"});
})
router.get('/login', (req,res)=>{
    res.render('login', {title:"Login"});
})

function render(req, res, next){
    if(req.signedCookies.token){
        res.status(200).render('home', {title:"Home"});
    }else{
        res.status(200).render('login', {title:"Login"});
    }
}

export default router;