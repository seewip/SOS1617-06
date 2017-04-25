/*global browser*/
/*global expect*/
/*global gdp*/
/*global element*/
/*global by*/

describe('Resources is loaded', function(){
    it('should show a bunch of data',function(){//en el it describimos que debe pasar 
       //TO DO--->Tengo que cambiarlo para heroku
        browser.get('http://sos1617-06.herokuapp.com');//El puerto es 8080 ya que estoy lanzando el navegador fantasma sobre lo que está en c9
        //me devuelve toda la lista de reccursos que hay.
        var dataUnit = element.all(by.repeater('dataUnit in data'));//genera un array seleccionando todos los elementos de la pagina renderizada(element.all), seleccionando por una directiva (by.repeater) 
        //El tamaño del array debe ser mayor que x:
        expect(dataUnit.count()).toBeGreaterThan(4);
        
    });
    
});