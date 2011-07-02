/**
 * Test class for ContactRepository. All methods in this class have been chained. This makes it easier to create a test
 * that adds a contact, adds address, obtain items and remove them again. After every successful run the data should be
 * left in the state where it went of from.
 *
 * We tried to make the methods self maintained, but they do build on the previous test case, so it might be hard to
 * run just one test.
 *
 * @author Jettro Coenradie
 */
var assert = require('assert');
var ContactRepository = require("../ContactRepository");
var repository = ContactRepository.createRepo('localhost', 8080);

var numContacts;

// Initialize the test by obtaining the existing contacts and remembering the amount of contacts available
repository.listContacts(function(contacts) {
    numContacts = contacts.length;
    testNewContact();
});

function testNewContact() {
    logTestName("New contact");
    repository.newContact("My Test", function(code, message) {
        assert.equal("ok", code, "This should be no problem and an ok should be returned: " + code);
        // Check if the amount of contacts is increased
        repository.listContacts(function(contacts) {
            assert.equal(numContacts + 1, contacts.length, "Number of contacts is not right, create did not work: " + contacts.length);
            testAddAddress();
        });
    });
}

function testAddAddress() {
    logTestName("Add address");
    findContactByName("My Test", function(contact) {
        var address = {};
        address.identifier = contact.identifier;
        address.addressType = "PRIVATE";
        address.streetAndNumber = "Teststraat 8";
        address.zipCode = "1234ZE";
        address.city = "Testville";
        repository.addAddress(address, function(code, message) {
            assert.equal("ok",code,"Problem while adding an address: " + message);
            testObtainDetails();
        })
    });
}

function testObtainDetails() {
    logTestName("Obtain details");
    findContactByName("My Test", function(listedContact) {
        repository.obtainContact(listedContact.identifier, function(contact) {
            assert.equal("My Test", contact.name, "name of contact is not as expected");
            assert.equal("PRIVATE", contact.addresses[0].addressType, "AddressType of first address not as expected");
            assert.equal("Teststraat 8", contact.addresses[0].streetAndNumber, "Street not as expected");
            assert.equal("1234ZE", contact.addresses[0].zipCode, "Zip code not as expected");
            assert.equal("Testville", contact.addresses[0].city, "City not as expected");
            testChangeName();
        });
    });
}

function testChangeName() {
    logTestName("Change name");
    findContactByName("My Test", function(contact) {
        contact.name = "My Test Updated";
        repository.changeNameOfContact(contact, function(code,message) {
            assert.equal("ok", code, "This should be no problem and an ok should be returned: " + code);
            testRemoveAddress();
        });
    });
}

function testRemoveAddress() {
    logTestName("Remove address");
    findContactByName("My Test Updated", function(listedcontact) {
        repository.obtainContact(listedcontact.identifier, function(contact) {
            repository.removeAddress(contact.addresses[0], function(code,message) {
                assert.equal("ok", code, "This should be no problem and an ok should be returned: " + code);
                testRemoveContact();
            });
        });
    });
}

function testRemoveContact() {
    logTestName("Remove contact");
    findContactByName("My Test Updated", function(contact) {
        repository.removeContact(contact.identifier, function(code, message) {
            assert.equal("ok", code, "Removing the contact failed, problem with the identifier?: " + message);
            // Check that the amount of contacts is now decreased
            repository.listContacts(function(contacts) {
                // Beware that we use the query database to verify, race conditions might happen and fail this test
                assert.equal(numContacts, contacts.length, "Number of contacts is not right, remove did not work: " + contacts.length);
            });
        });
    });
}

/* Helper functions */
function findContactByName(name, callback) {
    repository.listContacts(function(contacts) {
        for (var i = 0; i < contacts.length; i++) {
            if (contacts[i].name == name) {
                callback(contacts[i]);
            }
        }
    });
}

function logTestName(testname) {
    console.log("Running test: %s", testname);
}