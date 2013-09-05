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
        
        expect(ComparadorDeFiltros.compararFiltros(filtro_and_1.simplificar(), filtro_1)).toBeTruthy();
    });
    
    it("7 - Si simplifico una OR de un solo filtro deberia quedarme el filtro de adentro de la OR como resultado", function() {
        var filtro_1 = new FiltroXClaveValor("clave1", 1);
        var filtro_or_1 = new FiltroOR([filtro_1]);
        
        expect(ComparadorDeFiltros.compararFiltros(filtro_or_1.simplificar(), filtro_1)).toBeTruthy();
    });
    it("8 - Si en un filtro AND pongo otro filtro AND y simplifico el primero deberian quedar los filtros del segundo al mismo nivel que los del primero", function() {
        var filtro_1 = new FiltroXClaveValor("clave1", 1);
        var filtro_2 = new FiltroXClaveValor("clave2", 2);
        var filtro_3 = new FiltroXClaveValor("clave3", 3);
        
        var filtro_and_2 = new FiltroAND([filtro_1, filtro_2]);
        var filtro_and_1 = new FiltroAND([filtro_and_2, filtro_3]);
        
        expect(filtro_and_1.simplificar().filtros.length).toEqual(3);
    });
    
    it("9 - Si simplifico una AND vacia deberia quedarme un filtro FALSE como resultado", function() {
        var filtro_and_1 = new FiltroAND([]);        
        expect(ComparadorDeFiltros.compararFiltros(filtro_and_1.simplificar(), un_filtro_false)).toBeTruthy();
    });
    
    it("10 - Si simplifico una OR vacia deberia quedarme un filtro FALSE como resultado", function() {
        var filtro_or_1 = new FiltroOR([]);        
        expect(ComparadorDeFiltros.compararFiltros(filtro_or_1.simplificar(), un_filtro_false)).toBeTruthy();
    });
});