/* global browser */
/* global element */
/* global expect */
/* global by */

describe('Data is loaded', function () {
	it('should show a bunch of data', function (){
		browser.get('https://sos1617-06.herokuapp.com/#!/gdp-per-capita');
		var gdpPerCapitaDataList = element.all(by.repeater('dataUnit in data'));
		expect(gdpPerCapitaDataList.count()).toEqual(1);
	});
});