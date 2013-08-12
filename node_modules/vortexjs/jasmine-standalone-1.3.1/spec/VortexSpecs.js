/*
Vortex by Vortex Group is licensed under a Creative Commons Reconocimiento 3.0 Unported License.
To view a copy of this licence, visit: http://creativecommons.org/licenses/by/3.0/
Project URL: https://sourceforge.net/p/vortexnet
*/

var test = {}
var esperarAQueLlegueMensajeEn = function(receptor, tipo_de_mensaje, mensaje_de_error){
    waits(0);        
    waitsFor(function() {                    
        return Enumerable.From(receptor.recibirMensaje.calls)
                        .Any(function(llamada){
                            return llamada.args[0].tipoDeMensaje == tipo_de_mensaje;
                        });
    }, mensaje_de_error, 500);  
}

test.describe_1 = function(){
    describe("Vortex", function() {     
        beforeEach(function() {
            runs(function() { 
                test.mensaje_del_tipo_1 = {tipoDeMensaje:'1'};
                test.filtro_de_mensajes_del_tipo_1 = new FiltroXClaveValor('tipoDeMensaje', '1');    
                test.mensaje_del_tipo_2 = {tipoDeMensaje:'2'};
                test.filtro_de_mensajes_del_tipo_2 = new FiltroXClaveValor('tipoDeMensaje', '2');  
            });
        });
        describe("Tengo un portal", function(){
            test.describe_1_1();
        }); 
    });
};

test.describe_1_1 = function(){
    beforeEach(function() {
        runs(function() { 
            test.portal_1 = new NodoPortalBidi("1");   
            spyOn(test.portal_1, 'recibirMensaje').andCallThrough();
        });
    });
    it("Su filtro de salida deberia ser false (pasa nada)", function() {
        runs(function() { 
            expect(ComparadorDeFiltros.compararFiltros(test.portal_1.filtroDeSalida(), new FiltroFalse())); 
        });
    });
    
    describe("Lo conecto unidireccionalmete con un router", function(){
        test.describe_1_1_1();
    });        
};

test.describe_1_1_1 = function(){
    beforeEach(function() {
        runs(function() { 
            test.router_1 = new NodoRouter("1");   
            spyOn(test.router_1, 'recibirMensaje').andCallThrough();
            
            test.portal_1.conectarCon(test.router_1);
        });
    });
    
    it("El router deberia recibir asincronicamente un pedido de id del portal", function() {
        runs(function() {
            expect(test.router_1.recibirMensaje).not.toHaveBeenCalled();
            expect(test.router_1.recibirMensaje).not.toHaveBeenCalled();
        });
    
        waits(0);        
        waitsFor(function() {
                return  test.portal_1.recibirMensaje.calls.length == 0 &&
                        test.router_1.recibirMensaje.calls.length == 1;           
        }, "El Router no recibio el pedido", 500);
        runs(function() {
           expect(test.router_1.recibirMensaje.calls[0].args[0].tipoDeMensaje).toEqual("Vortex.IdRemoto.Pedido");
        });
     });
     
    it("Su filtro de salida deberia ser true (pasa todo)", function() {
        runs(function() {
            expect(ComparadorDeFiltros.compararFiltros(test.portal_1.filtroDeSalida(), new FiltroTrue())); 
        });
    });
    
    describe("Conecto el router unidireccionalmente a un segundo portal", function(){
        test.describe_1_1_1_1();
    }); 
    
    describe("Conecto un segundo portal unidireccionalmente al router", function(){
        test.describe_1_1_1_2();
    }); 
    
    describe("Conecto el router al portal formando un enlace bidireccional", function(){
        test.describe_1_1_1_3();
    });   
};

test.describe_1_1_1_1 = function(){
    beforeEach(function() {
        runs(function() {
            test.portal_2 = new NodoPortalBidi("2");   
            spyOn(test.portal_2, 'recibirMensaje').andCallThrough();
            
            test.router_1.conectarCon(test.portal_2);
        });
    });
    it("El segundo portal deberia recibir asincronicamente un pedido de id y una respuesta del router al pedido de id del primer portal ", function() {
        runs(function() {
            expect(test.portal_1.recibirMensaje).not.toHaveBeenCalled();
            expect(test.portal_2.recibirMensaje).not.toHaveBeenCalled();
            expect(test.router_1.recibirMensaje).not.toHaveBeenCalled();
        });
    
        waits(0);        
        waitsFor(function() {
            return  test.portal_1.recibirMensaje.calls.length == 0 &&
                    test.router_1.recibirMensaje.calls.length == 1 &&
                    test.portal_2.recibirMensaje.calls.length == 2;                        
        }, "El segundo portal no recibio el pedido", 500);
        
        runs(function() {
            expect(test.router_1.recibirMensaje.calls[0].args[0].tipoDeMensaje).toEqual("Vortex.IdRemoto.Pedido");
            expect(test.portal_2.recibirMensaje.calls[0].args[0].tipoDeMensaje).toEqual("Vortex.IdRemoto.Pedido");
            expect(test.portal_2.recibirMensaje.calls[1].args[0].tipoDeMensaje).toEqual("Vortex.IdRemoto.Respuesta");
        });
    });
     
    describe("Conecto el router unidireccionalmente a un tercer portal formando una Y", function(){
        test.describe_1_1_1_1_1();
    });           
};

