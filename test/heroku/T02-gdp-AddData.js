/* global browser */
/* global element */
/* global expect */
/* global by */

describe('Add a gdp entity', function() {
	it('should add a new gdp entity', function() {
		browser.get('http://localhost:8080/#!/gdp');

		element.all(by.repeater('dataUnit in data')).then(function(initialGdpDataList) {
			browser.driver.sleep(2000);

			element(by.model('newData.country')).sendKeys('Spain');
			element(by.model('newData.year')).sendKeys('2013');
			element(by.model("newData['gdp']")).sendKeys('1369261671179.01');
			element(by.model("newData['gdp_growth']")).sendKeys('-1.7');
			element(by.model("newData['gdp_deflator']")).sendKeys('106');
			
			// element(by.model('newData.country')).sendKeys('Poland');
			// element(by.model('newData.year')).sendKeys('2014');
			// element(by.model("newData['gdp']")).sendKeys('545158979236');
			// element(by.model("newData['gdp_growth']")).sendKeys('3.3');
			// element(by.model("newData['gdp_deflator']")).sendKeys('106.5');
			
			// element(by.model('newData.country')).sendKeys('Morocco');
			// element(by.model('newData.year')).sendKeys('2015');
			// element(by.model("newData['gdp']")).sendKeys('100593283696.7');
			// element(by.model("newData['gdp_growth']")).sendKeys('4.5');
			// element(by.model("newData['gdp_deflator']")).sendKeys('108.9');
			
			

			element(by.buttonText('add')).click().then(function() {

				element.all(by.repeater('dataUnit in data')).then(function(gdpDataList) {
					expect(gdpDataList.length).
					toEqual(initialGdpDataList.length + 1);
				});

			});

		});
	});
});