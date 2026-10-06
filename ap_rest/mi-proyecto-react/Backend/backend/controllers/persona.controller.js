const personaService = require('../services/persona.service');

function responderError(res, err) {
  const status = err.status || 500;
  if (status === 500) console.error(err);
  res.status(status).json({ error: err.message });
}

exports.getAll = async (req, res) => {
  try {
    res.json(await personaService.getAll());
  } catch (err) {
    responderError(res, err);
  }
};

exports.getById = async (req, res) => {
  try {
    res.json(await personaService.getById(Number(req.params.id)));
  } catch (err) {
    responderError(res, err);
  }
};

exports.create = async (req, res) => {
  try {
    const persona = await personaService.create(req.body);
    res.status(201).json(persona);
  } catch (err) {
    responderError(res, err);
  }
};

exports.update = async (req, res) => {
  try {
    res.json(await personaService.update(Number(req.params.id), req.body));
  } catch (err) {
    responderError(res, err);
  }
};

exports.delete = async (req, res) => {
  try {
    await personaService.delete(Number(req.params.id));
    res.json({ mensaje: 'Persona eliminada' });
  } catch (err) {
    responderError(res, err);
  }
};
