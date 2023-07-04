const dbValidator = require('./functions/dbValidator')
const generarJWT = require('./functions/generarJwt')
const archivosFirebase = require('./functions/archivosFirebase')
const validarArchivos = require('./functions/validarArchivos')

module.exports = {
    ...dbValidator,
    ...generarJWT,
    ...archivosFirebase,
    ...validarArchivos
}