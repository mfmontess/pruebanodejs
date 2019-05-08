var http = require('http'),
    fs = require('fs'),
    mustache = require('mustache');
	
http.createServer(function(request, response){
	response.writeHead(200, {'Content-Type':'text/html'});
	promisedIdentity('pages_templates/product_list.html')
	  .then(arg => {
		response.write(arg);
		response.end();
	  })
}).listen(8078);

function promisedIdentity(x) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
		var content = fs.readFileSync(x, 'utf8');
		const { JSDOM } = require( 'jsdom' );
		const jsdom = new JSDOM( content );
		const { window } = jsdom;
		const { document } = window;
		global.window = window;
		global.document = document;
		const $ = global.jQuery = require( 'jquery' );
		
		$("#titulo").text('Prueba5');
		$("#user").attr('value','Fabian');
		resolve("<!DOCTYPE html>\n" + $("html").html())
    }, 0)
  })
}