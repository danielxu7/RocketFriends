const app = require('./app');
const http = require('http');
//const socketio = require('socket.io');
const server = http.createServer(app);
// const io = socketio(server);
const port = process.env.PORT;

// TODO: sockets

server.listen(port, () => {
    console.log(`Server is up on port ${port}!`);
});