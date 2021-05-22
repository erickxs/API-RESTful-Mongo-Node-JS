/*==========================================
UBICAR LOS REQUERIMIENTOS
==========================================*/
const mongoose = require('mongoose')

/*==========================================================
ESQUEMA PARA EL MODELO CONECTOR A MONGODB
==========================================================*/

let Schema = mongoose.Schema
let adminSchema = new Schema({
  user: {
    type: String,
    required: [true, 'El usuario es obligatorio'],
    unique: true,
  },
  pass: {
    type: String,
    required: [true, 'La contraseña es obligatoria'],
  },
})

/*=========================================================
EVITAR DEVOLVER EN LA DATA EL CAMPO PASS
=========================================================*/

adminSchema.methods.toJSON = function () {
  let admin = this
  let adminObject = admin.toObject()
  delete adminObject.pass
  return adminObject
}

/*===================================
EXPORTAR EL MODELO
===================================*/

module.exports = mongoose.model('admins', adminSchema)
