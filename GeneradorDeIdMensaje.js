/*
Vortex by Vortex Group is licensed under a Creative Commons Reconocimiento 3.0 Unported License.
To view a copy of this licence, visit: http://creativecommons.org/licenses/by/3.0/
Project URL: https://sourceforge.net/p/vortexnet
*/
var GeneradorDeIdMensaje = function(){
	var numeroSecuencia = 0;
	var idEmisor = Math.floor((Math.random() * 10000) + 1).toString();
	
	this.ponerIdAlMensaje = function(un_mensaje){
		numeroSecuencia++;
        var idMensaje = {
            "id_del_emisor": idEmisor,
            "numero_secuencia": numeroSecuencia
        };
        un_mensaje.id_mensaje_vortex = idMensaje;
	}
};

if(typeof(require) != "undefined"){ exports.clase = GeneradorDeIdMensaje;}