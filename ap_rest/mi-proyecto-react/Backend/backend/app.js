require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { getPool } = require('./config/db');

const app = express();

app.use(cors()); // permite que React (otro puerto) llame a esta API
app.use(express.json());

const personaRoutes = require('./routes/persona.routes');
app.use('/personas', personaRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, async () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
  try {
    await getPool();
  } catch (err) {
    console.error('No se pudo conectar a SQL Server:', err.message);
  }
});