test.describe_1_1_1_1_1 = function(){
    beforeEach(function() {
        runs(function() {
            test.portal_3 = new NodoPortalBidi("3");   
            spyOn(test.portal_3, 'recibirMensaje').andCallThrough();
            
            test.router_1.conectarCon(test.portal_3);
        });
    });
    it("El tercer portal deberia recibir asincronicamente un pedido de id y una respuesta del router al pedido de id del primer portal ", function() {
        runs(function() {
            expect(test.portal_1.recibirMensaje).not.toHaveBeenCalled();
            expect(test.router_1.recibirMensaje).not.toHaveBeenCalled();                        
            expect(test.portal_2.recibirMensaje).not.toHaveBeenCalled();
            expect(test.portal_3.recibirMensaje).not.toHaveBeenCalled();
        });
    
        waits(0);        
        waitsFor(function() {
            return  test.portal_1.recibirMensaje.calls.length == 0 &&
                    test.router_1.recibirMensaje.calls.length == 1 &&
                    test.portal_2.recibirMensaje.calls.length == 2 &&                        
                    test.portal_3.recibirMensaje.calls.length == 2;                        
        }, "El tercer portal no recibio el pedido", 500);
        
        runs(function() {
            expect(test.router_1.recibirMensaje.calls[0].args[0].tipoDeMensaje).toEqual("Vortex.IdRemoto.Pedido");
            expect(test.portal_2.recibirMensaje.calls[0].args[0].tipoDeMensaje).toEqual("Vortex.IdRemoto.Pedido");
            expect(test.portal_2.recibirMensaje.calls[1].args[0].tipoDeMensaje).toEqual("Vortex.IdRemoto.Respuesta");
            expect(test.portal_3.recibirMensaje.calls[0].args[0].tipoDeMensaje).toEqual("Vortex.IdRemoto.Pedido");
            expect(test.portal_3.recibirMensaje.calls[1].args[0].tipoDeMensaje).toEqual("Vortex.IdRemoto.Respuesta");
        });
    });
    
    describe("El segundo portal pide mensajes del tipo 1", function(){                    
        test.describe_1_1_1_1_1_1();           
    });          
};

test.describe_1_1_1_1_1_1 = function(){
    beforeEach(function() {   
        runs(function() {
            test.mensaje_de_tipo_1_recibido_en_portal_2 = false;
            test.portal_2.pedirMensajes(test.filtro_de_mensajes_del_tipo_1, 
                               function(){test.mensaje_de_tipo_1_recibido_en_portal_2 = true;});   
        });
    });
    describe("El primer portal envia un mensaje del tipo 1", function(){ 
        test.describe_1_1_1_1_1_1_1();
    });    
    describe("El primer portal envia un mensaje del tipo 2", function(){ 
        test.describe_1_1_1_1_1_1_2();
    }); 
};

test.describe_1_1_1_1_1_1_1 = function(){
    beforeEach(function() {
        runs(function() {
            test.portal_1.enviarMensaje(test.mensaje_del_tipo_1);   
        });   
    });    
    
    it("El segundo y tercer portal deberian recibir asincronicamente el mensaje pero solo el segundo ejecutar callback", function() {
        waits(0);        
        waitsFor(function() {
            return  test.portal_1.recibirMensaje.calls.length == 0 &&
                    test.router_1.recibirMensaje.calls.length == 2 &&
                    test.portal_2.recibirMensaje.calls.length == 3 &&                        
                    test.portal_3.recibirMensaje.calls.length == 3 &&
                    test.mensaje_de_tipo_1_recibido_en_portal_2 == true;                       
        }, "No recibieron el mensaje", 500);
        
        runs(function() {                                    
            expect(test.router_1.recibirMensaje.calls[0].args[0].tipoDeMensaje).toEqual("Vortex.IdRemoto.Pedido");
            expect(test.portal_2.recibirMensaje.calls[0].args[0].tipoDeMensaje).toEqual("Vortex.IdRemoto.Pedido");
            expect(test.portal_2.recibirMensaje.calls[1].args[0].tipoDeMensaje).toEqual("Vortex.IdRemoto.Respuesta");
            expect(test.portal_2.recibirMensaje.calls[2].args[0].tipoDeMensaje).toEqual("1");
            expect(test.portal_3.recibirMensaje.calls[0].args[0].tipoDeMensaje).toEqual("Vortex.IdRemoto.Pedido");
            expect(test.portal_3.recibirMensaje.calls[1].args[0].tipoDeMensaje).toEqual("Vortex.IdRemoto.Respuesta");
            expect(test.portal_3.recibirMensaje.calls[2].args[0].tipoDeMensaje).toEqual("1");
        });
    });    
};

