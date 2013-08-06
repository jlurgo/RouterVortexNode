/*
Vortex by Vortex Group is licensed under a Creative Commons Reconocimiento 3.0 Unported License.
To view a copy of this licence, visit: http://creativecommons.org/licenses/by/3.0/
Project URL: https://sourceforge.net/p/vortexnet
*/

var NodoSesionHttpServer = function(id){
    this.idSesion = id;
    this.bandejaDeEntrada = [];
};

NodoSesionHttpServer.prototype.conectarCon = function(un_nodo){
    this.receptor = un_nodo;
};

NodoSesionHttpServer.prototype.recibirMensaje = function(mensaje){
    //console.log("mensaje recibido desde el router en sesion " + this.idSesion + " : " + JSON.stringify(mensaje));
    this.bandejaDeEntrada.push(mensaje);
};

NodoSesionHttpServer.prototype.recibirMensajePorHttp = function(mensaje){
    //console.log("mensaje recibido desde el cliente en sesion " + this.idSesion + " : " + JSON.stringify(mensaje));
    this.receptor.recibirMensaje(mensaje);
};

NodoSesionHttpServer.prototype.getMensajesRecibidos = function(){
    var mensajesRecibidos = [];
    for(i=0;i<this.bandejaDeEntrada.length;i++){
        mensajesRecibidos.push(this.bandejaDeEntrada[i]);
    }
    this.bandejaDeEntrada = [];
    return mensajesRecibidos;
};

exports.clase = NodoSesionHttpServer;