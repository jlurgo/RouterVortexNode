/*
Vortex by Vortex Group is licensed under a Creative Commons Reconocimiento 3.0 Unported License.
To view a copy of this licence, visit: http://creativecommons.org/licenses/by/3.0/
Project URL: https://sourceforge.net/p/vortexnet
*/
var NodoClienteHTTP = function (url, intervalo_polling) {
    var idSesion;
    var intervaloPolling = (intervalo_polling === undefined)? 1500 : intervalo_polling;;
    var intervaloPedidoIdSesion = 5000;
    var bandejaSalida = [];
    //arranca con un receptor que no hace nada
    var receptor = {
        recibirMensaje: function (un_mensaje) { }
    };

    this.recibirMensaje = function (un_mensaje) {
        bandejaSalida.push(un_mensaje);
    }

    this.conectarCon = function (un_receptor) {
        receptor = un_receptor;
    }
    function pedirIdSesion() {
        $.ajax({
            type: "POST",            
            url: url + '/create',
            xhrFields: {
                withCredentials: false
            },
            success: function (responseData, textStatus, jqXHR) {
                idSesion = responseData;
                console.log("idSesion:", idSesion);
                setTimeout(enviarYRecibirMensajes, intervaloPolling);
            },

            error: function (request, error) {
                console.log("errorAlPedirSesion:", error);
                setTimeout(pedirIdSesion, intervaloPedidoIdSesion);
            }
        });
    }

    function enviarYRecibirMensajes() {
        var bandejaSalidaAux = [];
        bandejaSalidaAux = bandejaSalidaAux.concat(bandejaSalida);
        bandejaSalida = [];

        var datosSalida = {
            "contenidos": bandejaSalidaAux,
            "proximaEsperaMinima": 0,
            "proximaEsperaMaxima": 300000
        };
        if (bandejaSalidaAux.length > 0) {
            console.log("enviando:", bandejaSalidaAux);
        }
        $.ajax({
            type: "POST",
            url: url + '/session/' + idSesion,
            xhrFields: {
                withCredentials: false
            },
            data: {
                mensajes_vortex: JSON.stringify(datosSalida)
            },
            success: function (responseData, textStatus, jqXHR) {
                var mensajesRecibidos = $.parseJSON(responseData).contenidos;

                mensajesRecibidos.forEach(function (element, index, array) {
                    console.log("mensaje recibido:", element);
                    receptor.recibirMensaje(element);
                });

                setTimeout(enviarYRecibirMensajes, intervaloPolling);
            },

            error: function (request, error) {
                console.log("error Al Enviar/Recibir Mensajes:", error);
                setTimeout(pedirIdSesion, intervaloPedidoIdSesion);
                bandejaSalida = bandejaSalida.concat(bandejaSalidaAux);
            }
        });
    }

    //pido sesi�n
    pedirIdSesion();
}