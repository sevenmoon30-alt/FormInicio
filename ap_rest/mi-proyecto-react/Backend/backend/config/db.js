require('dotenv').config();
const sql = require('mssql');

const config = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: process.env.DB_SERVER || 'localhost',
  port: Number(process.env.DB_PORT) || 1433,
  database: process.env.DB_NAME,
  options: {
    encrypt: false,
    trustServerCertificate: true,
  },
  connectionTimeout: 10000,
};

// Una sola conexión (pool) reutilizada en todas las consultas
let poolPromise;

function getPool() {
  if (!poolPromise) {
    poolPromise = new sql.ConnectionPool(config)
      .connect()
      .then((pool) => {
        console.log('Conectado a SQL Server');
        return pool;
      })
      .catch((err) => {
        poolPromise = null; // permite reintentar
        throw err;
      });
  }
  return poolPromise;
}

module.exports = { sql, getPool };
