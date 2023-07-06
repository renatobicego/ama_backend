const UsuarioModels = require('./usuarios')
const TorneoModels = require('./torneos')
const NoticiaModels = require('./noticias')
const Server = require('./Server')

module.exports = {
    ...UsuarioModels,
    ...TorneoModels,
    ...NoticiaModels,
    Server
}