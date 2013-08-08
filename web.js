var http = require("http");
var url = require("url");
var qs = require('querystring');
var NodoSesionHttpServer = require("./NodoSesionHttpServer").clase;
var NodoRouter = require("./NodoRouter").clase;
var NodoConectorSocket = require("./NodoConectorSocket").clase;

var pad = function (n, width, z) {
  z = z || '0';
  n = n + '';
  return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
}

var sesiones = [];

var router = new NodoRouter("principal");

var onRequest = function(request, response) {
    var request_spliteado = request.url.split('/');
    if(request_spliteado.length == 2 && request_spliteado[1] == "create"){
        var sesion = new NodoSesionHttpServer(sesiones.length);
        sesiones.push(sesion);
        router.conectarCon(sesion);
        sesion.conectarCon(router);        
        sesion.mensajeParcial = "";
        response.writeHead(200, {
            'Content-Type': 'text/html;charset=UTF-8',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods':'GET, POST'        
        });
        response.write(pad(sesion.idSesion, 4));
        response.end();
        return;
    }    
    if(request_spliteado.length == 3 && request_spliteado[1] == "session"){  
        var nro_sesion = parseInt(request_spliteado[2]);
        if(nro_sesion>=sesiones.length){
                response.writeHead(405, 
                       "La sesión no existe", 
                       {'Content-Type': 'text/html',  
                        'Access-Control-Allow-Origin': '*',
                        'Access-Control-Allow-Methods':'GET, POST' 
                       });
            response.end();
        }
        var sesion = sesiones[nro_sesion];        
        request.on('data', function (chunk) {
            sesion.mensajeParcial += chunk.toString();
          });
        request.on('end', function () {
            if(sesion.mensajeParcial!=""){                    
                var mensajes_desde_el_cliente = JSON.parse(qs.parse(sesion.mensajeParcial).mensajes_vortex).contenidos;
                for(var i=0; i<mensajes_desde_el_cliente.length; i++){
                    sesion.recibirMensajePorHttp(mensajes_desde_el_cliente[i]);    
                    if(mensajes_desde_el_cliente[i].tipoDeMensaje == "vortex.video.frame"){
                        console.log("Recibido un frame de " + mensajes_desde_el_cliente[i].usuarioTransmisor);                            
                    }
                }  
                sesion.mensajeParcial = "";
            }
            var mensajes_para_el_cliente = sesion.getMensajesRecibidos();  
            response.writeHead(200, {
                'Content-Type': 'text/html;charset=UTF-8',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods':'GET, POST'        
            });
            response.write(JSON.stringify(
                {contenidos:mensajes_para_el_cliente,
                 proximaEsperaMinima:0,
                 proximaEsperaMaxima:300000
                }));
            response.end();
        }); 
        return;
    }   
    response.writeHead(405, 
                       "Comando no reconocido", 
                       {'Content-Type': 'text/html',  
                        'Access-Control-Allow-Origin': '*',
                        'Access-Control-Allow-Methods':'GET, POST' 
                       });
    response.end();
  };
//var puerto = process.env.PORT || 3000;
//http.createServer(onRequest).listen(puerto);

var puerto = process.env.PORT || 3000;
var app = http.createServer(onRequest).listen(puerto);
var io = require('socket.io').listen(app);

io.sockets.on('connection', function (socket) {
    console.log("nueva conexion socket");
    var sesion_socket = new NodoConectorSocket(socket);
    router.conectarBidireccionalmenteCon(sesion_socket);
});

io.configure(function () { 
    io.set("transports", ["xhr-polling"]); 
    io.set("polling duration", 10); 
});


//console.log('Arrancó la cosa en ' + puerto);