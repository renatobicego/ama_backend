const UsuarioModels = require('./usuarios')
const TorneoModels = require('./torneos')
const Server = require('./Server')

module.exports = {
    ...UsuarioModels,
    ...TorneoModels,
    Server
}