/**
 *
 * @author Jettro Coenradie
 */
var repository;

function ContactController(contactsRepository) {
    repository = contactsRepository;
}

ContactController.prototype.listContacts = function(req,res) {
    repository.listContacts(function(contacts) {
        res.render('index', {locals: {contacts: contacts}});
    });
};

module.exports = ContactController;