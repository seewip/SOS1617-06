/* global browser */
/* global element */
/* global expect */
/* global by */

describe('Add an education entity', function() {
	it('should add a new education entity', function() {
		browser.get('http://localhost:8080/#!/education');

		element.all(by.repeater('dataUnit in data')).then(function(initialEducationDataList) {
			browser.driver.sleep(2000);

			element(by.model('newData.country')).sendKeys('Poland');
			element(by.model('newData.year')).sendKeys('2012');
			element(by.model("newData['education-gdp-perc']")).sendKeys('4.8');
			element(by.model("newData['education-primary-per-capita']")).sendKeys('25.5');
			element(by.model("newData['education-secondary-per-capita']")).sendKeys('23.8');
			element(by.model("newData['education-tertiary-per-capita']")).sendKeys('21.3');

			element(by.buttonText('add')).click().then(function() {

				element.all(by.repeater('dataUnit in data')).then(function(educationDataList) {
					expect(educationDataList.length).toEqual(initialEducationDataList.length + 1);
				});

			});

		});
	});
});
