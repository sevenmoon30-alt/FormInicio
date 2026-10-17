require('dotenv').config();
const express = require('express');
const cors = require('cors');
const sequelize = require('./config/db');
require('./models/persona.model'); // registra el modelo en Sequelize

const app = express();

app.use(cors()); // permite que React (otro puerto) llame a esta API
app.use(express.json());

const personaRoutes = require('./routes/persona.routes');
app.use('/personas', personaRoutes);

const PORT = process.env.PORT || 3001;
app.listen(PORT, async () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
  try {
    await sequelize.authenticate();
    console.log('Conectado a SQL Server con Sequelize');
    await sequelize.sync(); // crea la tabla solo si no existe
    console.log('Base de datos lista');
  } catch (err) {
    console.error('No se pudo conectar a SQL Server:', err.message);
  }
});