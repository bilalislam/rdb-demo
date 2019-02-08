var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var db = require('./lib/db');
var port = process.env.PORT || 3000;

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function (socket) {
  socket.on('chat message', function (msg) {
    db.saveMessage(msg, function (err, saved) {
      db.getCount('film', function (err,e) {
        io.emit('chat message', e);
      });
    });
  });
});

http.listen(port, function () {
  console.log('listening on *:' + port);
});
