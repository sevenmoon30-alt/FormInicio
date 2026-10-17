const Persona = require('../models/persona.model');

const OBLIGATORIOS = ['tipo_documento', 'documento', 'nombre', 'apellido'];

// Error con código HTTP para que el controller sepa qué responder
function errorHttp(status, mensaje) {
  const err = new Error(mensaje);
  err.status = status;
  return err;
}

function validar(persona) {
  const faltan = OBLIGATORIOS.filter(
    (campo) => persona[campo] === undefined || String(persona[campo]).trim() === ''
  );
  if (faltan.length > 0) {
    throw errorHttp(400, `Faltan campos obligatorios: ${faltan.join(', ')}`);
  }
}

// Sequelize avisa con este error cuando se rompe el UNIQUE (tipo_documento + documento)
function traducirError(err) {
  if (err.name === 'SequelizeUniqueConstraintError') {
    return errorHttp(409, 'Ya existe una persona con ese tipo y número de documento');
  }
  return err;
}

// Deja los datos listos para guardar (celular y documento como texto, vacíos como null)
function limpiar(p) {
  return {
    tipo_documento: p.tipo_documento,
    documento: String(p.documento),
    nombre: p.nombre,
    apellido: p.apellido,
    correo: p.correo || null,
    celular: p.celular ? String(p.celular) : null,
    fecha_nacimiento: p.fecha_nacimiento || null,
  };
}

exports.getAll = () => Persona.findAll({ order: [['id', 'ASC']] });

exports.getById = async (id) => {
  const persona = await Persona.findByPk(id);
  if (!persona) throw errorHttp(404, 'Persona no encontrada');
  return persona;
};

exports.create = async (persona) => {
  validar(persona);
  try {
    const nueva = await Persona.create(limpiar(persona));
    return nueva;
  } catch (err) {
    throw traducirError(err);
  }
};

exports.update = async (id, persona) => {
  validar(persona);
  const existente = await Persona.findByPk(id);
  if (!existente) throw errorHttp(404, 'Persona no encontrada');
  try {
    await existente.update(limpiar(persona));
    return existente;
  } catch (err) {
    throw traducirError(err);
  }
};

exports.delete = async (id) => {
  const existente = await Persona.findByPk(id);
  if (!existente) throw errorHttp(404, 'Persona no encontrada');
  await existente.destroy();
};