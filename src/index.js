const app = require('./app');
const { generateMessage } = require('./utils/messages');
const { addUser, removeUser, getUser, getUsersInRoom } = require('./utils/users');
const http = require('http');
const socketio = require('socket.io');
const server = http.createServer(app);
const io = socketio(server);
const port = process.env.PORT;

// sockets
io.on('connection', (socket) => {
    console.log('New WebSocket connection')
    
    // user joined the room
    socket.on('join', ({username, room}, callback) => {
        const user = addUser({ id: socket.id, username, room });
        socket.join(user.room);
        socket.broadcast.to(user.room).emit('message', generateMessage('Admin', `${user.username} has joined!`));
        io.to(user.room).emit('roomData', {
            room: user.room,
            users: getUsersInRoom(user.room)
        });

        callback();
    });

    // user sent a message
    socket.on('sendMessage', (message, callback) => {
        const user = getUser(socket.id);
        io.to(user.room).emit('message', generateMessage(user.username, message));
        callback();
    });

    // user left the room
    socket.on('disconnect', () => {
        const user = removeUser(socket.id);

        if (user) {
            // user was removed properly
            io.to(user.room).emit('message', generateMessage('Admin', `${user.username} has left!`));
            io.to(user.room).emit('roomData', {
                room: user.room,
                users: getUsersInRoom(user.room)
            });
        }
    });
});

server.listen(port, () => {
    console.log(`Server is up on port ${port}!`);
});