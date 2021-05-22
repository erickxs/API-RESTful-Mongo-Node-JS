// Requerir el módulo para gennerar token de autorización
const jwt = require('jsonwebtoken')

/*===================================================
VERFICAR EL TOKEN QUE SEA CORRECTO
===================================================*/

let tokenVerify = (req, res, next) => {
  let token = req.get('Authorization')

  jwt.verify(token, process.env.SECRET, (err, decoded) => {
    // Verificar si hay errores de cabecera
    if (err) {
      return res.json({
        status: 401,
        message: 'El Token de autorización no es válido.',
      })
    }
    //

    req.user = decoded.user
    next()
  })
}

module.exports = {
  tokenVerify,
}
