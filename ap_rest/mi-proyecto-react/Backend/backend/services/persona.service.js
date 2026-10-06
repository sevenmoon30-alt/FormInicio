const personaModel = require('../models/persona.model');

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

// 2627 / 2601 = violación de UNIQUE en SQL Server
function traducirError(err) {
  if (err.number === 2627 || err.number === 2601) {
    return errorHttp(409, 'Ya existe una persona con ese tipo y número de documento');
  }
  return err;
}

exports.getAll = () => personaModel.getAll();

exports.getById = async (id) => {
  const persona = await personaModel.getById(id);
  if (!persona) throw errorHttp(404, 'Persona no encontrada');
  return persona;
};

exports.create = async (persona) => {
  validar(persona);
  try {
    const id = await personaModel.create(persona);
    return { ...persona, id };
  } catch (err) {
    throw traducirError(err);
  }
};

exports.update = async (id, persona) => {
  validar(persona);
  try {
    const filas = await personaModel.update(id, persona);
    if (filas === 0) throw errorHttp(404, 'Persona no encontrada');
    return { ...persona, id };
  } catch (err) {
    throw traducirError(err);
  }
};

exports.delete = async (id) => {
  const filas = await personaModel.delete(id);
  if (filas === 0) throw errorHttp(404, 'Persona no encontrada');
};