test.describe_1_1_1_1_1_1_2 = function(){
    beforeEach(function() {
        runs(function() {
            test.portal_1.enviarMensaje(test.mensaje_del_tipo_2);   
        });   
    });    
    
    it("El segundo y tercer portal deberian recibir asincronicamente el mensaje pero no ejecutarse el callback del primero", function() {
        waits(0);        
        waitsFor(function() {
            return  test.portal_1.recibirMensaje.calls.length == 0 &&
                    test.router_1.recibirMensaje.calls.length == 2 &&
                    test.portal_2.recibirMensaje.calls.length == 3 &&                        
                    test.portal_3.recibirMensaje.calls.length == 3;                         
        }, "No recibieron el mensaje", 500);
        waits(10);   
        runs(function() {                                    
            expect(test.router_1.recibirMensaje.calls[0].args[0].tipoDeMensaje).toEqual("Vortex.IdRemoto.Pedido");
            expect(test.portal_2.recibirMensaje.calls[0].args[0].tipoDeMensaje).toEqual("Vortex.IdRemoto.Pedido");
            expect(test.portal_2.recibirMensaje.calls[1].args[0].tipoDeMensaje).toEqual("Vortex.IdRemoto.Respuesta");
            expect(test.portal_2.recibirMensaje.calls[2].args[0].tipoDeMensaje).toEqual("2");
            expect(test.portal_3.recibirMensaje.calls[0].args[0].tipoDeMensaje).toEqual("Vortex.IdRemoto.Pedido");
            expect(test.portal_3.recibirMensaje.calls[1].args[0].tipoDeMensaje).toEqual("Vortex.IdRemoto.Respuesta");
            expect(test.portal_3.recibirMensaje.calls[2].args[0].tipoDeMensaje).toEqual("2");
            expect(test.mensaje_de_tipo_1_recibido_en_portal_2).toBeFalsy();
            
        });
    });    
};

test.describe_1_1_1_2 = function(){
    beforeEach(function() {
        runs(function() {
            test.portal_2 = new NodoPortalBidi("2");   
            spyOn(test.portal_2, 'recibirMensaje').andCallThrough();
            
            test.portal_2.conectarCon(test.router_1);
        });
    });
    it("El router deberia recibir asincronicamente un pedido de id del segundo portal", function() {    
        runs(function() {
            expect(test.portal_1.recibirMensaje).not.toHaveBeenCalled();                        
            expect(test.router_1.recibirMensaje).not.toHaveBeenCalled();
            expect(test.portal_2.recibirMensaje).not.toHaveBeenCalled();
        });
    
        waits(0);        
        waitsFor(function() {
            return  test.portal_1.recibirMensaje.calls.length == 0 &&
                    test.router_1.recibirMensaje.calls.length == 2 &&
                    test.portal_2.recibirMensaje.calls.length == 0;                        
        }, "El segundo portal no recibio el pedido", 500);
        
        runs(function() {
            expect(test.router_1.recibirMensaje.calls[0].args[0].tipoDeMensaje).toEqual("Vortex.IdRemoto.Pedido");
            expect(test.router_1.recibirMensaje.calls[1].args[0].tipoDeMensaje).toEqual("Vortex.IdRemoto.Pedido");
        });
    });      
};

