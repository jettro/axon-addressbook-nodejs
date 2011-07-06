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
        res.render('index', {locals: {contacts: contacts, nowjs: true}});
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

/* add an Address */
ContactController.prototype.newAddressShowForm = function(req,res) {
    var identifier = req.params.identifier;
    repository.obtainContact(identifier,function(contact) {
        res.render('newaddress', {locals: {error:'', contact:contact}});
    });
};

ContactController.prototype.newAddressPostForm = function(req,res) {
    var address = {};
    address.identifier = req.params.identifier;
    address.addressType = req.body.addressType;
    address.streetAndNumber = req.body.streetAndNumber;
    address.zipCode = req.body.zipCode;
    address.city = req.body.city;
    repository.addAddress(address,function(code,message) {
        if (code == "ok") {
            res.redirect("/contact/"+address.identifier);
        } else {
            res.render('newaddress', {locals: {error:message, contact:contact}});
        }
    });
};

/* change an address */
ContactController.prototype.changeAddressShowForm = function(req,res) {
    var identifier = req.params.identifier;
    var requestedAddressType = req.params.addressType;
    repository.obtainContact(identifier,function(contact) {
        var address = findRequestAddressByType(contact.addresses,requestedAddressType);
        if (address) {
            res.render('changeaddress', {locals:{error:'', address:address}});
        } else {
            res.redirect('/contact/'+contact.identifier+'/address/new');
        }
    });
};

ContactController.prototype.changeAddressPostForm = function(req,res) {
    var address = {};
    address.identifier = req.params.identifier;
    address.addressType = req.params.addressType;
    address.streetAndNumber = req.body.streetAndNumber;
    address.zipCode = req.body.zipCode;
    address.city = req.body.city;
    repository.addAddress(address,function(code,message) {
        if (code == "ok") {
            res.redirect("/contact/"+address.identifier);
        } else {
            res.render('changeaddress', {locals: {error:message, contact:contact}});
        }
    });
};

/* Remove an address */
ContactController.prototype.deleteAddressShowForm = function(req,res) {
    var identifier = req.params.identifier;
    var requestedAddressType = req.params.addressType;
    repository.obtainContact(identifier,function(contact) {
        var address = findRequestAddressByType(contact.addresses,requestedAddressType);
        if (address) {
            res.render('deleteaddress', {locals:{error:'', address:address}});
        } else {
            res.redirect('/contact/'+contact.identifier);
        }
    });
};

ContactController.prototype.deleteAddressPostForm = function(req,res) {
    var address = {};
    address.identifier = req.params.identifier;
    address.addressType = req.params.addressType;
    repository.removeAddress(address,function(code,message) {
        if (code == "ok") {
            res.redirect("/contact/"+address.identifier);
        } else {
            res.render('deleteaddress', {locals: {error:message, address:address}});
        }
    });
};

module.exports = ContactController;

/* helper functions */
function findRequestAddressByType(addresses,addressType) {
    if (!addresses) {
        return null;
    }
    for (var i = 0; i < addresses.length; i++) {
        if (addresses[i].addressType == addressType) {
            return addresses[i];
        }
    }
    return null;
}