var fs = require('fs');

function writeScreenShot(data, filename) {
        var stream = fs.createWriteStream(filename);
        stream.write(new Buffer(data, 'base64'));
        stream.end();
}

describe('Data is loaded', function () {
	it('should show a bunch of data', function (){
		browser.get('http://localhost:8080/contacts.html');
		var contacts = element.all(by.repeater('contact in contacts'));
		browser.takeScreenshot().then(function (png) {
    			writeScreenShot(png, 'ng-test.png');
    		});
		expect(contacts.count()).toBeGreaterThan(5);
	});
});