/* global browser */
/* global element */
/* global expect */
/* global by */

describe('Data is loaded', function () {
	it('should show a bunch of data', function (){
		browser.get('http://localhost:8080/#!/education');
		var educationDataList = element.all(by.repeater('dataUnit in data'));
		expect(educationDataList.count()).toEqual(1);
	});
});