test.describe_1_1_1_3 = function(){
    beforeEach(function() {     
        runs(function() {
            test.router_1.conectarCon(test.portal_1);
        });
    });
//    it("El portal le deberia enviar un pedido de id al router, " +
//       "al recibir el pedido, el router deberia enviar una respuesta, " +
//       "al recibir la respuesta, el portal deberia enviar una confirmacion, " +
//       "al recibir la confirmacion, el router deberia enviar una reConfirmacion", function() {     
//        runs(function() {
//            expect(test.portal_1.recibirMensaje).not.toHaveBeenCalled();                        
//            expect(test.router_1.recibirMensaje).not.toHaveBeenCalled();
//            expect(test.portal_1.conectadoBidireccionalmente()).toBeFalsy();
//            expect(test.router_1.conectadoBidireccionalmenteEnTodasSusPatas()).toBeFalsy();         
//        });
//    
//        waits(0);        
//        waitsFor(function() {
//            return  test.portal_1.recibirMensaje.calls.length == 4 &&
//                    test.router_1.recibirMensaje.calls.length == 4;                        
//        }, "No se mandaron los mensajes", 500);
//           
//        runs(function() {
//            expect(test.portal_1.recibirMensaje.calls[0].args[0].tipoDeMensaje).toEqual("Vortex.IdRemoto.Pedido");
//            expect(test.portal_1.recibirMensaje.calls[1].args[0].tipoDeMensaje).toEqual("Vortex.IdRemoto.Respuesta");
//            expect(test.portal_1.recibirMensaje.calls[2].args[0].tipoDeMensaje).toEqual("Vortex.IdRemoto.Confirmacion");
//            expect(test.portal_1.recibirMensaje.calls[3].args[0].tipoDeMensaje).toEqual("Vortex.IdRemoto.ReConfirmacion");
//            
//            expect(test.router_1.recibirMensaje.calls[0].args[0].tipoDeMensaje).toEqual("Vortex.IdRemoto.Pedido");
//            expect(test.router_1.recibirMensaje.calls[1].args[0].tipoDeMensaje).toEqual("Vortex.IdRemoto.Respuesta");
//            expect(test.router_1.recibirMensaje.calls[2].args[0].tipoDeMensaje).toEqual("Vortex.IdRemoto.Confirmacion");
//            expect(test.router_1.recibirMensaje.calls[3].args[0].tipoDeMensaje).toEqual("Vortex.IdRemoto.ReConfirmacion");
//            
//            expect(test.portal_1.conectadoBidireccionalmente()).toBeTruthy();
//            expect(test.router_1.conectadoBidireccionalmenteEnTodasSusPatas()).toBeTruthy();                        
//        });
//    });
    
    it("Al establecerse la conexion bidireccional el filtro de salida del portal deberia ser false, entonces, si el portal manda un mensaje el router no deberia recibirlo", function() {
        waits(0);        
        waitsFor(function() {
            return  test.portal_1.conectadoBidireccionalmente() &&
                    test.router_1.conectadoBidireccionalmenteEnTodasSusPatas();                        
        }, "No se establecio la conexion bidi", 500);
        
        runs(function() {
            expect(ComparadorDeFiltros.compararFiltros(test.portal_1.filtroDeSalida(), new FiltroFalse()));       
        });
        
        runs(function() {
            test.portal_1.enviarMensaje(test.mensaje_del_tipo_1);
        });      
        
        waits(100);        
        runs(function() {                    
            expect(Enumerable.From(test.router_1.recibirMensaje.calls)
                            .Any(function(llamada){
                                return llamada.args[0].tipoDeMensaje == test.mensaje_del_tipo_1.tipoDeMensaje;
                            })
                  ).toBeFalsy();
        });                    
    });       
     
    describe("El portal pide mensajes del tipo 1", function(){
        test.describe_1_1_1_3_1();
    }); 
    describe("Conecto un segundo router bidireccionalmente al primero y a este un segundo portal, el que pide mensajes del tipo 1 y el portal 1 envia", function(){
        test.describe_1_1_1_3_2();
    }); 
};

test.describe_1_1_1_3_1 = function(){
    beforeEach(function() {     
        runs(function() {
            test.mensaje_de_tipo_1_recibido_en_portal_1 = false;
            test.portal_1.pedirMensajes(test.filtro_de_mensajes_del_tipo_1, 
                                   function(){test.mensaje_de_tipo_1_recibido_en_portal_1 = true;});  
        });
    });
    it("El portal debería esperar a que se establezca la conexion bidireccional antes de enviar el filtro", function() {
        waits(0);        
        waitsFor(function() {
            return  test.portal_1.recibirMensaje.calls.length == 4 &&
                    test.router_1.recibirMensaje.calls.length == 5;                        
        }, "No se mandaron los mensajes", 500);
        
        runs(function() {
            expect(test.portal_1.recibirMensaje.calls[0].args[0].tipoDeMensaje).toEqual("Vortex.IdRemoto.Pedido");
            expect(test.portal_1.recibirMensaje.calls[1].args[0].tipoDeMensaje).toEqual("Vortex.IdRemoto.Respuesta");
            expect(test.portal_1.recibirMensaje.calls[2].args[0].tipoDeMensaje).toEqual("Vortex.IdRemoto.Confirmacion");
            expect(test.portal_1.recibirMensaje.calls[3].args[0].tipoDeMensaje).toEqual("Vortex.IdRemoto.ReConfirmacion");
            
            expect(test.router_1.recibirMensaje.calls[0].args[0].tipoDeMensaje).toEqual("Vortex.IdRemoto.Pedido");
            expect(test.router_1.recibirMensaje.calls[1].args[0].tipoDeMensaje).toEqual("Vortex.IdRemoto.Respuesta");
            expect(test.router_1.recibirMensaje.calls[2].args[0].tipoDeMensaje).toEqual("Vortex.IdRemoto.Confirmacion");
            expect(test.router_1.recibirMensaje.calls[3].args[0].tipoDeMensaje).toEqual("Vortex.IdRemoto.ReConfirmacion");
            expect(test.router_1.recibirMensaje.calls[4].args[0].tipoDeMensaje).toEqual("Vortex.Filtro.Publicacion");
            
            expect(test.portal_1.conectadoBidireccionalmente()).toBeTruthy();
            expect(test.router_1.conectadoBidireccionalmenteEnTodasSusPatas()).toBeTruthy();                        
        });
    });  
    it("El portal no deberia recibir una publicacion de filtro", function() {
        waits(100);        
        runs(function() {
            expect(Enumerable.From(test.portal_1.recibirMensaje.calls)
                .Any(function(llamada){
                        return llamada.args[0].tipoDeMensaje == "Vortex.Filtro.Publicacion";
                    })).toBeFalsy();                     
        });
    });  
    describe("Espero a que llegue el pedido al router", function(){
        test.describe_1_1_1_3_1_1();
    }); 
};

