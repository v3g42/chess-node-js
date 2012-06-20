var express = require('express');
var app = express.createServer()
  , io = require('socket.io')
  , redis = require("redis")
  , redis_client = redis.createClient();



app.set('view engine','ejs');
// Optional since express defaults to CWD/views

app.set('views', __dirname + '/views');
app.set('view options', {layout : false});

// serve static files
app.use(express.static(__dirname + '/public'));

// Without this you would need to
// supply the extension to res.render()
// ex: res.render('users.html').
//app.set('view engine', 'html');

// Dummy users
var users = [
    { name: 'tobi', email: 'tobi@learnboost.com' }
  , { name: 'loki', email: 'loki@learnboost.com' }
  , { name: 'jane', email: 'jane@learnboost.com' }
];

app.get('/', function(req, res){
  res.render('chess', { users: users });
});
app.listen(4000);
console.log('Chess started on port 4000');


const websocket_server = io.listen(app),
transports = ['websocket', 'flashsocket', 'xhr-polling', 'jsonp-polling'];

count=0;
websocket_server.configure(function() {
    websocket_server.enable('browser client etag');
    websocket_server.set('browser client minification', true);
    websocket_server.set('log level', 1);
    websocket_server.set('transports', transports);
});

websocket_server.sockets.on('connection', function (socket) {
	socket.emit('handshake_established');
});