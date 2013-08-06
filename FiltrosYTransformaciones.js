/*
Vortex by Vortex Group is licensed under a Creative Commons Reconocimiento 3.0 Unported License.
To view a copy of this licence, visit: http://creativecommons.org/licenses/by/3.0/
Project URL: https://sourceforge.net/p/vortexnet
*/

var DesSerializadorDeFiltros = {
	desSerializarFiltro : function(un_filtro_serializado){
        var filtro;
		switch(un_filtro_serializado.tipo)
		{
			case 'EQ':
				filtro =  new FiltroXClaveValor();
				break;
			case 'AND':
				filtro =  new FiltroAND();
				break;
            case 'OR':
				filtro =  new FiltroOR();
				break;
			case 'TRUE':
				filtro =  new FiltroTrue();
				break;
            case 'FALSE':
				filtro =  new FiltroFalse();
				break;
			default:
				filtro =  new FiltroDesconocido();
		}
		filtro.desSerializar(un_filtro_serializado);
		return filtro;
	}
};
if(typeof(require) != "undefined"){
    exports.DesSerializadorDeFiltros = DesSerializadorDeFiltros;
}

var FiltroXClaveValor = function (clave, valor) {
	this._clave = clave;
	this._valor = valor;
};
FiltroXClaveValor.prototype = {
    evaluarMensaje : function (un_mensaje) {
        return un_mensaje[this._clave] == this._valor;
    },
	serializar : function(){
		return {'tipo': 'EQ',
				'clave': this._clave, 
				'valor': this._valor};
	},
	desSerializar : function(un_filtro_serializado){
		this._clave = un_filtro_serializado.clave; 
		this._valor = un_filtro_serializado.valor; 
	},
    simplificar: function(){return this;}
};
if(typeof(require) != "undefined"){ exports.FiltroXClaveValor = FiltroXClaveValor;}

var DesSerializadorDeTrafos = {
	desSerializarTrafo : function(una_trafo_serializada){
        var trafo;
		switch(una_trafo_serializada.tipo)
		{
			case 'COMP':
				trafo =  new TrafoCompuesta();
				break;
			case 'KEYVALUE':
				trafo =  new TrafoXClaveValor();
				break;
		}
		trafo.desSerializar(una_trafo_serializada);
		return trafo;
	}
};
if(typeof(require) != "undefined"){ exports.DesSerializadorDeTrafos = DesSerializadorDeTrafos;}

var TrafoXClaveValor = function (clave, valor) {
	this.clave = clave;
	this.valor = valor;
};
TrafoXClaveValor.prototype = {
    transformarMensaje : function (un_mensaje) {
    	un_mensaje[this.clave] = this.valor;
        return un_mensaje;
    },
    serializar : function(){
		return {	tipo: 'KEYVALUE',
					clave: this.clave,
                    valor: this.valor};
	},	
	desSerializar : function(una_trafo_serializada){
        this.clave = una_trafo_serializada.clave; 
		this.valor = una_trafo_serializada.valor; 
	}
};
if(typeof(require) != "undefined"){ exports.TrafoXClaveValor = TrafoXClaveValor;}

var TrafoCompuesta = function(trafos){
    this.trafos = (trafos === undefined)? [] : trafos;
};
TrafoCompuesta.prototype = {
    transformarMensaje : function (un_mensaje) {
        for(var i=0; i<this.trafos.length; i++){
			this.trafos[i].transformarMensaje(un_mensaje);
		}
        return un_mensaje;
    },
    serializar : function(){
		var ret = {	tipo: 'COMP',
					trafos: []};
		for(var i=0; i<this.trafos.length; i++){
			ret.trafos.push(this.trafos[i].serializar());
		}		
		return ret;
	},	
	desSerializar : function(una_trafo_serializada){
		for(var i=0; i<una_trafo_serializada.trafos.length; i++){
			this.trafos.push(DesSerializadorDeTrafos.desSerializarTrafo(una_trafo_serializada.trafos[i]));
		}
	}
};
if(typeof(require) != "undefined"){ exports.TrafoCompuesta = TrafoCompuesta;}

var FiltroAND = function (_filtros) {
	this.filtros = (_filtros === undefined)? [] : _filtros;
};
FiltroAND.prototype = {
    evaluarMensaje : function (un_mensaje) {
        var valorRetorno = true;
		for(var i=0; i<this.filtros.length; i++){
			var evaluacion = this.filtros[i].evaluarMensaje(un_mensaje);
			if (evaluacion == false) { 
				return false;
			}
			if (evaluacion === undefined) { 
				valorRetorno = undefined;
			}
		}
        return valorRetorno;
    },        
	serializar: function(){
		var ret = {	'tipo': 'AND',
					'filtros': []};
		for(var i=0; i<this.filtros.length; i++){
			ret.filtros.push(this.filtros[i].serializar());
		}		
		return ret;
	},	
	desSerializar: function(un_filtro_serializado){
		for(var i=0; i<un_filtro_serializado.filtros.length; i++){
			this.filtros.push(DesSerializadorDeFiltros.desSerializarFiltro(un_filtro_serializado.filtros[i]));
		}
	},
    simplificar: function(){
        var filtros_acumulados_simplificados = [];
        for(var i=0; i<this.filtros.length; i++){
			if(this.filtros[i] instanceof FiltroAND){
                for(var j=0; j<this.filtros[i].filtros.length; j++){
                    filtros_acumulados_simplificados.push(this.filtros[i].filtros[j].simplificar());
                }
            }else{
                filtros_acumulados_simplificados.push(this.filtros[i].simplificar());
            }
		}
        var filtros_sin_true = [];
        for(var i=0; i<filtros_acumulados_simplificados.length; i++){
            if(filtros_acumulados_simplificados[i] instanceof FiltroFalse) return filtros_acumulados_simplificados[i]; 
            if(!(filtros_acumulados_simplificados[i] instanceof FiltroTrue)) filtros_sin_true.push(filtros_acumulados_simplificados[i]); 
        }
        if(filtros_sin_true.length==1) return filtros_sin_true[0];
        if(filtros_sin_true.length==0) return new FiltroFalse;
        return new FiltroAND(filtros_sin_true);
    }
};
if(typeof(require) != "undefined"){ exports.FiltroAND = FiltroAND;}

