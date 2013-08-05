var http = require("http");
var url = require("url");
var qs = require('querystring');
var NodoSesionHttpServer = require("./NodoSesionHttpServer").clase;
var NodoRouter = require("./NodoRouter").clase;


var pad = function (n, width, z) {
  z = z || '0';
  n = n + '';
  return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
}

var sesiones = [];

var router = new NodoRouter("principal");

var onRequest = function(request, response) {
    response.writeHead(200, {
        'Content-Type': 'text/html;charset=UTF-8',
        'Access-Control-Allow-Origin': '*'
    });
    var request_spliteado = request.url.split('/');
    if(request_spliteado.length == 2 && request_spliteado[1] == "create"){
        var sesion = new NodoSesionHttpServer(sesiones.length);
        sesiones.push(sesion);
        router.conectarCon(sesion);
        sesion.conectarCon(router);
        response.write(pad(sesiones.length-1, 4));
    }    
    if(request_spliteado.length == 3 && request_spliteado[1] == "session"){  
        var nro_sesion = parseInt(request_spliteado[2]);
        if(nro_sesion<sesiones.length){
            var sesion = sesiones[nro_sesion];        
            var body = "";
            request.on('data', function (chunk) {
                body += chunk.toString();
              });
            request.on('end', function () {
                var mensajes_desde_el_cliente = JSON.parse(qs.parse(body).mensajes_vortex).contenidos;
                for(var i=0; i<mensajes_desde_el_cliente.length; i++){
                    sesion.recibirMensajePorHttp(mensajes_desde_el_cliente[i]);     
                    console.log('POSTed: ' + JSON.stringify(mensajes_desde_el_cliente[i]));
                }         
              });
            var mensajes_para_el_cliente = sesion.getMensajesRecibidos();    
            response.write(JSON.stringify(
                {contenidos:mensajes_para_el_cliente,
                 proximaEsperaMinima:0,
                 proximaEsperaMaxima:300000
                }));
        }
    }   
    response.end();
  }

http.createServer(onRequest).listen(8888);
console.log('Arrancó la cosa');