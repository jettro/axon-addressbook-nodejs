/**
 * Test class for ContactRepository
 *
 * @author Jettro Coenradie
 */
var assert = require('assert');
var ContactRepository = require("../ContactRepository");
var repository = ContactRepository.createRepo('localhost',8080);

repository.listContacts(function(contacts){
    assert.equal(2,contacts.length, "Number of contacts is not right");
});
