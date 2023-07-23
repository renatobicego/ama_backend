const { AsyncParser } = require("json2csv")

const inscripcionesCsvParser = async(inscripciones) => {
    // Crea un nuevo array para almacenar los datos desglosados por cada inscripción.
    let newData = []

    inscripciones.forEach((item) => {
    const { pruebasInscripto, ...inscripcionData } = item // Extrae los datos del atleta y las pruebas inscritas.
    const {atleta} = item
    const fecha = new Date(atleta.fecha_nacimiento)
    const dia = fecha.getDate()
    const mes = fecha.getMonth() + 1 
    const anio = fecha.getFullYear()

    // Para cada prueba inscrita, crea una nueva fila con los datos del atleta y los detalles de la prueba.
    pruebasInscripto.forEach((prueba) => {
            const newRow = {
            ...inscripcionData,
            dia,
            mes,
            anio,
            prueba: prueba.prueba.nombre,
            marca: prueba.marca
            // Agrega aquí otros campos específicos de la prueba que desees incluir en el CSV.
            }
            newData.push(newRow)
        })
    })

    const csvOpts = {
        fields: [
            {
            label: 'Categoria',
            value: 'categoria.nombre'
            },
            {
            label: 'Sexo',
            value: 'atleta.sexo'
            },
            {
            label: 'Prueba',
            value: 'prueba'
            },
            {
            label: 'Apellido y Nombre',
            value: 'atleta.nombre_apellido'
            },
            {
            label: 'Pais',
            value: 'atleta.pais'
            },
            {
            label: 'Documento',
            value: 'atleta.dni'
            },
            {
            label: 'Dia',
            value: 'dia'
            },
            {
            label: 'Mes',
            value: 'mes'
            },
            {
            label: 'Año',
            value: 'anio'
            },
            {
            label: 'Marca',
            value: 'marca'
            },
            {
            label: 'Club',
            value: 'atleta.club.siglas'
            },
            {
            label: 'Asociación',
            value: 'atleta.asociacion.siglas'
            },
            {
            label: 'Federación Provincial',
            value: 'atleta.federacion.siglas'
            },
            {
            label: 'Federación Nacional',
            value: 'atleta.pais'
            },
        ]
    }
    
    const parser = new AsyncParser(csvOpts)
    const csv = await parser.parse(newData).promise()
    return csv
}

module.exports = inscripcionesCsvParser