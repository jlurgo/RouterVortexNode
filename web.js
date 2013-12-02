var http = require("http");
var url = require("url");
var qs = require('querystring');
var Vortex = require('vortexjs');
var express = require('express');

var NodoSesionHttpServer = Vortex.NodoSesionHttpServer;
var NodoRouter = Vortex.NodoRouter;
var NodoConectorSocket = Vortex.NodoConectorSocket;

var pad = function (n, width, z) {
  z = z || '0';
  n = n + '';
  return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
}

var sesiones_http = [];
var sesiones_web_socket = [];

var router = new NodoRouter("principal");

var allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', "*");
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
}

var app = express();

app.use(allowCrossDomain);

app.post('/create', function(request, response){
    var sesion = new NodoSesionHttpServer(sesiones.length);
    sesiones_http.push(sesion);
    router.conectarCon(sesion);
    sesion.conectarCon(router);        
    sesion.mensajeParcial = "";
    response.send(pad(sesion.idSesion, 4));
});

app.post('/session/:nro_sesion', function(request, response){
    var nro_sesion = parseInt(request.params.nro_sesion);
    if(nro_sesion>=sesiones_http.length){
        response.send("La sesión no existe");
        return;
    }
    var sesion = sesiones_http[nro_sesion];        
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
        response.send(JSON.stringify(
            {contenidos:mensajes_para_el_cliente,
             proximaEsperaMinima:0,
             proximaEsperaMaxima:300000
            }));
    }); 
});

app.get('/infoSesiones', function(request, response){
    var info_sesiones = {
        http: sesiones_http.length,
        webSocket: sesiones_web_socket.length
    };
    response.send(JSON.stringify(info_sesiones));
});

var server = http.createServer(app);
var io = require('socket.io').listen(server);

io.sockets.on('connection', function (socket) {
    console.log("nueva conexion socket");
    var sesion_socket = new NodoConectorSocket(socket);
    router.conectarBidireccionalmenteCon(sesion_socket);
    sesiones_web_socket.push(sesion_socket);
});

io.configure(function () { 
    io.set("transports", ['websocket', 'flashsocket', 'xhr-polling']); 
    io.set("polling duration", 10); 
    io.disable('log');
});

var puerto = process.env.PORT || 3000;
server.listen(puerto);


//console.log('Arrancó la cosa en ' + puerto);