const { Usuario, PruebaAtleta } = require("../../models");

const usuariosPost = async (req, res) => {
  // Selecciono cada variable que quiero guardar para evitar
  // guardar datos mandados en body erroneamente

  let {
    nombre_apellido,
    email,
    password,
    role,
    pais,
    sexo,
    fecha_nacimiento,
    telefono,
    dni,
    federacion,
    asociacion,
    club,
  } = req.body;

  try {
    const usuario = new Usuario({
      nombre_apellido,
      email,
      password,
      role,
      pais,
      sexo,
      fecha_nacimiento,
      telefono,
      dni,
      federacion,
      asociacion,
      club,
    });

    //Guardar Db
    await usuario.save();
    return res.json({
      usuario,
    });
  } catch (error) {
    return res.status(500).json({ msg: error.message });
  }
};

const usuariosGet = async (req, res) => {
  // Limitar respuesta
  const { limite = 10, desde = 0 } = req.query;

  try {
    // Query
    const [total, usuarios] = await Promise.all([
      Usuario.countDocuments(),
      Usuario.find()
        .skip(Number(desde))
        .limit(Number(limite))
        .populate("club", "nombre")
        .populate("federacion", "nombre")
        .populate("asociacion", "nombre")
        .lean(),
    ]);

    return res.json({
      total,
      usuarios,
    });
  } catch (error) {
    return res.status(500).json({ msg: error.message });
  }
};

const usuarioGetPorId = async (req, res) => {
  const { id } = req.params;
  try {
    const usuario = await Usuario.findById(id)
      .populate("club", "nombre")
      .populate("federacion", "nombre")
      .populate("asociacion", "nombre")
      .lean();
    res.json({ usuario });
  } catch (error) {
    return res.status(500).json({ msg: error.message });
  }
};

const usuariosGetPorClub = async (req, res) => {
  const { idClub } = req.params;

  try {
    // Query
    const [total, usuarios] = await Promise.all([
      Usuario.countDocuments(),
      Usuario.find({ club: idClub })
        .populate("club", "nombre")
        .populate("federacion", "nombre")
        .populate("asociacion", "nombre")
        .lean(),
    ]);

    return res.json({
      total,
      usuarios,
    });
  } catch (error) {
    return res.status(500).json({ msg: error.message });
  }
};

const usuariosPut = async (req, res) => {
  const { id } = req.params;
  const { _id, password, ...resto } = req.body;

  try {
    if (resto.club === "") {
      resto.club = null;
    }
    const usuario = await Usuario.findByIdAndUpdate(id, resto, { new: true });
    return res.json(usuario);
  } catch (error) {
    return res.status(500).json({ msg: error.message });
  }
};

const usuariosPutPassword = async (req, res) => {
  const { dni } = req.params;

  const id = await Usuario.findOne({ dni });

  if (!id) {
    return res.status(404).json({ msg: "El usuario no existe" });
  }

  try {
    const usuario = await Usuario.findByIdAndUpdate(
      id,
      { password: dni },
      { new: true }
    );
    return res.json(usuario);
  } catch (error) {
    return res.status(500).json({ msg: error.message });
  }
};

const usuariosDelete = async (req, res = response) => {
  const { id } = req.params;

  // Usuario borra su cuenta o administrador
  if (req.usuario.id !== id && req.usuario.role !== "ADMIN_ROLE") {
    return res.status(403).json({
      msg: "Acceso denegado, solo administradores pueden borrar usuarios",
    });
  }

  try {
    const usuario = await Usuario.findByIdAndDelete(id);

    const pruebasAtleta = await PruebaAtleta.find({ atleta: id });
    pruebasAtleta.forEach(async (prueba) => {
      await prueba.deleteOne();
    });

    return res.json(usuario);
  } catch (error) {
    return res.status(500).json({ msg: error.message });
  }
};

const usuariosPostVarios = async (req, res) => {
  // Destructure the array of user objects from the request body
  const { usuarios } = req.body;

  try {
    // Loop through each user object in the array
    for (const usuario of usuarios) {
      // Extract user properties
      const {
        nombre_apellido,
        email,
        password,
        role,
        pais,
        sexo,
        fecha_nacimiento,
        telefono,
        dni,
        federacion,
        asociacion,
        club,
      } = usuario;

      // Create a new Usuario instance for each user
      const newUsuario = new Usuario({
        nombre_apellido,
        email,
        password,
        role,
        pais,
        sexo,
        fecha_nacimiento,
        telefono,
        dni,
        federacion,
        asociacion,
        club,
      });

      // Save the user to the database
      await newUsuario.save();
    }

    return res.json({
      msg: "Usuarios guardados exitosamente",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: "Error al crear usuarios" });
  }
};

module.exports = {
  usuariosPost,
  usuariosGet,
  usuariosPut,
  usuariosDelete,
  usuariosGetPorClub,
  usuarioGetPorId,
  usuariosPutPassword,
  usuariosPostVarios,
};
