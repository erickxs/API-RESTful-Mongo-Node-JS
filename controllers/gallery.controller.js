/*==================================
IMPORTAR EL MODEL
==================================*/
const Gallery = require('../models/gallery.model')

/*===============================
FUNCIÓN GET
===============================*/

let getGallery = (req, res) => {
  // https://mongoosejs.com/docs/api/model.html#model_Model.find

  Gallery.find({}).exec((err, data) => {
    if (err) {
      return res.json({
        status: 500,
        message: 'Error en la petición',
      })
    }

    // Contar la cantidad de registros

    Gallery.countDocuments({}, (err, total) => {
      if (err) {
        return res.json({
          status: 500,
          message: 'Error en la petición',
        })
      }
      res.json({
        status: 200,
        total,
        data,
      })
    })
  })
}

/*=======================================================
EXPORTAR LAS FUNCIONES DEL CONTROLADOR
=======================================================*/

module.exports = {
  getGallery,
}