test.describe_1_1_1_3_1_1 = function(){
    beforeEach(function() {      
        runs(function() {
            test.router_1.recibirMensaje.calls = [];
            esperarAQueLlegueMensajeEn(test.router_1, "Vortex.Filtro.Publicacion", "No llego el filtro");  
        });    
    });
    describe("Envio un mensaje de tipo 1 desde el portal", function(){
        test.describe_1_1_1_3_1_1_1();
    }); 
};

test.describe_1_1_1_3_1_1_1 = function(){
    beforeEach(function() {      
        runs(function() {
            test.portal_1.enviarMensaje(test.mensaje_del_tipo_1);   
        });    
    });
    it("El router no deberia recibir el mensaje", function() {
        waits(100);        
        runs(function() {
            expect(Enumerable.From(test.router_1.recibirMensaje.calls)
                .Any(function(llamada){
                        return llamada.args[0].tipoDeMensaje == "1";
                    })).toBeFalsy();                     
        });
    });  
    it("El portal no deberia ejecutar el callback", function() {
        waits(100);        
        runs(function() {
            expect(test.mensaje_de_tipo_1_recibido_en_portal_1).toBeFalsy();                     
        });
    }); 
    describe("Conecto un segundo portal bidireccionalmente al router", function(){
        test.describe_1_1_1_3_1_1_1_1();
    }); 
};

test.describe_1_1_1_3_1_1_1_1 = function(){
    beforeEach(function() {      
        runs(function() {
            test.portal_2 = new NodoPortalBidi("2");   
            spyOn(test.portal_2, 'recibirMensaje').andCallThrough();
            
            test.portal_2.conectarCon(test.router_1);
            test.router_1.conectarCon(test.portal_2);
            test.router_1.recibirMensaje.calls = [];
        });    
    });
    it("El router y el portal 2 no deberian estar conectados bidireccionalmente en sus patas, el portal 1 si", function() {
        runs(function() {
            expect(test.portal_2.recibirMensaje).not.toHaveBeenCalled();  
            expect(test.portal_2.conectadoBidireccionalmente()).toBeFalsy();
            expect(test.portal_1.conectadoBidireccionalmente()).toBeTruthy();
            expect(test.router_1.conectadoBidireccionalmenteEnTodasSusPatas()).toBeFalsy();         
        });
    }); 
    
    describe("Espero a que se establezca la conexion bidireccional", function() {
       test.describe_1_1_1_3_1_1_1_1_1();
    });                    
};

test.describe_1_1_1_3_1_1_1_1_1 = function(){
    beforeEach(function() {    
        waits(0);        
        waitsFor(function() {   
            return  test.portal_2.conectadoBidireccionalmente() &&
                    test.router_1.conectadoBidireccionalmenteEnTodasSusPatas();
        });
    });        
    it("El portal 2 deberia recibir una publicacion de filtros y su filtro de salida dejar pasar los mensajes del tipo 1", function() {        
        esperarAQueLlegueMensajeEn(test.portal_2, "Vortex.Filtro.Publicacion", "No llego el filtro");         
        runs(function() {
            expect(test.portal_2.filtroDeSalida().evaluarMensaje({tipoDeMensaje:'1'})).toBeTruthy();          
        });
    });      
    describe("Espero a que llegue el filtro del portal 1 al portal 2", function() {
       test.describe_1_1_1_3_1_1_1_1_1_1();
    });   
};

