const express = require("express");
const path = require("path");

const app = express();
const http = require("http").Server(app);
const io = require("socket.io")(http);
require('dotenv').config()

const publicPath = path.resolve(__dirname, "..", "client", "dist");


app.use(express.static(publicPath));

// initialize routes
const routes = require('./controllers');
app.use('/', routes);

app.get('/*', function (req, res) {
  res.sendFile(path.join(__dirname, '../client/dist', 'index.html'));
});

//socket setup
app.set('socketio', io);

// handle incoming connections from clients
io.on('connection', function (socket) {
  console.log('a client connected');
  // once a client has connected, we expect to get a ping from them saying what room they want to join
  socket.on('room', function (room) {
    socket.join(room, () => {
      // let rooms = Object.keys(socket.rooms);
      // console.log(rooms); 
    });
  
    io.in(room).emit('connected to room', "you are in room with dance id " + room);
  });
  socket.on('disconnect', function () {
    console.log('user disconnected');
  });
});

http.listen(3000, () => {
  console.log(`Listening on port 3000 and looking in folder ${publicPath}`);
});





