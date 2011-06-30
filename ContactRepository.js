/**
 * Repository object that handles all requests to the backend.
 *
 * @author Jettro Coenradie
 */
var http = require('http');
var host = 'localhost';
var port = 8080;

function ContactRepository() {}

ContactRepository.createRepo = function(host, port) {
    var repo = new ContactRepository();
    repo.host = host;
    repo.port = port;
    return repo;
};

ContactRepository.prototype.listContacts = function(callback) {
    var opts = createHttpRequestOpts('/contacts','GET');

    var req = http.get(opts, function(res){
        res.on('data', function(data) {
            callback(JSON.parse(data));
        });
    });

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