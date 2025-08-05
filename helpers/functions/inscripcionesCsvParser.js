const XLSX = require("xlsx");
const inscripcionesXlsParserAdvanced = async (inscripciones) => {
  // 1. Define headers explicitly (as array of keys in desired order)
  const headers = [
    "categoria",
    "sexo",
    "prueba",
    "apellido_y_nombre",
    "pais",
    "documento",
    "dia",
    "mes",
    "anio",
    "mejor_marca",
    "numero",
    "club",
    "asociacion",
    "fed_provincial",
    "fed_nacional",
  ];

  // 2. Prepare data rows
  const dataRows = [];

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
      dataRows.push(newRow);
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
      dataRows.push(newRow);
    }
  });

  // 3. Build the worksheet with an empty row, then headers, then data
  const rows = [
    headers.map(() => ""), // Empty row
    headers, // Header row
    ...dataRows.map((row) => headers.map((key) => row[key] || "")), // Data
  ];
  // 4. Create worksheet
  const worksheet = XLSX.utils.aoa_to_sheet(rows);

  // 5. Set column widths
  worksheet["!cols"] = [
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

  // 6. Create workbook and add worksheet
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Inscripciones");

  // 7. Generate XLS buffer
  const xlsBuffer = XLSX.write(workbook, {
    type: "buffer",
    bookType: "xls",
  });

  return xlsBuffer;
};

module.exports = inscripcionesXlsParserAdvanced;
