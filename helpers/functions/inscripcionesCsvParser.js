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
        if(!pruebasInscripto.length){
            const newRow = {
                ...inscripcionData,
                dia,
                mes,
                anio,
                prueba: '',
                marca: ''
                // Agrega aquí otros campos específicos de la prueba que desees incluir en el CSV.
            }
            newData.push(newRow)
        }
        
    })

    const csvOpts = {
        fields: [
            {
            label: 'CATEGORIA',
            value: 'categoria.nombre'
            },
            {
            label: 'SEXO',
            value: 'atleta.sexo'
            },
            {
            label: 'PRUEBA',
            value: 'prueba'
            },
            {
            label: 'APELLIDO_Y_NOMBRE',
            value: 'atleta.nombre_apellido'
            },
            {
            label: 'PAIS',
            value: 'atleta.pais'
            },
            {
            label: 'DOCUMENTO',
            value: 'atleta.dni'
            },
            {
            label: 'DIA',
            value: 'dia'
            },
            {
            label: 'MES',
            value: 'mes'
            },
            {
            label: 'ANIO',
            value: 'anio'
            },
            {
            label: 'MEJOR_MARCA',
            value: 'marca'
            },
            {
            label: 'CLUB',
            value: 'atleta.club.siglas'
            },
            {
            label: 'ASOCIACION',
            value: 'atleta.asociacion.siglas'
            },
            {
            label: 'FED.PROVINCIAL',
            value: 'atleta.federacion.siglas'
            },
            {
            label: 'FED.NACIONAL',
            value: 'atleta.pais'
            },
        ]
    }

    const parser = new AsyncParser(csvOpts)
    const csv = await parser.parse(newData).promise()

    return csv
}

module.exports = inscripcionesCsvParser