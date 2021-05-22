/*==================================
IMPORTAR EL MODEL
==================================*/
const Admin = require('../models/admin.model')
// Modulo para encriptar contraseñas
const bcrypt = require('bcrypt')

/*===============================
FUNCIÓN GET
===============================*/

let getAdmins = (req, res) => {
  Admin.find({}).exec((err, data) => {
    if (err) {
      return res.json({
        status: 500,
        message: 'Error en la petición',
      })
    }

    // Contar la cantidad de registros

    Admin.countDocuments({}, (err, total) => {
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

let createAdmin = (req, res) => {
  // Obtener el cuerpo del formulario

  let body = req.body

  // Obtener los datos del formulario para enviarlos al modelo

  let admin = new Admin({
    user: body.user,
    pass: bcrypt.hashSync(body.pass, 10),
  })
  // Guardar la información en MongoDB
  // https://mongoosejs.com/docs/api.html#model_Model-save

  admin.save((err, data) => {
    if (err) {
      return res.json({
        status: 400,
        message: 'Error al guardar el administrador',
        err,
      })
    }
    res.json({
      status: 200,
      message: 'El administrador ha sido creado con éxito',
      data,
    })
  })
}

/*============================
FUNCIÓN PUT
============================*/

let updateAdmin = (req, res) => {
  // Capturar el id del administrador a actualizar
  let id = req.params.id
  // Obtener el cuerpo del formulario
  let body = req.body

  /*============================================
  VALIDAR QUE EL ADMINISTRADOR EXISTA
  ============================================*/
  // https://mongoosejs.com/docs/api/model.html#model_Model.findById
  Admin.findById(id, (err, data) => {
    // Validar que no ocurra un error en el proceso
    if (err) {
      return res.json({
        status: 500,
        message: 'Error en el servidor',
        err,
      })
    }
    // Validar que el administrador exista
    if (!data) {
      return res.json({
        status: 400,
        message: 'No se encontró el administrador en la base de datos',
      })
    }

    let currentPass = data.pass

    /*==================================================
    VALIDAR QUE HAYA CAMBIO DE CONTRASEÑA
    ==================================================*/

    let validatePassChange = (req, body, currentPass) => {
      return new Promise((resolve, reject) => {
        if (body.pass == undefined) {
          resolve(currentPass)
        } else {
          //
          currentPass = bcrypt.hashSync(body.pass, 10)
          resolve(currentPass)
        }
      })
    }

    /*=========================================
    ACTUALIZAR LOS REGISTROS
    =========================================*/

    let updateRecord = (id, body, currentPass) => {
      return new Promise((resolve, reject) => {
        let dataAdmin = {
          user: body.user,
          pass: currentPass,
        }

        // Actualizar en MongoDB
        // https://mongoosejs.com/docs/api/model.html#model_Model.findByIdAndUpdate
        // https://mongoosejs.com/docs/deprecations.html
        // { new: true, runValidators: true } // Sirve para devolver los datos ya actualizados
        Admin.findByIdAndUpdate(id, dataAdmin, { new: true, runValidators: true }, (err, data) => {
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

    validatePassChange(req, body, currentPass)
      .then((currentPass) => {
        // Debe devolver el password actualizado

        updateRecord(id, body, currentPass)
          .then((response) => {
            // Esto debe traer res y data
            response['res'].json({
              status: 200,
              message: 'El administrador ha sido actualizado con éxito',
              data: response['data'],
            })
          })
          .catch((response) => {
            response['res'].json({
              status: 400,
              message: 'Error al editar el administrador',
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

let deleteAdmin = (req, res) => {
  // Capturar el id del administrador a eliminar
  let id = req.params.id
  // Obtener el cuerpo del formulario
  let body = req.body

  /*============================================
  VALIDAR QUE EL ADMINISTRADOR EXISTA
  ============================================*/
  // https://mongoosejs.com/docs/api/model.html#model_Model.findById
  Admin.findById(id, (err, data) => {
    // Validar que no ocurra un error en el proceso
    if (err) {
      return res.json({
        status: 500,
        message: 'Error en el servidor',
        err,
      })
    }
    // Validar que el administrador exista
    if (!data) {
      return res.json({
        status: 400,
        message: 'No se encontró el administrador en la base de datos',
      })
    }

    // Borrar registro de mongoDB
    // https://mongoosejs.com/docs/api/model.html#model_Model.findByIdAndRemove

    Admin.findByIdAndRemove(id, (err, data) => {
      if (err) {
        return res.json({
          status: 400,
          message: 'Error al eliminar el administrador',
          err,
        })
      }

      res.json({
        status: 200,
        message: 'El administrador se elimino con éxito',
      })
    })
  })
}

/*=======================================================
EXPORTAR LAS FUNCIONES DEL CONTROLADOR
=======================================================*/

module.exports = {
  getAdmins,
  createAdmin,
  updateAdmin,
  deleteAdmin,
}
