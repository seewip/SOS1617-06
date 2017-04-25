/*global browser*/
/*global element*/
/*global by*/
/*global expect*/
/*global dataUnit*/
/*global data*/
/*global initialdata*/

describe('Add dataUnit',function(){
    it('should add a dataUnit',function(){
        browser.get('http//localhost:8080');
        
        element.all(by.repeater(dataUnit in data))
        .then(function(initialdata){
            
            
           element(by.model('data.country')).sendKeys('Spain');
           element(by.model('data.year')).sendKeys('2013');
           element(by.model('data.gdp')).sendKeys('');
           element(by.model('data.gdp_growth')).sendKeys('-1.7');
           element(by.model('data.gdp_deflator')).sendKeys('');
           
           element(by.buttonText('Add')).click().then(function(){
               
               element.all(by.repeater('dataUnit in data'))
               .then(function(data){
                   expect(data.length)
                   .toEqual(initialdata.length+1);
               });
               
               
               
               
               
               
           });
           
            
            
            
            
        });
    });
    
})