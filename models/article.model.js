/*==========================================
UBICAR LOS REQUERIMIENTOS
==========================================*/
const mongoose = require('mongoose')

/*==========================================================
ESQUEMA PARA EL MODELO CONECTOR A MONGODB
==========================================================*/

let Schema = mongoose.Schema
let articleSchema = new Schema({
  cover: {
    type: String,
    required: [true, 'La portada es obligatoria'],
  },
  url: {
    type: String,
    required: [true, 'La url es obligatoria'],
  },
  title: {
    type: String,
    required: [true, 'El titulo es obligatorio'],
  },
  summary: {
    type: String,
    required: [true, 'El resumen es obligatorio'],
  },
  body: {
    type: String,
    required: [true, 'El contenido es obligatorio'],
  },
})

/*===================================
EXPORTAR EL MODELO
===================================*/
// const Article = mongoose.model('articles', articleSchema)

module.exports = mongoose.model('articles', articleSchema)
