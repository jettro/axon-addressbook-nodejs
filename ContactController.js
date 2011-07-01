/**
 *
 * @author Jettro Coenradie
 */
var repository;

function ContactController(contactsRepository) {
    repository = contactsRepository;
}

ContactController.prototype.listContacts = function(req, res) {
    repository.listContacts(function(contacts) {
        res.render('index', {locals: {contacts: contacts}});
    });
};

ContactController.prototype.contact = function(req,res) {
    var identifier = req.params.identifier;
    repository.obtainContact(identifier,function(contact) {
        res.render('detailscontact', {locals: {contact: contact}});
    });
};

/* create a contact */
ContactController.prototype.newContactShowForm = function(req, res) {
    res.render('newcontact', {locals: {error:''}});
};

ContactController.prototype.newContactPostForm = function(req, res) {
    repository.newContact(req.body.new_name, function(code, message) {
        if (code == "ok") {
            res.redirect("/");
        } else {
            res.render('newcontact', {locals: {error:message}});
        }
    });
};

/* change a contact */
ContactController.prototype.changeContactShowForm = function(req, res) {
    var identifier = req.params.identifier;
    console.log("Identifier to get details for is %s", identifier);
    repository.obtainContact(identifier,function(contact) {
        res.render('changecontact', {locals: {error:'', contact:contact}});
    });
};

ContactController.prototype.changeContactPostForm = function(req, res) {
    var contact = {};
    contact.name = req.body.new_name;
    contact.identifier = req.params.identifier;

    repository.changeNameOfContact(contact, function(code, message) {
        if (code == "ok") {
            res.redirect("/");
        } else {
            res.render('changecontact', {locals: {error:message, contact:contact}});
        }
    });
};

/* Delete a contact */
ContactController.prototype.deleteContactShowForm = function(req, res) {
    var identifier = req.params.identifier;
    repository.obtainContact(identifier,function(contact) {
        res.render('deletecontact', {locals: {error:'', contact:contact}});
    });
};

ContactController.prototype.deleteContactPostForm = function(req, res) {
    var identifier = req.params.identifier;
    repository.removeContact(identifier, function(code, message) {
        if (code == "ok") {
            res.redirect("/");
        } else {
            res.render('deletecontact', {locals: {error:message, contact:contact}});
        }
    });
};

module.exports = ContactController;