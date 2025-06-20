const dbValidator = require('./functions/dbValidator')
const generarJWT = require('./functions/generarJwt')
const archivosFirebase = require('./functions/archivosFirebase')

module.exports = {
    ...dbValidator,
    ...generarJWT,
    ...archivosFirebase,
}