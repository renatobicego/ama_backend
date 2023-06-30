const express = require('express')
const cors = require('cors')
const { dbConnection } = require('../db/config')
const fileUpload = require('express-fileupload')

class Server {
    constructor(){
        this.app = express()
        this.port = process.env.PORT

        this.paths = {
            usuariosPath: '/api/usuarios'
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
            useTempFiles: true,
            tempFileDir: '/tmp/',
            createParentPath: true
        }))
    }

    routes(){
        this.app.use(this.paths.usuariosPath, require('../routes/usuario'))
    }

    listen(){
        this.app.listen(this.port, () => {
            console.log('Corriendo');
        })
    }
}

module.exports = Server