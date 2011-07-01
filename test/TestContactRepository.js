/**
 * Test class for ContactRepository
 *
 * @author Jettro Coenradie
 */
var assert = require('assert');
var ContactRepository = require("../ContactRepository");
var repository = ContactRepository.createRepo('localhost', 8080);

// We chain the tests to make it easier to use the existing data set
repository.listContacts(function(contacts) {
    assert.equal(2, contacts.length, "Number of contacts is not right: " + contacts.length);
    testNewContact();
});

function testNewContact() {
    repository.newContact("My Test", function(code, message) {
        assert.equal("ok", code, "This should be no problem and an ok should be returned: " + code);
        // Check if the amount of contacts is increased
        repository.listContacts(function(contacts) {
            // Beware that we use the query database to verify, race conditions might happen and fail this test
            assert.equal(3, contacts.length, "Number of contacts is not right, create did not work: " + contacts.length);
            testObtainDetails();
        });
    });
}

function testObtainDetails() {
    repository.listContacts(function(contacts) {
        for (var i = 0; i < contacts.length; i++) {
            if (contacts[i].name == "Allard") {
                repository.obtainContact(contacts[i].identifier, function(contact) {
                    assert.equal("Allard", contact.name, "name of contact is not as expected");
                    assert.equal("PRIVATE", contact.addresses[0].addressType, "AddressType of first address not as expected");
                    assert.equal("AxonBoulevard 1", contact.addresses[0].streetAndNumber, "Street not as expected");
                    assert.equal("1234AB", contact.addresses[0].zipCode, "Zip code not as expected");
                    assert.equal("The Hague", contact.addresses[0].city, "City not as expected");
                    testChangeName();
                });
            }
        }
    });
}

function testChangeName() {
    //obtain id for contact with name "My Test" and remove that contact
    repository.listContacts(function(contacts) {
        for (var i = 0; i < contacts.length; i++) {
            if (contacts[i].name == "My Test") {
                var contact = contacts[i];
                contact.name = "My Test Updated";
                repository.changeNameOfContact(contact, function(code,message) {
                    assert.equal("ok", code, "This should be no problem and an ok should be returned: " + code);
                    testRemoveContact();
                });
            }
        }
    });
}

function testRemoveContact() {
    //obtain id for contact with name "My Test" and remove that contact
    repository.listContacts(function(contacts) {
        for (var i = 0; i < contacts.length; i++) {
            if (contacts[i].name == "My Test Updated") {
                repository.removeContact(contacts[i].identifier, function(code, message) {
                    assert.equal("ok", code, "Removing the contact failed, problem with the identifier?: " + message);
                    // Check that the amount of contacts is now decreased
                    repository.listContacts(function(contacts) {
                        // Beware that we use the query database to verify, race conditions might happen and fail this test
                        assert.equal(2, contacts.length, "Number of contacts is not right, remove did not work: " + contacts.length);
                    });
                });
            }
        }
    });
}
