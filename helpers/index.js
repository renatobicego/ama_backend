const dbValidator = require('./functions/dbValidator')
const generarJWT = require('./functions/generarJwt')

module.exports = {
    ...dbValidator,
    ...generarJWT
}