import { Router } from 'express';

const router = Router();

router.get('/', render);
router.get('/register', (req,res)=>{
    res.render('register');
})
router.get('/login', (req,res)=>{
    res.render('login');
})

function render(req, res, next){
    if(req.signedCookies.token){
        res.status(200).render('home', {title:"HOME"});
    }else{
        res.status(200).render('login');
    }
}

export default router;