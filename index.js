var http = require('http'),
	fs = require('fs'),
	url = require('url'),
	querystring = require('querystring'),
	req = require('request');

const hostname = '127.0.0.1';
const port = 8078;

const mime = {
	'html': 'text/html',
	'css': 'text/css',
	'jpg': 'image/jpg',
	'ico': 'image/x-icon',
	'mp3': 'audio/mpeg3',
	'mp4': 'video/mp4'
};

const { JSDOM } = require('jsdom');

const server = http.createServer(function (request, response) {
	const objetourl = url.parse(request.url);
	let camino = 'public' + objetourl.pathname;
	if (camino == 'public/')
		camino = 'public/login.html';
	encaminar(request, response, camino);
});

server.listen(port, hostname, () => {
	console.log(`Server running at http://${hostname}:${port}/`);
});

function encaminar(request, response, camino) {
	console.log(camino);
	switch (camino) {
		case 'public/autenticacion': {
			autenticacion(request, response);
			break;
		}
		case 'public/registro': {
			registro(request, response);
			break;
		}
		default: {
			fs.stat(camino, error => {
				if (!error) {
					fs.readFile(camino, (error, contenido) => {
						if (error) {
							response.writeHead(500, { 'Content-Type': 'text/plain' });
							response.write('Error interno');
							response.end();
						} else {
							const vec = camino.split('.');
							const extension = vec[vec.length - 1];
							const mimearchivo = mime[extension];
							response.writeHead(200, { 'Content-Type': mimearchivo });
							response.write(contenido);
							response.end();
						}
					});
				} else {
					response.writeHead(404, { 'Content-Type': 'text/html' });
					response.write('<!doctype html><html><head></head><body>Recurso inexistente</body></html>');
					response.end();
				}
			});
		}
	}
}

function autenticacion(request, response) {
	response.writeHead(200, { 'Content-Type': 'text/html' });
	let info = '';
	request.on('data', datosparciales => {
		info += datosparciales;
	});
	request.on('end', () => {
		const formulario = querystring.parse(info);
		var jsonDataObj = { 'usPassword': formulario['clave'], 'usCorreo': formulario['correo'] };
		var data = '';
		connection('http://intercambioback.herokuapp.com/api/', 'autenticar/user/', jsonDataObj)
			.then(arg => {
				if (arg.body.mensaje == 'Bienvenido') {
					data = JSON.parse(arg.body.data);
					console.log(data);
					cargarPerfil('public/perfil.html', data)
						.then(arg => {
							response.write(arg);
							response.end();
						});
				} else {
					console.log(arg.body.mensaje);
					response.writeHead(301, { 'Location': `http://${hostname}:${port}/login.html?acc=err` });
					response.end();
				}
			});
	});
}

function registro(request, response) {
	response.writeHead(200, { 'Content-Type': 'text/html' });
	let info = '';
	request.on('data', datosparciales => {
		info += datosparciales;
	});
	request.on('end', () => {
		const formulario = querystring.parse(info);
		if (formulario['clave'] == formulario['rclave']) {
			var jsonDataObj = { 'usNombre': formulario['usuario'], 'usPassword': formulario['clave'], 'usCorreo': formulario['correo'] };
			var data = '';
			connection('http://intercambioback.herokuapp.com/api/', 'registro/usuario/', jsonDataObj)
				.then(arg => {
					if (arg.body.mensaje == 'Bienvenido') {
						data = JSON.parse(arg.body.data);
						console.log('Respuesta: ' + data);
						response.writeHead(301, { 'Location': `http://${hostname}:${port}/registro.html?acc=conf` });
						response.end();
					} else {
						console.log('Mensaje Respuesta: ' + arg.body.mensaje);
						response.writeHead(301, { 'Location': `http://${hostname}:${port}/registro.html?acc=err` });
						response.end();
					}
				});
		} else {
      console.log("La contraseña no coincide con su confirmación.");
      response.writeHead(301, { 'Location': `http://${hostname}:${port}/registro.html?acc=err` });
      response.end();
    }
	});
}

function connection(url, method, parameter) {
	return new Promise((resolve, reject) => {
		setTimeout(() => {
			req.post({
				headers: { 'content-type': 'application/json' },
				url: url + method,
				json: true,
				body: parameter
			}, function (error, response, body) {
				if (!error && response.statusCode == 202) {
					resolve(response)
				} else if (error || response.statusCode != 202) {
					throw error;
				}
			});
		}, 0)
	})
}

function cargarPerfil(x, data) {
	return new Promise((resolve, reject) => {
		setTimeout(() => {
			var content = fs.readFileSync(x, 'utf8');
			const jsdom = new JSDOM(content);
			const { window } = jsdom;
			const { document } = window;
			global.window = window;
			global.document = document;
			const $ = global.jQuery = require('jquery');

			$("#name").attr('value', data.usNombre);
			$("#email").attr('value', data.usCorreo);
			$("#pwd").attr('value', data.usPassword);
			resolve("<!DOCTYPE html>\n" + $("html").html())
		}, 0)
	})
}