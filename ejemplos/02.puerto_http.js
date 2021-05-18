/*==========================================
UBICAR LOS REQUERIMIENTOS
==========================================*/

const http = require('http')

/*==================================
SALIDA DEL PUERTO
==================================*/

http
  .createServer((req, res) => {
    // res.write('Hola Erick')
    // res.end()
    res.writeHead(200, { 'Content-type': 'application/json' })
    let salida = {
      nombre: 'Erick de Leon',
      edad: 33,
      url: req.url,
    }

    res.write(JSON.stringify(salida))
    res.end()
  })
  .listen(4000)

console.log('Habilitado el puerto 4000')
