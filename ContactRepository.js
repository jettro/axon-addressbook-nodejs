/**
 * Repository object that handles all requests to the backend.
 *
 * @author Jettro Coenradie
 */
var http = require('http');

function createRepo (host, port) {
    var instance = {
        listContacts : function(callback) {
            var opts = instance._createHttpRequestOpts('/contacts', 'GET');

            var req = http.get(opts, function(res) {
                res.on('data', function(data) {
                    callback(JSON.parse(data));
                });
            });
        },
        newContact : function(name, callback) {
            var opts = instance._createHttpRequestOpts('/contacts', 'POST');

            var req = http.request(opts, function(res) {
                res.setEncoding('utf8');
                res.on('data', function(data) {
                    if (res.statusCode != 200) {
                        console.log(data);
                        callback('error', 'Maybe the name is already taken?');
                    } else {
                        callback('ok', 'The new contact has been send')
                    }
                });
            });

            var contact = {};
            contact.name = name;

            req.write(JSON.stringify(contact));
            req.end();
        },
        changeNameOfContact : function(contact, callback) {
            var opts = instance._createHttpRequestOpts('/contacts', 'PUT');

            var req = http.request(opts, function(res) {
                res.setEncoding('utf8');
                res.on('data', function(data) {
                    if (res.statusCode != 200) {
                        console.log(data);
                        callback('error', 'Maybe the name is already taken?');
                    } else {
                        callback('ok', 'The contact has been updated')
                    }
                });
            });

            req.write(JSON.stringify(contact));
            req.end();
        },
        obtainContact : function(identifier, callback) {
            var opts = instance._createHttpRequestOpts('/contacts/' + identifier, 'GET');

            var req = http.get(opts, function(res) {
                res.setEncoding('utf8');
                res.on('data', function(data) {
                    callback(JSON.parse(data));
                });
            });
        },
        removeContact : function(identifier, callback) {
            var opts = instance._createHttpRequestOpts('/contacts', 'DELETE');

            var req = http.request(opts, function(res) {
                res.setEncoding('utf8');
                res.on('data', function(data) {
                    if (res.statusCode != 200) {
                        console.log(data);
                        callback('error', 'Did you for get to send an identifier?');
                    } else {
                        callback('ok', 'The new contact removal request has been send')
                    }
                });
            });

            var contact = {};
            contact.identifier = identifier;

            req.write(JSON.stringify(contact));
            req.end();
        },
        addAddress : function(address, callback) {
            var opts = instance._createHttpRequestOpts('/contacts/' + address.identifier + '/address', 'PUT');

            var req = http.request(opts, function(res) {
                res.setEncoding('utf8');
                res.on('data', function(data) {
                    if (res.statusCode != 200) {
                        console.log(data);
                        callback('error', 'Did you for get to send an identifier?');
                    } else {
                        callback('ok', 'The new address has been send')
                    }
                });
            });

            req.write(JSON.stringify(address));
            req.end();

        },
        removeAddress : function(address, callback) {
            var opts = instance._createHttpRequestOpts('/contacts/' + address.identifier + '/address', 'DELETE');

            var req = http.request(opts, function(res) {
                res.setEncoding('utf8');
                res.on('data', function(data) {
                    if (res.statusCode != 200) {
                        console.log(data);
                        callback('error', 'Did you for get to send an identifier or the address type?');
                    } else {
                        callback('ok', 'The address has been removed')
                    }
                });
            });

            req.write(JSON.stringify(address));
            req.end();
        },
        _createHttpRequestOpts : function (path, method) {
            return {
                host: host,
                port: port,
                headers: {'Accept':'application/json','Content-Type':'application/json'},
                path: path,
                method: method

            };
        }
    };

    return instance;
};

module.exports = createRepo;