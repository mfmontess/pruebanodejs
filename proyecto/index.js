const http = require('http');
const url = require('url');
const fs = require('fs');
const querystring = require('querystring');
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
    respuesta.writeHead(200, { 'Content-Type': 'text/html' });
    const pagina =
      `<!doctype html><html><head></head><body>
       Nombre de usuario:${formulario['usuario']}<br>
      Clave:${formulario['clave']}<br>
      <a href="login.html">Retornar</a>
      </body></html>`;
    respuesta.end(pagina);
  });
}

function registrar(pedido, respuesta) {
  let info = '';
  pedido.on('data', datosparciales => {
    info += datosparciales;
  });
  pedido.on('end', () => {
    const formulario = querystring.parse(info);
    respuesta.writeHead(200, { 'Content-Type': 'text/html' });
    const pagina =
      `<!doctype html><html><head></head><body>
       Nombre de usuario:${formulario['usuario']}<br>
      Clave:${formulario['clave']}<br>
      Confirmacion Clave:${formulario['rclave']}<br>
      <a href="login.html">Retornar</a>
      </body></html>`;
    respuesta.end(pagina);
  });
}

console.log('Servidor web iniciado');