/*==================================
IMPORTAR EL MODEL
==================================*/
const Article = require('../models/article.model')

/*===========================================================================================
ESTA PAQUETE SIRVE PARA LA ADMINISTRACIÓN DE CARPETAS Y ARCHIVOS EN NODEJS
===========================================================================================*/
const fs = require('fs')
/*==========================================================
ESTE PAQUETE SIRVE PARA CREAR DIRECTORIOS
==========================================================*/
const mkdirp = require('mkdirp')
/*=============================================================
ESTE PAQUETE SIRVE PARA ELIMINAR DIRECTORIOS
=============================================================*/
const rimraf = require('rimraf')

/*===============================
FUNCIÓN GET
===============================*/

let getArticles = (req, res) => {
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

/*=============================
FUNCIÓN POST
=============================*/

let createArticle = (req, res) => {
  // Obtener el cuerpo del formulario

  let body = req.body

  if (!req.files) {
    return res.json({
      status: 400,
      message: 'La imagen no puede ir vacía',
    })
  }

  // Capturar el archivo .file es el nombre que se le da en la variable POST

  let file = req.files.file

  // Extensiones permitidas
  const allowedExtensions = ['image/jpeg', 'image/jpg', 'image/png'],
    sizeLimit = 2000000 // 2MB

  // Validar la extensión del archivo
  if (!allowedExtensions.includes(file.mimetype)) {
    // if (file.mimetype != 'image/jpeg' || file.mimetype != 'image/png') {
    return res.json({
      status: 400,
      message: 'Formato de archivo no permitido, solo se aceptan archivos .jpeg, .jpg o .png',
    })
  } else if (file.size > sizeLimit) {
    return res.json({
      status: 400,
      message: 'El peso de la imagen debe ser inferior a 2MB',
    })
  }

  // Cambiar nombre al archivo
  let filename = Math.floor(Math.random() * 10000)
  // Capturar la extensión del archivo
  let ext = file.name.split('.').pop()

  // Crear la nueva carpeta con el nombre de la URL

  let makeFolder = mkdirp.sync(`./uploads/articles/${body.url}`)

  // Mover el archivo a la carpeta

  file.mv(`./uploads/articles/${body.url}/${filename}.${ext}`, (err) => {
    // Si ocurré un error
    if (err) {
      return res.json({
        status: 500,
        message: 'Error al guardar la imagen',
        err,
      })
    }

    // Obtener los datos del formulario para enviarlos al modelo

    let article = new Article({
      image: `${filename}.${ext}`,
      url: body.url,
      title: body.title,
      summary: body.summary,
      body: body.body,
    })
    // Guardar la información en MongoDB
    // https://mongoosejs.com/docs/api.html#model_Model-save

    article.save((err, data) => {
      if (err) {
        return res.json({
          status: 400,
          message: 'Error al guardar el artículo',
          err,
        })
      }
      res.json({
        status: 200,
        message: 'El artículo ha sido creado con éxito',
        data,
      })
    })
  })
}

/*============================
FUNCIÓN PUT
============================*/

let updateArticle = (req, res) => {
  // Capturar el id del artículo a actualizar
  let id = req.params.id
  // Obtener el cuerpo del formulario
  let body = req.body

  /*============================================
  VALIDAR QUE EL ARTÍCULO EXISTA
  ============================================*/
  // https://mongoosejs.com/docs/api/model.html#model_Model.findById
  Article.findById(id, (err, data) => {
    // Validar que no ocurra un error en el proceso
    if (err) {
      return res.json({
        status: 500,
        message: 'Error en el servidor',
        err,
      })
    }
    // Validar que el artículo exista
    if (!data) {
      return res.json({
        status: 400,
        message: 'No se encontró el artículo en la base de datos',
      })
    }

    let currentImage = data.image

    /*==================================================
    VALIDAR QUE HAYA CAMBIO DE IMAGEN
    ==================================================*/

    let validateFileChange = (req, body, currentImage) => {
      return new Promise((resolve, reject) => {
        if (!req.files) {
          resolve(currentImage)
        } else {
          // Capturar el archivo .file es el nombre que se le da en la variable POST

          let file = req.files.file

          // Extensiones permitidas
          const allowedExtensions = ['image/jpeg', 'image/jpg', 'image/png'],
            sizeLimit = 2000000 // 2MB

          // Validar la extensión del archivo
          if (!allowedExtensions.includes(file.mimetype)) {
            let response = {
              res: res,
              message: 'Formato de archivo no permitido, solo se aceptan archivos .jpeg, .jpg o .png',
            }

            reject(response)
          } else if (file.size > sizeLimit) {
            let response = {
              res: res,
              message: 'El peso de la imagen debe ser inferior a 2MB',
            }
            reject(response)
          }

          // Cambiar nombre al archivo
          let filename = Math.floor(Math.random() * 10000)
          // Capturar la extensión del archivo
          let ext = file.name.split('.').pop()

          // let makeFolder = mkdirp.sync(`./uploads/articles/${body.url}`)

          // Mover el archivo a la carpeta
          file.mv(`./uploads/articles/${body.url}/${filename}.${ext}`, (err) => {
            // Si ocurré un error
            if (err) {
              let response = {
                res: res,
                message: 'Error al guardar la imagen',
              }
              reject(response)
            }
            // Eliminar el archivo antiguo;

            if (fs.existsSync(`./uploads/articles/${body.url}/${currentImage}`)) {
              fs.unlinkSync(`./uploads/articles/${body.url}/${currentImage}`)
            }

            // Se le asigna el nuevo nombre
            currentImage = `${filename}.${ext}`
            resolve(currentImage)
          })
        }
      })
    }

    /*=========================================
    ACTUALIZAR LOS REGISTROS
    =========================================*/

    let updateRecord = (id, body, currentImage) => {
      return new Promise((resolve, reject) => {
        let dataArticle = {
          image: currentImage,
          url: body.url,
          title: body.title,
          summary: body.summary,
          body: body.body,
        }

        // Actualizar en MongoDB
        // https://mongoosejs.com/docs/api/model.html#model_Model.findByIdAndUpdate
        // https://mongoosejs.com/docs/deprecations.html
        // { new: true, runValidators: true } // Sirve para devolver los datos ya actualizados
        Article.findByIdAndUpdate(id, dataArticle, { new: true, runValidators: true }, (err, data) => {
          if (err) {
            let response = {
              res: res,
              error: err,
            }

            reject(response)
          }

          let response = {
            res: res,
            data: data,
          }

          resolve(response)
        })
      })
    }

    /*=========================================
    SINCRONIZAR LAS PROMESAS
    =========================================*/

    validateFileChange(req, body, currentImage)
      .then((currentImage) => {
        // Debe devolver una ruta de imagen actualizada

        updateRecord(id, body, currentImage)
          .then((response) => {
            // Esto debe traer res y data
            response['res'].json({
              status: 200,
              message: 'El artículo ha sido actualizado con éxito',
              data: response['data'],
            })
          })
          .catch((response) => {
            response['res'].json({
              status: 400,
              message: 'Error al editar el artículo',
              err: response['err'],
            })
          })
      })
      .catch((response) => {
        response['res'].json({
          status: 400,
          message: response['err'],
        })
      })
  })
}

/*===============================
FUNCIÓN DELETE
===============================*/

let deleteArticle = (req, res) => {
  // Capturar el id del artículo a eliminar
  let id = req.params.id
  // Obtener el cuerpo del formulario
  let body = req.body

  /*============================================
  VALIDAR QUE EL ARTÍCULO EXISTA
  ============================================*/
  // https://mongoosejs.com/docs/api/model.html#model_Model.findById
  Article.findById(id, (err, data) => {
    // Validar que no ocurra un error en el proceso
    if (err) {
      return res.json({
        status: 500,
        message: 'Error en el servidor',
        err,
      })
    }
    // Validar que el artículo exista
    if (!data) {
      return res.json({
        status: 400,
        message: 'No se encontró el artículo en la base de datos',
      })
    }

    // Borrar la carpeta del artículo

    // if (fs.existsSync(`./uploads/articles/${data.image}`)) {
    //   fs.unlinkSync(`./uploads/articles/${data.image}`)
    // }

    let articlePathFolder = `./uploads/articles/${data.url}`
    rimraf.sync(articlePathFolder)

    // Borrar registro de mongoDB
    // https://mongoosejs.com/docs/api/model.html#model_Model.findByIdAndRemove

    Article.findByIdAndRemove(id, (err, data) => {
      if (err) {
        return res.json({
          status: 400,
          message: 'Error al eliminar el artículo',
          err,
        })
      }

      res.json({
        status: 200,
        message: 'El artículo se elimino con éxito',
      })
    })
  })
}

/*=======================================================
EXPORTAR LAS FUNCIONES DEL CONTROLADOR
=======================================================*/

module.exports = {
  getArticles,
  createArticle,
  updateArticle,
  deleteArticle,
}
