const XLSX = require("xlsx");
const inscripcionesXlsParserAdvanced = async (inscripciones) => {
  // Procesar datos
  const newData = [];

  inscripciones.forEach((item) => {
    const { pruebasInscripto, ...inscripcionData } = item;
    const { atleta } = item;
    const fecha = new Date(atleta.fecha_nacimiento);
    const dia = fecha.getDate();
    const mes = fecha.getMonth() + 1;
    const anio = fecha.getFullYear();

    pruebasInscripto.forEach((prueba) => {
      const newRow = {
        categoria: inscripcionData.categoria?.nombre
          ? inscripcionData.categoria?.nombre === "Master"
            ? "Mayores"
            : inscripcionData.categoria?.nombre
          : "",
        sexo: atleta.sexo || "",
        prueba: prueba.prueba?.nombre || "",
        apellido_y_nombre: atleta.nombre_apellido || "",
        pais: atleta.pais || "",
        documento: atleta.dni || "",
        dia: dia,
        mes: mes,
        anio: anio,
        mejor_marca: prueba.marca || "",
        numero: "",
        club: atleta.club?.siglas || "",
        asociacion: atleta.asociacion?.siglas || "",
        fed_provincial: atleta.federacion?.siglas || "",
        fed_nacional: atleta.pais || "",
      };
      newData.push(newRow);
    });

    if (!pruebasInscripto.length) {
      const newRow = {
        categoria: inscripcionData.categoria?.nombre || "",
        sexo: atleta.sexo || "",
        prueba: "",
        apellido_y_nombre: atleta.nombre_apellido || "",
        pais: atleta.pais || "",
        documento: atleta.dni || "",
        dia: dia,
        mes: mes,
        anio: anio,
        mejor_marca: "",
        numero: "",
        club: atleta.club?.siglas || "",
        asociacion: atleta.asociacion?.siglas || "",
        fed_provincial: atleta.federacion?.siglas || "",
        fed_nacional: atleta.pais || "",
      };
      newData.push(newRow);
    }
  });

  // Create workbook and worksheet
  const workbook = XLSX.utils.book_new();
  const worksheet = XLSX.utils.json_to_sheet(newData);

  // Configure column widths
  const columnWidths = [
    { wch: 15 }, // CATEGORIA
    { wch: 8 }, // SEXO
    { wch: 20 }, // PRUEBA
    { wch: 25 }, // APELLIDO_Y_NOMBRE
    { wch: 12 }, // PAIS
    { wch: 12 }, // DOCUMENTO
    { wch: 5 }, // DIA
    { wch: 5 }, // MES
    { wch: 6 }, // ANIO
    { wch: 12 }, // MEJOR_MARCA
    { wch: 3 }, // NUMERO
    { wch: 15 }, // CLUB
    { wch: 15 }, // ASOCIACION
    { wch: 15 }, // FED.PROVINCIAL
    { wch: 15 }, // FED.NACIONAL
  ];

  worksheet["!cols"] = columnWidths;

  // Add worksheet to workbook
  XLSX.utils.book_append_sheet(workbook, worksheet, "Inscripciones");

  // Generate buffer in XLS format (Excel 97-2003)
  const xlsBuffer = XLSX.write(workbook, {
    type: "buffer",
    bookType: "xls", // This explicitly sets the format to Excel 97-2003
  });

  return xlsBuffer;
};

module.exports = inscripcionesXlsParserAdvanced;