var FiltroOR = function (_filtros) {
	this.filtros = (_filtros === undefined)? [] : _filtros;
};
FiltroOR.prototype = {    
    evaluarMensaje : function (un_mensaje) {
        var valorRetorno = false;
		for(var i=0; i<this.filtros.length; i++){
			var evaluacion = this.filtros[i].evaluarMensaje(un_mensaje);
			if (evaluacion == true) { 
				return true;
			}
			if (evaluacion === undefined) { 
				valorRetorno = undefined;
			}
		}
        return valorRetorno;
    },
	serializar: function(){
		var ret = {	'tipo': 'OR',
					'filtros': []};
		for(var i=0; i<this.filtros.length; i++){
			ret.filtros.push(this.filtros[i].serializar());
		}		
		return ret;
	},	
	desSerializar: function(un_filtro_serializado){
		for(var i=0; i<un_filtro_serializado.filtros.length; i++){
			this.filtros.push(DesSerializadorDeFiltros.desSerializarFiltro(un_filtro_serializado.filtros[i]));
		}
	},
    simplificar: function(){
        var filtros_acumulados_simplificados = [];
        for(var i=0; i<this.filtros.length; i++){
			if(this.filtros[i] instanceof FiltroOR){
                for(var j=0; j<this.filtros[i].filtros.length; j++){
                    filtros_acumulados_simplificados.push(this.filtros[i].filtros[j].simplificar());
                }
            }else{
                filtros_acumulados_simplificados.push(this.filtros[i].simplificar());
            }
		}
        var filtros_sin_false = [];
        for(var i=0; i<filtros_acumulados_simplificados.length; i++){
            if(filtros_acumulados_simplificados[i] instanceof FiltroTrue) return filtros_acumulados_simplificados[i]; 
            if(!(filtros_acumulados_simplificados[i] instanceof FiltroFalse)) filtros_sin_false.push(filtros_acumulados_simplificados[i]); 
        }
        if(filtros_sin_false.length==1) return filtros_sin_false[0];
        if(filtros_sin_false.length==0) return new FiltroTrue;
        return new FiltroOR(filtros_sin_false);
    }
};
if(typeof(require) != "undefined"){ exports.FiltroOR = FiltroOR;}

var FiltroDesconocido = function(){
};
FiltroDesconocido.prototype = {
	evaluarMensaje : function (un_mensaje) {
        return undefined;
    },    
    onChange : function(observador){
        this._observador = observador;
    },    
    serializar : function(){
		var ret = {	'tipo': '?'};
		return ret;
	},	
	desSerializar : function(un_filtro_serializado){
	},
    simplificar: function(){return this;}
};
if(typeof(require) != "undefined"){ exports.FiltroDesconocido = FiltroDesconocido;}

var FiltroTrue = function(){
};
FiltroTrue.prototype = {
	evaluarMensaje : function (un_mensaje) {
        return true;
    },    
    onChange : function(observador){
        this._observador = observador;
    },    
    serializar : function(){
		var ret = {	'tipo': 'TRUE'};
		return ret;
	},	
	desSerializar : function(un_filtro_serializado){
	},
    simplificar: function(){return this;}
};
if(typeof(require) != "undefined"){ exports.FiltroTrue = FiltroTrue;}

var ComparadorDeFiltros = {
    compararFiltros : function(filtro1, filtro2){
        if(filtro1 === undefined || filtro2 === undefined) return false;
        return JSON.stringify(filtro1.serializar()) == JSON.stringify( filtro2.serializar());
    }
};
if(typeof(require) != "undefined"){ exports.ComparadorDeFiltros = ComparadorDeFiltros;}

var FiltroFalse = function(){
};
FiltroFalse.prototype = {
	evaluarMensaje : function (un_mensaje) {
        return false;
    },    
    onChange : function(observador){
        this._observador = observador;
    },    
    serializar : function(){
		var ret = {	'tipo': 'FALSE'};
		return ret;
	},	
	desSerializar :function(un_filtro_serializado){
	},
    simplificar: function(){return this;}
};
if(typeof(require) != "undefined"){ exports.FiltroFalse = FiltroFalse;}
