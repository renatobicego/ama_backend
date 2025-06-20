const PDFDocument = require("pdfkit");
const { Inscripcion, PruebaAtleta } = require("../../models");
const inscripcionesCsvParser = require("../../helpers/functions/inscripcionesCsvParser");

const inscripcionPost = async (req, res) => {
  // Obtener solo variables necesarias
  const { torneo, atleta, pruebasInscripto, categoria } = req.body;

  // Verificar que la inscripción sea al mismo usuario
  if (
    atleta !== req.usuario._id.toString() &&
    req.usuario.role === "USER_ROLE"
  ) {
    return res.status(403).json({
      msg: "Acceso denegado, solo entrenadores púeden inscribir a otros atletas",
    });
  }

  try {
    const inscripcion = new Inscripcion({
      torneo,
      atleta,
      pruebasInscripto,
      categoria,
    });
    await inscripcion.save();
    return res.json({ inscripcion });
  } catch (error) {
    return res.status(500).json({ msg: error.message });
  }
};

const inscripcionGetPorTorneo = async (req, res) => {
  // Obtener id de torneo
  const { idTorneo } = req.params;

  try {
    const [total, inscripciones] = await Promise.all([
      Inscripcion.countDocuments(),
      Inscripcion.find({ torneo: idTorneo })
        .populate("torneo", "nombre")
        .populate({
          path: "atleta",
          select: [
            "nombre_apellido",
            "fecha_nacimiento",
            "dni",
            "pais",
            "sexo",
          ],
          populate: [
            {
              path: "federacion",
              select: ["siglas"],
            },
            {
              path: "asociacion",
              select: ["siglas"],
            },
            {
              path: "club",
              select: ["siglas"],
            },
          ],
        })
        .populate("categoria", "nombre")
        // Mostrar las pruebas inscripto junto a la marca
        .populate({
          path: "pruebasInscripto",
          select: ["marca"],
          populate: {
            path: "prueba",
            select: ["nombre"],
          },
        })
        .lean(),
    ]);

    const csv = await inscripcionesCsvParser(inscripciones);

    res.setHeader(
      "Content-disposition",
      "attachment; filename=inscripciones.csv"
    );
    res.set("Content-Type", "text/csv");

    return res.send(csv);
  } catch (error) {
    return res.status(500).json({ msg: error.message });
  }
};

const inscripcionListaGetPorTorneo = async (req, res) => {
  const { idTorneo } = req.params;

  try {
    const [total, inscripciones] = await Promise.all([
      Inscripcion.countDocuments(),
      Inscripcion.find({ torneo: idTorneo })
        .populate("torneo", "nombre")
        .populate({
          path: "atleta",
          select: ["nombre_apellido", "dni"],
        })
        .populate("categoria", "nombre")
        .populate({
          path: "pruebasInscripto",
          populate: {
            path: "prueba",
            select: ["nombre"],
          },
        })
        .lean(),
    ]);

    const doc = new PDFDocument({ margin: 40, size: "A4" });

    res.setHeader(
      "Content-Disposition",
      'attachment; filename="listado-inscriptos.pdf"'
    );
    res.setHeader("Content-Type", "application/pdf");

    doc.pipe(res);

    // Configuración
    const tableTop = 100;
    const minItemHeight = 15;
    const pageHeight =
      doc.page.height - doc.page.margins.bottom - doc.page.margins.top;
    const lineSpacing = 8;

    // Columnas con mejor distribución
    const columns = {
      number: { x: 40, width: 30 },
      nombre: { x: 70, width: 180 },
      categoria: { x: 270, width: 60 },
      pruebas: { x: 370, width: 200 }, // Más ancho para pruebas
    };

    // Título
    doc.fontSize(18).text("Listado de Inscriptos", { align: "center" });
    doc.moveDown();

    const drawTableHeaders = (y) => {
      doc.fontSize(12).font("Helvetica-Bold");

      doc.text("", columns.number.x, y, {
        width: columns.number.width,
      });

      doc.text("Nombre y Apellido", columns.nombre.x, y, {
        width: columns.nombre.width,
      });
      doc.text("Categoría", columns.categoria.x, y, {
        width: columns.categoria.width,
      });
      doc.text("Pruebas", columns.pruebas.x, y, {
        width: columns.pruebas.width,
      });

      // Línea separadora más elegante
      doc
        .strokeColor("#cccccc")
        .moveTo(40, y + 15)
        .lineTo(530, y + 15)
        .stroke()
        .strokeColor("#000000");

      doc.font("Helvetica");
      return y + 25;
    };

    const calculateRowHeight = (item, index) => {
      const nombre = item.atleta?.nombre_apellido || "—";
      const categoria = item.categoria?.nombre || "—";
      const pruebas =
        (item.pruebasInscripto || [])
          .map((p) => p.prueba?.nombre)
          .filter(Boolean)
          .join(", ") || "—";

      doc.fontSize(9); // Tamaño de fuente ligeramente menor para mejor ajuste

      const numberHeight = doc.heightOfString(index, {
        width: columns.number.width,
        lineGap: 1,
      });

      const nombreHeight = doc.heightOfString(nombre, {
        width: columns.nombre.width,
        lineGap: 1,
      });
      const categoriaHeight = doc.heightOfString(categoria, {
        width: columns.categoria.width,
        lineGap: 1,
      });
      const pruebasHeight = doc.heightOfString(pruebas, {
        width: columns.pruebas.width,
        lineGap: 1,
      });

      return Math.max(
        numberHeight,
        nombreHeight,
        categoriaHeight,
        pruebasHeight,
        minItemHeight
      );
    };

    const drawTableRow = (item, y, index) => {
      const nombre = item.atleta?.nombre_apellido || "—";
      const categoria = item.categoria?.nombre || "—";
      const pruebas =
        (item.pruebasInscripto || [])
          .map((p) => p.prueba?.nombre)
          .filter(Boolean)
          .join(", ") || "—";

      doc.fontSize(9);

      doc.text(index + 1, columns.number.x, y, {
        width: columns.number.width,
        lineGap: 1,
      });

      doc.text(nombre, columns.nombre.x, y, {
        width: columns.nombre.width,
        lineGap: 1,
      });

      doc.text(categoria, columns.categoria.x, y, {
        width: columns.categoria.width,
        lineGap: 1,
      });

      doc.text(pruebas, columns.pruebas.x, y, {
        width: columns.pruebas.width,
        lineGap: 1,
      });
    };

    // Ordenar y procesar
    const sortedInscripciones = inscripciones.sort((a, b) => {
      const nombreA = a.atleta?.nombre_apellido || "";
      const nombreB = b.atleta?.nombre_apellido || "";
      return nombreA.localeCompare(nombreB);
    });

    let currentY = tableTop;
    currentY = drawTableHeaders(currentY);

    sortedInscripciones.forEach((inscripcion, index) => {
      const rowHeight = calculateRowHeight(inscripcion, index);
      const totalRowHeight = rowHeight + lineSpacing;

      if (currentY + totalRowHeight > pageHeight) {
        doc.addPage();
        currentY = 40;
        currentY = drawTableHeaders(currentY);
      }

      drawTableRow(inscripcion, currentY, index);
      currentY += rowHeight + lineSpacing;
    });

    doc.end();
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: error.message });
  }
};

