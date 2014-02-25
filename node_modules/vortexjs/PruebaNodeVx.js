var vx = require('./vortex').Vortex;
var FiltroXEjemplo = require("./FiltrosYTransformaciones").FiltroXEjemplo;

vx.start({verbose:true});
vx.conectarPorWebSockets({
    //url:'https://router-vortex.herokuapp.com' 
    url:'http://localhost:3000'
});   

vx.pedirMensajes({
    filtro: new FiltroXEjemplo({tipoDeMensaje:"chota"}),
    callback: function(mensaje){
        console.log("llego: " + JSON.stringify(mensaje));
    }
});