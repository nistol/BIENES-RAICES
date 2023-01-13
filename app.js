import express, { application } from 'express'
import csrf from 'csurf'
import cookieParser from 'cookie-parser'
import usuariosRoutes from './routes/usuarioRoutes.js'
import propiedadesRoutes from './routes/propiedadesRoutes.js'
import db from './config/db.js'

// crear app
const app = express()
// habilitar lectura

app.use(express.urlencoded({extended:true}));

// habilitar cookie parser

app.use(cookieParser())

// habilitar CSRF

app.use(csrf({cookie:true}))

// conexion a base de datos

try {
    await db.authenticate();
    db.sync()
    console.log('Conexion correcta a la base de datos')
}catch (error) {
    console.log(error)
}

// Habilitar pugg

app.set ('view engine', 'pug')
app.set ('views','./views')

//carpeta publica

app.use(express.static('public'))

//routing
app.use ('/auth' , usuariosRoutes)
app.use('/',propiedadesRoutes)



const port = process.env.PORT || 3000;

app.listen(port , () => {

    console.log(`El servidor esta funcionando en el puerto ${port}`)
});
