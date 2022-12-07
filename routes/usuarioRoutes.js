 import express from 'express'
 import {formularioUsuario , formularioRegistro, formularioRecuperar,registrar, comprobar} from '../controladores/usuarioController.js';
 
 const router = express.Router();

 router.get('/login', formularioUsuario);

 router.get ('/registro' ,formularioRegistro);
 router.post ('/registro' ,registrar);

 router.get('/confirmar/:token', comprobar);


 router.get ('/recuperar', formularioRecuperar);

 export default router