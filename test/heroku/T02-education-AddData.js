describe('Add contact', function () {
	it('should add a new contact', function (){
		browser.get('http://localhost:8080/contacts.html');

		element.all(by.repeater('contact in contacts')).then(function (initialContacts){
				browser.driver.sleep(2000);
	
				element(by.model('newContact.name')).sendKeys('pepe');
				element(by.model('newContact.email')).sendKeys('pepe@pepe.com');
				element(by.model('newContact.phone')).sendKeys('1245');
				
				element(by.buttonText('Add')).click().then(function (){

					element.all(by.repeater('contact in contacts')).then(function (contacts){
						expect(contacts.length).toEqual(initialContacts.length+1);
					});
				
				});
			
		});
	});
});