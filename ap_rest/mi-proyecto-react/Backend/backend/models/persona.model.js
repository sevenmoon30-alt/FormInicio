const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Persona = sequelize.define(
  'Persona',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    tipo_documento: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
    documento: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
    nombre: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    apellido: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    correo: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    celular: {
      type: DataTypes.STRING(15),
      allowNull: true,
    },
    fecha_nacimiento: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
  },
  {
    tableName: 'personas',
    timestamps: false,
  }
);

module.exports = Persona;