test.describe_1_1_1_3_1_1_1_1_1_1 = function(){
    beforeEach(function() {    
        waits(0);        
        waitsFor(function() {   
            return  test.portal_2.filtroDeSalida().evaluarMensaje({tipoDeMensaje:'1'});
        });
    });        
    describe("Envio un mensaje de tipo 1 desde el portal 2", function() {
       test.describe_1_1_1_3_1_1_1_1_1_1_1();
    });  
};

test.describe_1_1_1_3_1_1_1_1_1_1_1 = function(){
    beforeEach(function() {    
        runs(function() {
            test.mensaje_de_tipo_1_recibido_en_portal_1 = false;
            test.portal_2.enviarMensaje({tipoDeMensaje:'1'});   
        }); 
    });    
    it("El portal 1 deberia ejecutar el callback", function() {
        waits(20);        
        runs(function() {
            expect(test.mensaje_de_tipo_1_recibido_en_portal_1).toBeTruthy();                     
        });
    }); 
    describe("El portal 2 pide mensajes del tipo 1", function(){
        test.describe_1_1_1_3_1_1_1_1_1_1_1_1();
    });   
};

test.describe_1_1_1_3_1_1_1_1_1_1_1_1 = function(){
    beforeEach(function() {     
        runs(function() {
            test.mensaje_de_tipo_1_recibido_en_portal_2 = false;
            test.portal_2.pedirMensajes(test.filtro_de_mensajes_del_tipo_1, 
                                   function(){test.mensaje_de_tipo_1_recibido_en_portal_2 = true;});  
        });
    });

    it("El portal 1 deberia recibir una publicacion de filtros y su filtro de salida dejar pasar los mensajes del tipo 1", function() {
        waits(50);
        runs(function() {
            expect(test.portal_1.filtroDeSalida().evaluarMensaje({tipoDeMensaje:'1'})).toBeTruthy();          
        });
    });  
    describe("Espero a que llegue el filtro del portal 2 al portal 1", function() {
       test.describe_1_1_1_3_1_1_1_1_1_1_1_1_1();
    }); 
};

test.describe_1_1_1_3_1_1_1_1_1_1_1_1_1 = function(){
    beforeEach(function() {    
        waits(0);        
        waitsFor(function() {   
            return  test.portal_1.filtroDeSalida().evaluarMensaje({tipoDeMensaje:'1'});
        });
        waits(20);
    });        
    describe("Envio un mensaje de tipo 1 desde el portal 1", function() {
       test.describe_1_1_1_3_1_1_1_1_1_1_1_1_1_1();
    });  
    
    describe("Vuelvo a enviar un mensaje de tipo 1 desde el portal 2", function() {
       test.describe_1_1_1_3_1_1_1_1_1_1_1_1_1_2();
    });  
};

test.describe_1_1_1_3_1_1_1_1_1_1_1_1_1_1 = function(){
    beforeEach(function() {    
        runs(function() {
            test.mensaje_de_tipo_1_recibido_en_portal_1 = false;
            test.mensaje_de_tipo_1_recibido_en_portal_2 = false;
            test.portal_1.enviarMensaje({tipoDeMensaje:'1'});   
            test.portal_1.recibirMensaje.calls = [];
        }); 
    });    
    it("El portal 2 deberia recibir el mensaje y ejecutar el callback", function() { 
        esperarAQueLlegueMensajeEn(test.portal_2, "1", "No llego el mensaje"); 
        runs(function() {                   
            expect(test.mensaje_de_tipo_1_recibido_en_portal_2).toBeTruthy();                     
        });
    }); 
    it("El portal 1 no deberia ejecutar el callback (no deberia recibir sus propios mensajes)", function() {
        waits(50);        
        runs(function() {
            expect(test.mensaje_de_tipo_1_recibido_en_portal_1).toBeFalsy();                     
        });
    });  
 describe("Conecto un tercer portal bidireccionalmente al router", function(){
        test.describe_1_1_1_3_1_1_1_1_1_1_1_1_1_1_1();
    });  
};

test.describe_1_1_1_3_1_1_1_1_1_1_1_1_1_1_1 = function(){
    beforeEach(function() {    
        waits(100);
        runs(function() {
            test.portal_3 = new NodoPortalBidi("3");   
            spyOn(test.portal_3, 'recibirMensaje').andCallThrough();
            
            test.portal_3.conectarCon(test.router_1);
            test.router_1.conectarCon(test.portal_3);
            test.portal_3.recibirMensaje.calls = [];
        });    
    });
    it("El router y el portal 3 no deberian estar conectados bidireccionalmente en sus patas, el portal 1 y el 2 si", function() {
        runs(function() {
            expect(test.portal_3.conectadoBidireccionalmente()).toBeFalsy();
            expect(test.portal_2.conectadoBidireccionalmente()).toBeTruthy();
            expect(test.portal_1.conectadoBidireccionalmente()).toBeTruthy();
            expect(test.router_1.conectadoBidireccionalmenteEnTodasSusPatas()).toBeFalsy();         
        });
    }); 
    
    describe("Espero a que se establezca la conexion bidireccional", function() {
       test.describe_1_1_1_3_1_1_1_1_1_1_1_1_1_1_1_1();
    });                    
};

