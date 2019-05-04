const http = require('http');
const url = require('url');
const fs = require('fs');
const querystring = require('querystring');
var MongoClient = require('mongodb').MongoClient;
const urlMongo = "mongodb://localhost:27017/";
const hostname = '127.0.0.1';
const port = 3000;

const mime = {
  'html': 'text/html',
  'css': 'text/css',
  'jpg': 'image/jpg',
  'ico': 'image/x-icon',
  'mp3': 'audio/mpeg3',
  'mp4': 'video/mp4'
};

const server = http.createServer((pedido, respuesta) => {
  const objetourl = url.parse(pedido.url);
  let camino = 'public' + objetourl.pathname;
  if (camino == 'public/')
    camino = 'public/index.html';
  encaminar(pedido, respuesta, camino);
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});


function encaminar(pedido, respuesta, camino) {
  console.log(camino);
  switch (camino) {
    case 'public/autenticacion': {
      recuperar(pedido, respuesta);
      break;
    }
    case 'public/registro': {
      registrar(pedido, respuesta);
      break;
    }
    default: {
      fs.stat(camino, error => {
        if (!error) {
          fs.readFile(camino, (error, contenido) => {
            if (error) {
              respuesta.writeHead(500, { 'Content-Type': 'text/plain' });
              respuesta.write('Error interno');
              respuesta.end();
            } else {
              const vec = camino.split('.');
              const extension = vec[vec.length - 1];
              const mimearchivo = mime[extension];
              respuesta.writeHead(200, { 'Content-Type': mimearchivo });
              respuesta.write(contenido);
              respuesta.end();
            }
          });
        } else {
          respuesta.writeHead(404, { 'Content-Type': 'text/html' });
          respuesta.write('<!doctype html><html><head></head><body>Recurso inexistente</body></html>');
          respuesta.end();
        }
      });
    }
  }
}

function recuperar(pedido, respuesta) {
  let info = '';
  pedido.on('data', datosparciales => {
    info += datosparciales;
  });
  pedido.on('end', () => {
    const formulario = querystring.parse(info);
    MongoClient.connect(urlMongo, { useNewUrlParser: true }, function (err, db) {
      if (err) throw err;
      var dbo = db.db("mydb");
      var query = { username: formulario['usuario'], password: formulario['clave'] };
      dbo.collection("users").find(query).toArray(function (err, result) {
        if (err) {
          throw err;
        } else {
          if (result.length == 0) {/*Si no retorno nada significa que no existe el usuario */
            console.log("Usuario incorrecto o no existe");
            respuesta.writeHead(301, { 'Location': `http://${hostname}:${port}/login.html?acc=err` });
            respuesta.end();
          }
          else {/*Si retorno algo, obtiene el primer resultado y redirige a la pagina perfil */
            var x = result.shift();
            camino = 'public/perfil.html';
            
            encaminar(pedido, respuesta, camino);
          }
          db.close();
        }
      });
    });
  });
}

function registrar(pedido, respuesta) {
  let info = '';
  pedido.on('data', datosparciales => {
    info += datosparciales;
  });
  pedido.on('end', () => {
    const formulario = querystring.parse(info);
    if (formulario['clave'] == formulario['rclave']) {
      MongoClient.connect(urlMongo, { useNewUrlParser: true }, function (err, db) {
        if (err) throw err;
        var dbo = db.db("mydb");
        var myobj = { username: formulario['usuario'], password: formulario['clave'] };
        dbo.collection("users").insertOne(myobj, function (err, res) {
          if (err) throw err;
          console.log(`${formulario['usuario']} inserted`);
          db.close();
        });
      });
      respuesta.writeHead(301, { 'Location': `http://${hostname}:${port}/registro.html?acc=conf` });
      respuesta.end();
    } else {
      console.log("La contraseña no coincide con su confirmación.");
      respuesta.writeHead(301, { 'Location': `http://${hostname}:${port}/registro.html?acc=err` });
      respuesta.end();
    }
  });
}

console.log('Servidor web iniciado');