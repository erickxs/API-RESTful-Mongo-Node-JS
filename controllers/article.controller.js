/*==================================
IMPORTAR EL MODEL
==================================*/
const Article = require('../models/article.model')

/*===============================
FUNCIÓN GET
===============================*/

let getArticle = (req, res) => {
  // https://mongoosejs.com/docs/api/model.html#model_Model.find

  Article.find({}).exec((err, data) => {
    if (err) {
      return res.json({
        status: 500,
        message: 'Error en la petición',
      })
    }

    // Contar la cantidad de registros

    Article.countDocuments({}, (err, total) => {
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
  getArticle,
}
