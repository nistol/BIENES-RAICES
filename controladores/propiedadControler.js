
const admin= (req,res) =>{
    res.render('propiedades/admin',{
        pagina: 'Mis Propiedades',
        barra:true
    })
}
// Formulario para crear propiedad 

const crear= (req,res) =>{
    res.render('propiedades/crear',{
        pagina: 'Crear propiedad',
        barra:true
    })
}
export {
    admin,crear
}