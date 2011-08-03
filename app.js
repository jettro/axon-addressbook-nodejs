/**
 *
 * @author Jettro Coenradie
 */
var pub = __dirname + '/public';
var repository = require('./ContactRepository')('localhost',8080);
var contactController = require('./ContactController')(repository);

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

var Now = require('now');
var everyone = Now.initialize(app);

var redis = require("redis"),
    client = redis.createClient();

client.on("error", function (err) {
    console.log("Error %s", err);
});

// TODO jettro: Does not work if the queue is not available in redis, create retry mechanism
client.on("message", function (channel, message) {
    console.log("Received message: %s", message);
    everyone.now.receiveContact(message);
});
client.subscribe("nl.axonframework.examples.addressbook");



app.listen(8018);
console.log('Express server started on port %s', app.address().port);