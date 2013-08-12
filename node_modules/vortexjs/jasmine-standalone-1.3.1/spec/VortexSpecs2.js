/*
Vortex by Vortex Group is licensed under a Creative Commons Reconocimiento 3.0 Unported License.
To view a copy of this licence, visit: http://creativecommons.org/licenses/by/3.0/
Project URL: https://sourceforge.net/p/vortexnet
*/

var test = {}

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
        describe("Tengo un router con 2 portales conectados bidireccionalmente", function(){
            test.describe_1_1();
        }); 
    });
};

test.describe_1_1 = function(){
    beforeEach(function() {
        runs(function() { 
            test.router_1 = new NodoRouter("1");   
            test.portal_1 = new NodoPortalBidi("1"); 
            test.portal_2 = new NodoPortalBidi("2"); 
            test.router_1.conectarBidireccionalmenteCon(test.portal_1);
            test.router_1.conectarBidireccionalmenteCon(test.portal_2);
        });
    });
    
    describe("Al router le conecto bidireccionalmente una cadena de 3 routers y al ultimo un tercer portal", function(){
        test.describe_1_1_1();
    });
};

test.describe_1_1_1 = function(){
    beforeEach(function() {
        runs(function() { 
            test.router_2 = new NodoRouter("2");   
            test.router_3 = new NodoRouter("3");   
            test.router_4 = new NodoRouter("4");   
            test.portal_3 = new NodoPortalBidi("3"); 
            test.router_2.conectarBidireccionalmenteCon(test.router_1);
            test.router_3.conectarBidireccionalmenteCon(test.router_2);
            test.router_4.conectarBidireccionalmenteCon(test.router_3);
            test.router_4.conectarBidireccionalmenteCon(test.portal_3);
        });
    });
    
    describe("El portal 1 pide mensajes de tipo 1", function(){
        test.describe_1_1_1_1();
    });     
};

test.describe_1_1_1_1 = function(){
    beforeEach(function() {
        runs(function() { 
            test.mensaje_de_tipo_1_recibido_en_portal_1 = false;
            test.portal_1.pedirMensajes(test.filtro_de_mensajes_del_tipo_1, function(){test.mensaje_de_tipo_1_recibido_en_portal_1 = true;})
        });
    });
    
    describe("El portal 2 envia un mensaje del tipo 1", function(){
        test.describe_1_1_1_1_1();
    });    
    
    describe("El portal 3 envia un mensaje del tipo 1", function(){
        test.describe_1_1_1_1_2();
    }); 
};

test.describe_1_1_1_1_1 = function(){
    beforeEach(function() {
        waits(80);
        runs(function() { 
            test.portal_2.enviarMensaje({tipoDeMensaje : "1"});
        });
        waits(40);
    });
    
    it("El portal 1 deberia haber recibido el mensaje", function() {
        runs(function() { 
            expect(test.mensaje_de_tipo_1_recibido_en_portal_1).toBeTruthy(); 
        });
    });     
};

test.describe_1_1_1_1_2 = function(){
    beforeEach(function() {
        waits(80);
        runs(function() { 
            test.portal_3.enviarMensaje({tipoDeMensaje : "1"});
        });
        waits(40);
    });
    
    it("El portal 1 deberia haber recibido el mensaje", function() {
        runs(function() { 
            expect(test.mensaje_de_tipo_1_recibido_en_portal_1).toBeTruthy(); 
        });
    });     
};
test.describe_1();