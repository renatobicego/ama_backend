
const validarExtension = (file, extensionesPermitidas = []) => {
    const extension = file.name.split('.')[1]
    if(!extensionesPermitidas.includes(extension)){
        return false
    }
    return true
}

const validarSize = (file) => {
    return file.size < 10000000 
}

module.exports = {validarExtension, validarSize}