test.describe_1_1_1_3_1_1_1_1_1_1_1_1_1_1_1_1 = function(){
    beforeEach(function() {    
        waits(0);        
        waitsFor(function() {   
            return  test.portal_3.conectadoBidireccionalmente() &&
                    test.router_1.conectadoBidireccionalmenteEnTodasSusPatas();
        });
    });        
    it("El portal 3 deberia recibir una publicacion de filtros y su filtro de salida dejar pasar los mensajes del tipo 1", function() {       
        esperarAQueLlegueMensajeEn(test.portal_3, "Vortex.Filtro.Publicacion", "No llego el filtro"); 
        
        runs(function() {
            expect(test.portal_3.filtroDeSalida().evaluarMensaje({tipoDeMensaje:'1'})).toBeTruthy();          
        });
    });  
    describe("Espero a que llegue el filtro de mensajes de tipo 1 al portal 3", function() {
       test.describe_1_1_1_3_1_1_1_1_1_1_1_1_1_1_1_1_1();
    });     
};

test.describe_1_1_1_3_1_1_1_1_1_1_1_1_1_1_1_1_1 = function(){
    beforeEach(function() {    
        waits(0);        
        waitsFor(function() {   
            return  test.portal_3.filtroDeSalida().evaluarMensaje({tipoDeMensaje:'1'});
        });
    });        
    describe("Envio un mensaje de tipo 1 desde el portal 3", function() {
       test.describe_1_1_1_3_1_1_1_1_1_1_1_1_1_1_1_1_1_1();
    });   
};

test.describe_1_1_1_3_1_1_1_1_1_1_1_1_1_1_1_1_1_1 = function(){
    beforeEach(function() {    
        runs(function() {
            test.mensaje_de_tipo_1_recibido_en_portal_1 = false;
            test.mensaje_de_tipo_1_recibido_en_portal_2 = false;
            test.portal_3.enviarMensaje({tipoDeMensaje:'1'});   
            test.portal_3.recibirMensaje.calls = []
        }); 
    });    
    it("El portal 1 y 2 deberian ejecutar el callback", function() {
        waits(0); 
        waitsFor(function() {   
            return  test.mensaje_de_tipo_1_recibido_en_portal_1 &&
                    test.mensaje_de_tipo_1_recibido_en_portal_2;
        });
    }); 
    it("El portal 3 no deberia recibir sus propios mensajes", function() {
        runs(function() {
            expect(Enumerable.From(test.portal_3.recibirMensaje.calls)
                .Any(function(llamada){
                        return llamada.args[0].tipoDeMensaje == "1";
                    })).toBeFalsy();                     
        });
        waits(50);        
        runs(function() {
            expect(Enumerable.From(test.portal_3.recibirMensaje.calls)
                .Any(function(llamada){
                        return llamada.args[0].tipoDeMensaje == "1";
                    })).toBeFalsy();                     
        });
    });  
};

test.describe_1_1_1_3_1_1_1_1_1_1_1_1_1_2 = function(){
    beforeEach(function() {    
        runs(function() {
            test.mensaje_de_tipo_1_recibido_en_portal_1 = false;
            test.mensaje_de_tipo_1_recibido_en_portal_2 = false;
            test.portal_2.enviarMensaje({tipoDeMensaje:'1'});   
        }); 
    });    
    it("El portal 1 deberia ejecutar el callback", function() {
        waits(20); 
        runs(function() {                   
            expect(test.mensaje_de_tipo_1_recibido_en_portal_1).toBeTruthy();                     
        });
    }); 
    it("El portal 2 no deberia ejecutar el callback (no deberia recibir sus propios mensajes)", function() {
        waits(50);        
        runs(function() {
            expect(Enumerable.From(test.portal_2.recibirMensaje.calls)
                .Any(function(llamada){
                        return llamada.args[0].tipoDeMensaje == "1";
                    })).toBeFalsy();                     
        });
    });  
};

