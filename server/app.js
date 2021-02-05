const express = require("express");
const path = require("path");

const app = express();
const http = require("http").Server(app);
const io = require("socket.io")(http);
require("dotenv").config();

const publicPath = path.resolve(__dirname, "..", "client", "dist");

app.use(express.static(publicPath));

// initialize routes
const routes = require("./controllers");
app.use("/", routes);

app.get("/*", function (req, res) {
  res.sendFile(path.join(__dirname, "../client/dist", "index.html"));
});

//socket setup
app.set("socketio", io);

// handle incoming connections from clients
io.on("connection", function (socket) {
  console.log("a client connected");

  socket.on("disconnect", function () {
    console.log("user disconnected");
  });
});

http.listen(process.env.PORT, () => {
  console.log(
    `Listening on port ${process.env.PORT} and looking in folder ${publicPath}`
  );
});
