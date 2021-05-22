/*==========================================
UBICAR LOS REQUERIMIENTOS
==========================================*/
const express = require('express')
const app = express()

/*========================================
IMPORTAR EL CONTROLADOR
========================================*/
const Admin = require('../controllers/admin.controller')

/*================================
CREAR LAS RUTAS HTTP
================================*/
app.get('/mostrar-administradores', Admin.getAdmins)
app.post('/crear-administrador', Admin.createAdmin)
app.put('/editar-administrador/:id', Admin.updateAdmin)
app.delete('/eliminar-administrador/:id', Admin.deleteAdmin)

/*=================================
EXPORTAR LA RUTA
=================================*/

module.exports = app
