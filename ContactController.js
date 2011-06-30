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

ContactController.prototype.newContactShowForm = function(req,res) {
    res.render('newcontact',{locals: {error:''}});
};

ContactController.prototype.newContactPostForm = function(req,res) {
    repository.newContact(req.body.new_name, function(code,message) {
        if (code == "ok") {
            res.redirect("/");
        } else {
            res.render('newcontact', {locals: {error:message}});
        }
    });
};

module.exports = ContactController;