test.describe_1_1_1_3_2 = function(){
    beforeEach(function() {      
        runs(function() {            
            test.router_2 = new NodoRouter("2");   
            test.portal_2 = new NodoPortalBidi("2");
            
            test.mensaje_de_tipo_1_recibido_en_portal_2 = false;
            test.portal_2.pedirMensajes(test.filtro_de_mensajes_del_tipo_1, 
                                   function(){test.mensaje_de_tipo_1_recibido_en_portal_2 = true;});  
            
            test.router_1.conectarBidireccionalmenteCon(test.router_2);
            test.router_2.conectarBidireccionalmenteCon(test.portal_2);
            
            spyOn(test.router_2, 'recibirMensaje').andCallThrough();
            spyOn(test.portal_2, 'recibirMensaje').andCallThrough();
        });    
        waits(100);
        runs(function() {              
            test.portal_1.enviarMensaje({tipoDeMensaje:'1'});   
        });
        waits(50);
    });
    it("El portal 2 deberia hacer recibido el mensaje", function() {
        runs(function() {
            expect(test.mensaje_de_tipo_1_recibido_en_portal_2).toBeTruthy();         
        });
    });                    
};

test.describe_1();


describe("Filtros", function() {
    var un_filtro_desconocido;
    var un_filtro_true;
    var un_filtro_false;
    var un_filtro_por_clave1_valor1;
    var un_filtro_por_clave2_valor2;
    var un_des_serializador;
    
    beforeEach(function() {
        un_filtro_desconocido = new FiltroDesconocido();
        un_filtro_true = new FiltroTrue();
        un_filtro_false = new FiltroFalse();
        un_filtro_por_clave1_valor1 = new FiltroXClaveValor('Clave1', 'Valor1');
        un_filtro_por_clave2_valor2 = new FiltroXClaveValor('Clave2', 'Valor2');
    
    });
    
    it("1 - La AND de un filtro desconocido y uno true deberia devolver undefined", function() {
        var resultado = new FiltroAND([un_filtro_true, un_filtro_desconocido]).evaluarMensaje("fruta");
        expect(resultado).toEqual(undefined);
    });

    it("2 - La AND de un filtro desconocido y uno false deberia devolver false", function() {
        var resultado = new FiltroAND([un_filtro_false, un_filtro_desconocido]).evaluarMensaje("fruta");
        expect(resultado).toEqual(false);
    });
    
    it("3 - La OR de un filtro desconocido y uno false deberia devolver undefined", function() {
        var resultado = new FiltroOR([un_filtro_false, un_filtro_desconocido]).evaluarMensaje("fruta");
        expect(resultado).toEqual(undefined);
    });

    it("4 - La OR de un filtro desconocido y uno true deberia devolver true", function() {
        var resultado = new FiltroOR([un_filtro_true, un_filtro_desconocido]).evaluarMensaje("fruta");
        expect(resultado).toEqual(true);
    });
    
    it("5 - Al serializar y desserializar un filtro deberia seguir comportandose igual", function() {
        var filtroSerializado = un_filtro_por_clave1_valor1.serializar();
        var filtroDesSerializado = DesSerializadorDeFiltros.desSerializarFiltro(filtroSerializado);
        
        expect(un_filtro_por_clave1_valor1.evaluarMensaje({'Clave1':'Valor1'})).toEqual(true);
        expect(un_filtro_por_clave1_valor1.evaluarMensaje({'Clave2':'Valor2'})).toEqual(false);
        expect(filtroDesSerializado.evaluarMensaje({'Clave1':'Valor1'})).toEqual(true);
        expect(filtroDesSerializado.evaluarMensaje({'Clave2':'Valor2'})).toEqual(false);
    });
    
    it("6 - Si simplifico una AND de un solo filtro deberia quedarme el filtro de adentro de la AND como resultado", function() {
        var filtro_1 = new FiltroXClaveValor("clave1", 1);
        var filtro_and_1 = new FiltroAND([filtro_1]);
        
        expect(ComparadorDeFiltros.compararFiltros(filtro_and_1.simplificar(), filtro_1));
    });
    
    it("7 - Si simplifico una OR de un solo filtro deberia quedarme el filtro de adentro de la OR como resultado", function() {
        var filtro_1 = new FiltroXClaveValor("clave1", 1);
        var filtro_or_1 = new FiltroOR([filtro_1]);
        
        expect(ComparadorDeFiltros.compararFiltros(filtro_or_1.simplificar(), filtro_1));
    });
    it("8 - Si en un filtro AND pongo otro filtro AND y simplifico el primero deberian quedar los filtros del segundo al mismo nivel que los del primero", function() {
        var filtro_1 = new FiltroXClaveValor("clave1", 1);
        var filtro_2 = new FiltroXClaveValor("clave2", 2);
        var filtro_3 = new FiltroXClaveValor("clave3", 3);
        
        var filtro_and_2 = new FiltroAND([filtro_1, filtro_2]);
        var filtro_and_1 = new FiltroAND([filtro_and_2, filtro_3]);
        
        expect(filtro_and_1.simplificar().filtros.length).toEqual(3);
    });
});