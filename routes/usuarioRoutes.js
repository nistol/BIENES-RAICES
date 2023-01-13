 import express from 'express'
 import {formularioUsuario , formularioRegistro, formularioRecuperar,registrar, comprobar,resetPassword,comprobarToken,nuevoPassword,autenticar} from '../controladores/usuarioController.js';
 
 const router = express.Router();

 router.get('/login', formularioUsuario);
 router.post('/login', autenticar);

 router.get ('/registro' ,formularioRegistro);
 router.post ('/registro' ,registrar);

 router.get('/confirmar/:token', comprobar);


 router.get ('/recuperar', formularioRecuperar);
 router.post ('/recuperar', resetPassword);

 // almacena el nuevo password

 router.get('/recuperar/:token', comprobarToken);
 router.post('/recuperar/:token', nuevoPassword);

 export default router