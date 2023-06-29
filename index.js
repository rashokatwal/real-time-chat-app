var express = require('express');
var socket = require('socket.io');
var app = express();

var server = app.listen(4000, () => {
    console.log('started')
})

app.set('view engine', 'ejs');
app.set('views', './views')
app.use(express.static('views'));

var io = socket(server);

let rooms = new Set([]);

var userCount;

io.on('connection', function(socket) {
    console.log('connected');

    socket.on('createroom', function(data) {
        socket.join(data.id); 
        rooms.add(data.id);
        userCount = io.sockets.adapter.rooms.get(data.id).size;
        io.sockets.in(data.id).emit('enter', data, socket.id, 'created', userCount);
    })

    socket.on('joinroom', function(data) {
        if (rooms.has(data.id)) {
            socket.join(data.id);
            userCount = io.sockets.adapter.rooms.get(data.id).size;
            io.sockets.in(data.id).emit('enter', data, socket.id, 'joined', userCount);
        }
        else {
            socket.emit('redirect', 'doesNotExist');
        }
    })

    socket.on('chat', function(data) {
        var [,second] = socket.rooms;
        io.sockets.in(second).emit('chat', data, socket.id);
    })

    socket.on('typing', function(data) {
        var [,second] = socket.rooms;
        socket.broadcast.to(second).emit('typing', data);
    })

    socket.on('leave', function(data) {
        console.log('left')
        var [,second] = socket.rooms;
        if (userCount == 0) {
            rooms.delete(second);
        }
        socket.emit('redirect', 'leaving');
        socket.disconnect();

        if (userCount > 1) {
            userCount = io.sockets.adapter.rooms.get(second).size;
        }

        io.sockets.in(second).emit('leave', data.username, userCount);
    })

})

app.get('/', function(req, res) {
    res.render('index')
})

app.get('/:room', function(req, res) {
    res.render('chat', {roomId: req.params.room})
})


