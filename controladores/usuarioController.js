import { check, validationResult } from 'express-validator'
import Usuario from '../modelos/Usuario.js'
import { generarId } from '../helpers/token.js'
import { emailRegistro } from '../helpers/emails.js'

const formularioUsuario = function (req, res) {
  res.render('auth/login', {
    pagina: 'Iniciar sesion'
  })
}

const formularioRegistro = function (req, res) {
  res.render('auth/registro', {
    pagina: 'Crear cuenta',
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

const comprobar = (req,res) => {
  console.log(req.params.token)
}
const formularioRecuperar = function (req, res) {
  res.render('auth/recuperar', {
    pagina: 'Recuperar password',
  })
}

export { formularioUsuario, formularioRegistro, formularioRecuperar, registrar ,comprobar}