/**
 * Repository object that handles all requests to the backend.
 *
 * @author Jettro Coenradie
 */
var http = require('http');
var host = 'localhost';
var port = 8080;

function ContactRepository() {
}

ContactRepository.createRepo = function(host, port) {
    var repo = new ContactRepository();
    repo.host = host;
    repo.port = port;
    return repo;
};

ContactRepository.prototype.listContacts = function(callback) {
    var opts = createHttpRequestOpts('/contacts', 'GET');

    var req = http.get(opts, function(res) {
        res.on('data', function(data) {
            callback(JSON.parse(data));
        });
    });

};

ContactRepository.prototype.newContact = function(name, callback) {
    var opts = createHttpRequestOpts('/contacts', 'POST');

    var req = http.request(opts, function(res) {
        res.setEncoding('utf8');
        res.on('data', function(data) {
            if (res.statusCode != 200) {
                console.log(data);
                callback('error','Maybe the name is already taken?');
            } else {
                callback('ok','The new contact has been send')
            }
        });
    });

    var contact = {};
    contact.name = name;

    req.write(JSON.stringify(contact));
    req.end();
};

function createHttpRequestOpts(path, method) {
    return {
        host: host,
        port: port,
        path:path,
        headers:{'Accept':'application/json','Content-Type':'application/json'},
        method: method
    };
}

module.exports = ContactRepository;