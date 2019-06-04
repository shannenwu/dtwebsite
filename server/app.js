const express = require("express");
const path = require("path");

const app = express();
const http = require("http").Server(app);
const io = require("socket.io")(http);

const publicPath = path.resolve(__dirname, "..", "client", "dist");


app.use(express.static(publicPath));

// initialize routes
const routes = require('./controllers');
app.use('/', routes);

app.get('/*', function(req, res) {
  res.sendFile(path.join(__dirname, '../client/dist', 'index.html'));
});

http.listen(3000, () => {
  console.log(`Listening on port 3000 and looking in folder ${publicPath}`);
});





