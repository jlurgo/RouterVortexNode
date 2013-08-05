$(function () { 
    var clienteHTTP = new NodoClienteHTTP('http://localhost:8888', 10);   
    var portal = new NodoPortalBidi("portal");
    portal.conectarCon(clienteHTTP);
    clienteHTTP.conectarCon(portal);
});