import {exit} from 'node:process'
import categorias from "./categorias.js";
import precios from "./precios.js";
import categoria from "../modelos/categoria.js";
import precio from "../modelos/precio.js";
import db from "../config/db.js";

const importarDatos = async () => {
    try {
        // Autenticar en la bd
        await db.authenticate()
        // generar columnas
        await db.sync()
        // insertar datos

        await Promise.all ([categoria.bulkCreate(categorias),precio.bulkCreate(precios)])
        console.log('Precios insertados correctamente')
        exit()
    }
    catch (error) {
        console.log(error)
        exit(1)
    }
}
if (process.argv[2] ==="-i"){
    importarDatos();
   
}