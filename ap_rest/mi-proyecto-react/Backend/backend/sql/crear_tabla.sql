-- Ejecutar en SSMS conectado a DESKTOP-NP4MTNB\SQLEXPRESS
IF DB_ID('demo') IS NULL
    CREATE DATABASE demo;
GO

USE demo;
GO

IF OBJECT_ID('dbo.personas', 'U') IS NULL
CREATE TABLE dbo.personas (
    id               INT IDENTITY(1,1) PRIMARY KEY,
    tipo_documento   VARCHAR(20)  NOT NULL,
    documento        VARCHAR(20)  NOT NULL,
    nombre           VARCHAR(100) NOT NULL,
    apellido         VARCHAR(100) NOT NULL,
    correo           VARCHAR(100) NULL,
    celular          VARCHAR(15)  NULL,
    fecha_nacimiento DATE         NULL,
    CONSTRAINT UQ_personas_documento UNIQUE (tipo_documento, documento)
);
GO
