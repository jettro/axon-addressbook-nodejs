/**
 *
 * @author Jettro Coenradie
 */
var pub = __dirname + '/public';
var ContactController = require('./ContactController');
var repository = require('./ContactRepository').createRepo('localhost',8080);
var contactController = new ContactController(repository);

var express = require('express')
        , app = express.createServer();

app.configure(function() {
    app.set('view engine', 'jade');
    app.set('views', __dirname + '/views');
    app.set('view options', { layout: 'layout' });
    app.use(express.methodOverride());
    app.use(express.static(pub));
    app.use(express.bodyParser());
});

app.get('/', contactController.listContacts);
app.get('/contact/new', contactController.newContactShowForm);
app.post('/contact/new', contactController.newContactPostForm);
app.get('/contact/:identifier',contactController.contact);
app.get('/contact/:identifier/edit',contactController.changeContactShowForm);
app.post('/contact/:identifier/edit',contactController.changeContactPostForm);
app.get('/contact/:identifier/delete',contactController.deleteContactShowForm);
app.post('/contact/:identifier/delete',contactController.deleteContactPostForm);
app.get('/contact/:identifier/address/new',contactController.newAddressShowForm);
app.post('/contact/:identifier/address/new',contactController.newAddressPostForm);
app.get('/contact/:identifier/address/:addressType/edit',contactController.changeAddressShowForm);
app.post('/contact/:identifier/address/:addressType/edit',contactController.changeAddressPostForm);
app.get('/contact/:identifier/address/:addressType/delete',contactController.deleteAddressShowForm);
app.post('/contact/:identifier/address/:addressType/delete',contactController.deleteAddressPostForm);

app.listen(8018);
console.log('Express server started on port %s', app.address().port);