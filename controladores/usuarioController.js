import { check, validationResult } from 'express-validator'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import Usuario from '../modelos/Usuario.js'
import { generarId ,generarJWT} from '../helpers/token.js'
import { emailRegistro , emailRecuperar} from '../helpers/emails.js'

const formularioUsuario = function (req, res) {
  res.render('auth/login', {
    pagina: 'Iniciar sesion',
    csrfToken:req.csrfToken(),
  })
}

const autenticar = async(req,res) => {
  //validacion
  await check('email').isEmail().withMessage('El email es obligatorio').run(req)
  await check('contraseña').notEmpty().withMessage('El password es obligatorio').run(req)

  let resultado = validationResult(req)


  //Verificar que el resultado este vacio
  if (!resultado.isEmpty()) {
    return res.render('auth/login', {
      pagina: 'Iniciar sesion',
      csrfToken:req.csrfToken(),
      errores:resultado.array()
    
    })
  }
  const {email,contraseña} =req.body

  //comprobar si el usuario existe

  const usuario = await Usuario.findOne({where :{email}})

  if(!usuario){
    return res.render('auth/login', {
      pagina: 'Iniciar sesion',
      csrfToken:req.csrfToken(),
      errores:[{msg:'El usuario no existe'}]
    
    })
  }
  // comprobar si esta confirmado

  if(!usuario.confirmado){
    return res.render('auth/login', {
      pagina: 'Iniciar sesion',
      csrfToken:req.csrfToken(),
      errores:[{msg:'El usuario no Esta confirmado'}]
    
    })
  }
  //Revisar el password
  if(!usuario.verificarPassword(contraseña)){
    return res.render('auth/login', {
      pagina: 'Iniciar sesion',
      csrfToken:req.csrfToken(),
      errores:[{msg:'El password es incorrecto'}]
    
    })
  }
  //autenticar usuario

  const token = generarJWT(usuario.id)
  console.log(token)

  // almacenar en un cookie

  return res.cookie('_token',token,{
    httpOnly:true,
    
  }).redirect('/mis-propiedades')
}

const formularioRegistro = function (req, res) {

  res.render('auth/registro', {
    pagina: 'Crear cuenta',
    csrfToken:req.csrfToken()
  })
}

const registrar = async (req, res) => {
  //validacion
  await check('nombre').notEmpty().withMessage('Nombre de usuario obligatorio').run(req)
  await check('email').isEmail().withMessage('mail incorrecto').run(req)
  await check('password').isLength({ min: 6 }).withMessage('El password debe contener 6 caracteres como minimo').run(req)
  await check('password2').equals(req.body.password).withMessage('El password no coincide').run(req)
  let resultado = validationResult(req)


  //Verificar que el resultado este vacio
  if (!resultado.isEmpty()) {
    return res.render('auth/registro', {
      pagina: 'Crear cuenta',
      csrfToken:req.csrfToken(),
      errores: resultado.array(),
      usuario: {
        nombre: req.body.nombre,
        email: req.body.email
      }
    })
  }
  //verificar si existe usuario
  const existeUsuario = await Usuario.findOne({ where: { email: req.body.email } })

  if (existeUsuario)
    return res.render('auth/registro', {
      pagina: 'Crear cuenta',
      csrfToken:req.csrfToken(),
      errores: [{ msg: "El usuario ya existe" }],
      usuario: {
        nombre: req.body.nombre,
        email: req.body.email
      }
    })
  // almacenar un usuario

  const usuario = await Usuario.create({
    nombre: req.body.nombre,
    email: req.body.email,
    password: req.body.password,
    token: generarId()
  })
  // envia mail confirmacion
    emailRegistro({
      nombre:usuario.nombre,
      email:usuario.email,
      token:usuario.token
    })
  // mostrar mensaje de confirmacion 
  res.render('templates/mensaje', {
    pagina: 'Cuenta creada correctamente',
    mensaje: 'Hemos enviado un Email de Confirmacion'
  })
}

// funcion que comprueba una cuenta

const comprobar = async (req,res) => {
  
  const{token} = req.params;

  // verificar si el token es valido

  const usuario = await Usuario.findOne({where: {token}})

  

  if(!usuario) {
    return res.render('auth/confirmar-cuenta', {
      pagina:'Error al confirmar tu cuenta',
      mensaje:'Hubo un error al confirmar tu cuenta, intenta de nuevo',
      error:true
    })
  }
  // confirmar la cuenta
  usuario.token=null;
  usuario.confirmado =true;
  await usuario.save();
  
  res.render('auth/confirmar-cuenta', {
    pagina:'Cuenta Confirmada',
    mensaje:'La cuenta se confirmo Correctamente',
  })
}
const formularioRecuperar = function (req, res) {
  res.render('auth/recuperar', {
    pagina: 'Recuperar password',
    csrfToken:req.csrfToken(),
  })
}

const resetPassword = async(req,res) => {
  // validacion
  await check('email').isEmail().withMessage('mail incorrecto').run(req)

  let resultado = validationResult(req)


  //Verificar que el resultado este vacio
  if (!resultado.isEmpty()) {
    return res.render('auth/recuperar', {
      pagina: 'Recuperar password',
      csrfToken:req.csrfToken(),
      errores:resultado.array()
    
    })
  }

  // buscar usuario

  const  {email} = req.body

  const usuario = await Usuario.findOne({where:{email}})

  if (!usuario) {
    return res.render('auth/recuperar', {
      pagina:'Recuperar password',
      csrfToken:req.csrfToken(),
      errores: [{msg:'El email no pertenece a ningun usuario'}]
    })
  }

  // generar token y enviar email

  usuario.token = generarId();
  await usuario.save();

  // enviar un email

  emailRecuperar({
    nombre:usuario.nombre,
    email:usuario.email,
    token:usuario.token
  })
  
  // renderizar un mensaje

  res.render('templates/mensaje',{
    pagina:'Reestablece tu password',
    mensaje:'Hemos enviado un email con las instrucciones'
  })

}

const comprobarToken = async (req,res) =>{

  const {token} = req.params

  const usuario = await Usuario.findOne({where: {token}})
  
  if(!usuario) {
    return res.render('auth/confirmar-cuenta', {
      pagina:'Reestablece tu password',
      mensaje:'Hubo un error al Validar tu informacion, Intenta de nuevo',
      error:true
    })
  }
  // mostrar formulario para modificar password

  res.render('auth/reset-password',{
    pagina:'Reestablece tu password',
    csrfToken:req.csrfToken()
  }
  
  )
}

const nuevoPassword = async(req,res) =>{
  // validar el password
  await check('password').isLength({ min: 6 }).withMessage('El password debe contener 6 caracteres como minimo').run(req)
  let resultado = validationResult(req)
  //Verificar que el resultado este vacio
  if (!resultado.isEmpty()) {
    return res.render('auth/reset-password', {
      pagina: 'Reestablece tu password',
      csrfToken:req.csrfToken(),
      errores: resultado.array()
    })
  }

  const {token} = req.params
  const {password} = req.body
  // identificar el usuario que hace el cambio

  const usuario = await Usuario.findOne({where:{token}})
  //hashear nuevo password

  const salt = await bcrypt.genSalt(10)
  usuario.password = await bcrypt.hash(password, salt);
  usuario.token=null;

  await usuario.save();

  res.render('auth/confirmar-cuenta',{
    pagina:'Password reestablecido',
    mensaje:'El password se reestablecio correctamente'
  })

}
export { formularioUsuario, formularioRegistro, formularioRecuperar, registrar ,comprobar,resetPassword, comprobarToken, nuevoPassword,autenticar}