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