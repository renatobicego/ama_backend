const sharp = require("sharp")


const comprimirArchivos = async(file, formato) => {
    await sharp(file.data)
        .toFormat(formato, {quality: 75})
        .toBuffer()
        .then(data => { 
            file.data = data
        }).catch(e => {
            throw new Error(e)
        }) 

    return file
}

module.exports = comprimirArchivos