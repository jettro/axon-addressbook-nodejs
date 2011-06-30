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
app.get('/new', contactController.newContactShowForm);
app.post('/new', contactController.newContactPostForm);

app.listen(8018);
console.log('Express server started on port %s', app.address().port);