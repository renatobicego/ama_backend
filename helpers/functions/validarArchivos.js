
const validarExtension = (file, extensionesPermitidas = []) => {
    const nombreFileCortado = file.name.split('.')
    const extension = nombreFileCortado[nombreFileCortado.length - 1]
    if(!extensionesPermitidas.includes(extension)){
        return false
    }
    return true
}

const validarSize = (file) => {
    return file.size < 10000000 
}

const validarArchivos = (file, extensionesPermitidas) => {
    // Validar la extension
    if(!validarExtension(file, extensionesPermitidas)){
        return `Extensión no permitida. Extensiones permitidas: ${extensionesPermitidas}`

    }

    // Validar tamaño de archivo
    if(!validarSize(file)){
        return 'El archivo debe ser menor a 10MB'
    }
}

module.exports = {validarArchivos}