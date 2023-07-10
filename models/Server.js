const express = require('express')
const cors = require('cors')
const { dbConnection } = require('../db/config')
const fileUpload = require('express-fileupload')

class Server {
    constructor(){
        this.app = express()
        this.port = process.env.PORT

        this.paths = {
            usuariosPath: '/api/usuarios',
            authPath: '/api/auth',
            clubPath: '/api/club',
            torneoPath: '/api/torneo',
            informacionTorneosPath: '/api',
            campeonesPath: '/api/campeones',
            inscripcionesPath: '/api/inscripciones',
            pruebasAtletaPath: '/api/pruebas_atleta',
            imagenNoticiaPath: '/api/imagen_noticia',
            parrafoNoticiaPath: '/api/parrafo_noticia',
            noticiaPath: '/api/noticia',
        }

        //Base de datos
        this.conectarDB()

        //Middlewares
        this.middlewares()

        //Rutas
        this.routes()
    }

    async conectarDB(){
        await dbConnection()
    }

    middlewares(){
        this.app.use(cors())
        this.app.use(express.json())
        this.app.use(express.static('public'))
        this.app.use(fileUpload({
            createParentPath: true,
            limits: {
                fileSize: 10000000 //10mb
            },
            abortOnLimit: true
        }))
    }

    routes(){
        this.app.use(this.paths.usuariosPath, require('../routes/usuario'))
        this.app.use(this.paths.authPath, require('../routes/auth'))
        this.app.use(this.paths.clubPath, require('../routes/club'))
        this.app.use(this.paths.torneoPath, require('../routes/torneo'))
        this.app.use(this.paths.informacionTorneosPath, require('../routes/informacionTorneos'))
        this.app.use(this.paths.campeonesPath, require('../routes/campeones'))
        this.app.use(this.paths.inscripcionesPath, require('../routes/inscripciones'))
        this.app.use(this.paths.pruebasAtletaPath, require('../routes/pruebasAtleta'))
        this.app.use(this.paths.imagenNoticiaPath, require('../routes/imagenNoticia'))
        this.app.use(this.paths.parrafoNoticiaPath, require('../routes/parrafo'))
        this.app.use(this.paths.noticiaPath, require('../routes/noticia'))
    }

    listen(){
        this.app.listen(this.port, () => {
            console.log('Corriendo');
        })
    }
}

module.exports = Server