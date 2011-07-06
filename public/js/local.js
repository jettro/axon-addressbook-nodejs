/**
 *
 * @author Jettro Coenradie
 */
$(document).ready(function() {
    now.receiveContact = function(data) {
        var message = JSON.parse(data);
        var toWrite;
        if (message.type == 'removed') {
            toWrite = "Contact " +  message.type;
        } else {
            toWrite = message.content.name + " " + message.type;
        }
        $("#messages").prepend("<div>" + toWrite + " </div>");
    };
});
