/* global browser */
/* global element */
/* global expect */
/* global by */

describe('Add an gdp per capita entity', function() {
	it('should add a new gdp per capita entity', function() {
		browser.get('https://sos1617-06.herokuapp.com/#!/gdp-per-capita');

		element.all(by.repeater('dataUnit in data')).then(function(initialGdpPerCapitaDataList) {
			browser.driver.sleep(2000);

			element(by.model('newData.country')).sendKeys('morocco');
			element(by.model('newData.year')).sendKeys('2016');
			element(by.model("newData['gdp-per-capita-growth']")).sendKeys('3.1');
			element(by.model("newData['gdp-per-capita']")).sendKeys('2878.2');
			element(by.model("newData['gdp-per-capita-ppp']")).sendKeys('7841.5');

			element(by.buttonText('add')).click().then(function() {

				element.all(by.repeater('dataUnit in data')).then(function(gdpPerCapitaDataList) {
					expect(gdpPerCapitaDataList.length).toEqual(initialGdpPerCapitaDataList.length + 1);
				});

			});

		});
	});
});