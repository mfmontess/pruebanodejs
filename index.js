var http = require('http'),
    fs = require('fs'),
    mustache = require('mustache');
	

//var products = require('./fixtures/productsFixture.js');
//var productSummaryTemplate = fs.readFileSync('component_templates/product_summary.html','utf-8');
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
				
		//window.document.querySelector("#titulo").innerHTML = "Prueba5";
		$("#titulo").innerHTML = "Prueba5";
		$("#user").val("Michael");
		console.log(window.document.querySelector("#titulo").innerHTML);
		resolve("<!DOCTYPE html>\n" + window.document.querySelector("html").outerHTML)
    }, 0)
  })
}

/*http.createServer(function(request,response) {
		var camino = 'pages_templates/product_list.html';
		var content = fs.readFileSync(camino, 'utf8');
		const { JSDOM } = require( 'jsdom' );
		const jsdom = new JSDOM( content );
		const { window } = jsdom;
		const { document } = window;
		global.window = window;
		global.document = document;
		const $ = global.jQuery = require( 'jquery' );
				
		window.document.querySelector("#titulo").innerHTML = "Prueba4";
		console.log($("#user").val());
		$("#user").val("Michael");
		//console.log(window.document.querySelector("#titulo").innerHTML);
		
		response.writeHead(200, { 'Content-Type': 'text/html' });
		response.write("<!DOCTYPE html>\n" + window.document.querySelector("html").outerHTML);
		response.end();
    }).listen(8078);*/