const inscripcionGetPorAtleta = async (req, res) => {
  // Obetenr id del usuario que realiza la petición
  const { _id } = req.usuario;

  try {
    const [total, inscripciones] = await Promise.all([
      Inscripcion.countDocuments(),
      Inscripcion.find({ atleta: _id })
        // Solo torneos con inscripción abierta
        .populate({
          path: "torneo",
          select: ["nombre"],
          match: { inscripcionesAbiertas: true },
        })
        .populate("atleta", "nombre_apellido")
        .populate("categoria", "nombre")
        // Mostrar peuebas con marca
        .populate({
          path: "pruebasInscripto",
          select: ["marca"],
          populate: {
            path: "prueba",
            select: ["nombre"],
          },
        })
        .lean(),
    ]);

    const inscripcionesPorAtleta = inscripciones.filter(
      (inscripcion) => inscripcion.torneo !== null
    );

    return res.json({ total, inscripcionesPorAtleta });
  } catch (error) {
    return res.status(500).json({ msg: error.message });
  }
};

const inscripcionGetPorId = async (req, res) => {
  // Obetenr id del usuario que realiza la petición
  const { id } = req.params;

  try {
    const inscripcion = await Inscripcion.findById(id)
      // Solo torneos con inscripción abierta
      .populate({
        path: "torneo",
        select: ["nombre"],
      })
      .populate("atleta", "nombre_apellido")
      .populate("categoria", "nombre")
      // Mostrar peuebas con marca
      .populate({
        path: "pruebasInscripto",
        select: ["marca"],
        populate: {
          path: "prueba",
          select: ["nombre", "tipo"],
        },
      })
      .lean();

    return res.json({ inscripcion });
  } catch (error) {
    return res.status(500).json({ msg: error.message });
  }
};

const inscripcionGetPorClub = async (req, res) => {
  // Obtener id de club
  const { idClub } = req.params;

  try {
    const inscripciones = await Inscripcion.find()
      // Torneos con inscripción abierta
      .populate({
        path: "torneo",
        select: ["nombre"],
        match: { inscripcionesAbiertas: true },
      })
      // Matchear con id de club
      .populate({
        path: "atleta",
        select: ["nombre_apellido"],
        match: { club: idClub },
      })
      .populate("categoria", "nombre")
      .populate({
        path: "pruebasInscripto",
        select: ["marca"],
        populate: {
          path: "prueba",
          select: ["nombre"],
        },
      })
      .lean();
    const inscripcionesPorClub = inscripciones.filter(
      (inscripcion) =>
        inscripcion.atleta !== null && inscripcion.torneo !== null
    );

    return res.json({ inscripcionesPorClub });
  } catch (error) {
    return res.status(500).json({ msg: error.message });
  }
};

const inscripcionPut = async (req, res) => {
  // Obtener id de inscripcion
  const { id } = req.params;

  // Usuario no puede cambiar el torneo ni el usuario de la inscripción
  const { _id, torneo, atleta, categoria, ...resto } = req.body;

  try {
    const inscripcion = await Inscripcion.findByIdAndUpdate(id, resto);

    return res.json({ inscripcion });
  } catch (error) {
    return res.status(500).json({ msg: error.message });
  }
};

const inscripcionDelete = async (req, res) => {
  // Obtener id de inscripcion
  const { id } = req.params;

  try {
    const inscripcion = await Inscripcion.findByIdAndDelete(id);
    inscripcion.pruebasInscripto.forEach(async (prueba) => {
      await PruebaAtleta.findByIdAndDelete(prueba);
    });

    return res.json({ inscripcion });
  } catch (error) {
    return res.status(500).json({ msg: error.message });
  }
};

module.exports = {
  inscripcionPost,
  inscripcionGetPorTorneo,
  inscripcionGetPorAtleta,
  inscripcionGetPorClub,
  inscripcionPut,
  inscripcionDelete,
  inscripcionGetPorId,
  inscripcionListaGetPorTorneo,
};
