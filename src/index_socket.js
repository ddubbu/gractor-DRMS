/* socket\app.js */
const app = require('express')();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
console.log("import index_socket=======================")
io.on('connection', (socket) => {
  console.log('a user connected');
  socket.on('chat message', (msg) => {
    io.emit('chat message', msg);
  });
  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});

http.listen(9003, () => {
  console.log('[socket.io] connected at 9003');
});