import express, { application } from 'express'
import usuariosRoutes from './routes/usuarioRoutes.js'

// crear app
const app = express()

// Habilitar pugg

app.set ('view engine', 'pug')
app.set ('views','./views')

//routing
app.use ('/auth' , usuariosRoutes)



const port = 3000;

app.listen(port , () => {

    console.log(`El servidor esta funcionando en el puerto ${port}`)
});
