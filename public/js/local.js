/**
 *
 * @author Jettro Coenradie
 */
$(document).ready(function() {
    now.receiveContact = function(data) {
        var message = JSON.parse(data);
        var toWrite;
        switch(message.type) {
            case 'contact-removed':
                toWrite = "Contact removed";
                break;
            case 'contact-created':
                toWrite = "Contact with name " + message.content.name + " created";
                break;
            case 'contact-changed':
                toWrite = "Contact changed name to " + message.content.name;
                break;
            case 'address-created':
                toWrite = "Added address of type " + message.content.addressType + " to contact " + message.content.name;
                break;
            case 'address-removed':
                toWrite = "Removed address of type " + message.content.addressType + " to contact " + message.content.contact.name;
                break;
        }
        $("#messages").prepend("<div>" + toWrite + " </div>");
    };
});
