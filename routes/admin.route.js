/*==========================================
UBICAR LOS REQUERIMIENTOS
==========================================*/
const express = require('express')
const app = express()

/*========================================
IMPORTAR EL CONTROLADOR
========================================*/
const Admin = require('../controllers/admin.controller')

/*=======================================
IMPORTAR EL MIDDLEWARE
=======================================*/
const { tokenVerify } = require('../middlewares/authentication')

/*================================
CREAR LAS RUTAS HTTP
================================*/
app.get('/mostrar-administradores', tokenVerify, Admin.getAdmins)
app.post('/crear-administrador', tokenVerify, Admin.createAdmin)
app.put('/editar-administrador/:id', tokenVerify, Admin.updateAdmin)
app.delete('/eliminar-administrador/:id', tokenVerify, Admin.deleteAdmin)
app.post('/login', Admin.login)

/*=================================
EXPORTAR LA RUTA
=================================*/

module.exports = app
