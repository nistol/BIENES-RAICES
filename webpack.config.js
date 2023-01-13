import path from 'path'
export default {
    mode:'development',
    entry:{
        mapa: './SRC/js/mapa.js'
    },
    output:{
        filename: '[name].js',
        path: path.resolve('public/js')
    }
}