var http = require('http'),
    fs = require('fs');

const { JSDOM } = require( 'jsdom' );
	
http.createServer(function(request, response){
	response.writeHead(200, {'Content-Type':'text/html'});
	promisedIdentity('public/perfil.html')
	  .then(arg => {
		response.write(arg);
		response.end();
	  })
}).listen(8078);

function promisedIdentity(x) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
		var content = fs.readFileSync(x, 'utf8');
		const jsdom = new JSDOM( content );
		const { window } = jsdom;
		const { document } = window;
		global.window = window;
		global.document = document;
		const $ = global.jQuery = require( 'jquery' );
		
		$("#username").attr('value','Fabian');
		$("#email").attr('value','micorreo@correo.com');
		$("#rdGeneroMasculino").prop('checked', false);
		$("#rdGeneroFemenino").prop('checked', true);
		resolve("<!DOCTYPE html>\n" + $("html").html())
    }, 0)
  })
}
//https://stackoverflow.com/questions/45218712/update-html-input-value-in-node-js-without-changing-pages
//https://cheerio.js.org/