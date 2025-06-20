const { Schema, model } = require("mongoose");


const ImagenNoticiaSchema = Schema({
    url: {
        type: String,
        required: [true, 'Imagen obligatoria']
    },
    epigrafe: {
        type: String,
        default: null
    }
})

module.exports = model('ImagenNoticia', ImagenNoticiaSchema)