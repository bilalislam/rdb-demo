var r = require('rethinkdb')
    , assert = require('assert');

var dbConfig = {
    host: process.env.RDB_HOST || '35.243.126.228',
    port: parseInt(process.env.RDB_PORT) || 28015,
    db: process.env.RDB_DB || 'filmler'
};


module.exports.getCount = function (table, callback) {
    onConnect(function (err, connection) {
        r.db(dbConfig.db).table(table).count().run(connection, function (err, count) {
            console.log(count);
            callback(null, count);
            connection.close();
        });
    });
};

module.exports.saveMessage = function (msg, callback) {
    onConnect(function (err, connection) {
        r.db(dbConfig['db']).table('film').insert(msg).run(connection, function (err, result) {
            if (err) {
                callback(err);
            }
            else {
                if (result.inserted === 1) {
                    callback(null, true);
                }
                else {
                    callback(null, false);
                }
            }
            connection.close();
        });
    });
};

function onConnect(callback) {
    r.connect({ host: dbConfig.host, port: dbConfig.port }, function (err, connection) {
        assert.ok(err === null, err);
        connection['_id'] = Math.floor(Math.random() * 10001);
        callback(err, connection);
    });
}