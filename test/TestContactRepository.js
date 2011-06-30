/**
 * Test class for ContactRepository
 *
 * @author Jettro Coenradie
 */
var assert = require('assert');
var ContactRepository = require("../ContactRepository");
var repository = ContactRepository.createRepo('localhost',8080);

repository.listContacts(function(contacts){
    assert.equal(2,contacts.length, "Number of contacts is not right: " + contacts.length);
});

repository.newContact("My Test 2", function(code,message) {
    assert.equal("ok", code, "This should be no problem and an ok should be returned: " + code);
});
