/*==========================================
UBICAR LOS REQUERIMIENTOS
==========================================*/
const express = require('express')
const app = express()

/*========================================
IMPORTAR EL CONTROLADOR
========================================*/
const Article = require('../controllers/article.controller')

/*=======================================
IMPORTAR EL MIDDLEWARE
=======================================*/
const { tokenVerify } = require('../middlewares/authentication')

/*================================
CREAR LAS RUTAS HTTP
================================*/
app.get('/mostrar-articulos', Article.getArticles)
app.post('/crear-articulo', tokenVerify, Article.createArticle)
app.put('/editar-articulo/:id', tokenVerify, Article.updateArticle)
app.delete('/eliminar-articulo/:id', tokenVerify, Article.deleteArticle)

/*=================================
EXPORTAR LA RUTA
=================================*/

module.exports = app
