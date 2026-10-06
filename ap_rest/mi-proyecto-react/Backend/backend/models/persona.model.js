const { sql, getPool } = require('../config/db');

// La fecha se devuelve como 'YYYY-MM-DD' para que el <input type="date"> la entienda
const COLUMNAS = `
  id, tipo_documento, documento, nombre, apellido, correo, celular,
  CONVERT(VARCHAR(10), fecha_nacimiento, 23) AS fecha_nacimiento
`;

function parametros(request, p) {
  return request
    .input('tipo_documento', sql.VarChar(20), p.tipo_documento)
    .input('documento', sql.VarChar(20), String(p.documento))
    .input('nombre', sql.VarChar(100), p.nombre)
    .input('apellido', sql.VarChar(100), p.apellido)
    .input('correo', sql.VarChar(100), p.correo || null)
    .input('celular', sql.VarChar(15), p.celular ? String(p.celular) : null)
    .input('fecha_nacimiento', sql.VarChar(10), p.fecha_nacimiento || null);
}

exports.getAll = async () => {
  const pool = await getPool();
  const result = await pool
    .request()
    .query(`SELECT ${COLUMNAS} FROM personas ORDER BY id`);
  return result.recordset;
};

exports.getById = async (id) => {
  const pool = await getPool();
  const result = await pool
    .request()
    .input('id', sql.Int, id)
    .query(`SELECT ${COLUMNAS} FROM personas WHERE id = @id`);
  return result.recordset[0];
};

exports.create = async (persona) => {
  const pool = await getPool();
  const result = await parametros(pool.request(), persona).query(`
    INSERT INTO personas
      (tipo_documento, documento, nombre, apellido, correo, celular, fecha_nacimiento)
    OUTPUT INSERTED.id
    VALUES
      (@tipo_documento, @documento, @nombre, @apellido, @correo, @celular,
       CAST(@fecha_nacimiento AS DATE))
  `);
  return result.recordset[0].id;
};

exports.update = async (id, persona) => {
  const pool = await getPool();
  const result = await parametros(pool.request(), persona)
    .input('id', sql.Int, id)
    .query(`
      UPDATE personas SET
        tipo_documento = @tipo_documento,
        documento = @documento,
        nombre = @nombre,
        apellido = @apellido,
        correo = @correo,
        celular = @celular,
        fecha_nacimiento = CAST(@fecha_nacimiento AS DATE)
      WHERE id = @id
    `);
  return result.rowsAffected[0]; // 0 = no existía ese id
};

exports.delete = async (id) => {
  const pool = await getPool();
  const result = await pool
    .request()
    .input('id', sql.Int, id)
    .query('DELETE FROM personas WHERE id = @id');
  return result.rowsAffected[0];
};
