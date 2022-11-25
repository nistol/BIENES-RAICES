 import express from 'express'
 
 const router = express.Router();

 router.get('/login', function (req,res) {
    res.render ('auth/login')
 });

 router.get ('/' , function (req,res){
    res.send('Hola somos nostros')
 });

 export default router