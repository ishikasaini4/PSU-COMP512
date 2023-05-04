var app = require('express')();
var http = require('http').createServer(app);
var io = require('socket.io')(http, {
  cors: {
    origin: '*',
  }
});

io.on('connection', (socket) => {
  //logs 'User Online' when a new client connects to the active server
  console.log('User Online');

  socket.on("canvas-data", (data) => {
    //send data back to the connected clients
    io.broadcast("canvas-data", data);
    console.log("Data : " + data);
  })
})

var server_port = process.env.YOUR_PORT || process.env.PORT || 5000;
//server listens on the given port
http.listen(server_port, () => {
  console.log("Started on : " + server_port);
})
