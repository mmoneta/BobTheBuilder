const express = require("express"),
app = express(),
http = require("http"),
server = http.createServer(app),
fs = require("fs"),
mime = require('mime-types'),
qs = require("querystring"),
socketio = require("socket.io"),
mongoose = require("mongoose");

// Static files
app.use(express.static('static'));

// Create a database
mongoose.connect('mongodb://localhost/elements');

// Create document models - table equivalents
var Models = require("./database/Models.js")(mongoose);
var Operations = require("./database/Operations.js");

// Objects of Mongo's database
var db, opers;

// Run server
server.listen(3000);
console.log('Server started on port: ', server.address().port);

// Socket.io
var io = socketio.listen(server);
io.sockets.on("connection", function (client) {  
  console.log("Client connected: " + client.id) 
  // client.id - unique client name generated by socket.io
  client.emit("onconnect", {
     clientName: client.id
  });

  client.on("disconnect", function () {
    console.log("Client disconnected: " + client.id);
  });

  client.on("login", function (data) {
    client.broadcast.emit("login", { login: data.login });
    client.id = data.login;
    // Data for admin
    if (data.login == "admin" || data.login == "administrator") {
      opers.SelectAll(Models.Player, function (data) {
        io.sockets.emit("allData", { data: data });
      })
    }
    else {
      opers.SelectWhere(Models.Player, data.login, function (data) {
        io.sockets.emit("thisData", { data: data });
      })
    }
  });

  client.on("save", function (data) {
    for (var i = 0; i < data.save.length; i++) {
      var user = new Models.Player({
        nick: data.save[i].nick,
        pozX: data.save[i].pozX,
        pozY: data.save[i].pozY,
        pozZ: data.save[i].pozZ,
        size: data.save[i].size,
        rotate: data.save[i].rotate,
        color: data.save[i].color
      });
      user.validate(function (err) {
        console.log(err);
      });
      opers.InsertOne(user);
    }
  });

  client.on("positions", function (data) {
    client.broadcast.emit("positions", { posX: data.posX, posY: data.posY, posZ: data.posZ, myColor: data.myColor });
  });

  client.on("move", function (data) {
    client.broadcast.emit("move", { posX: data.posX, posY: data.posY, posZ: data.posZ });
  });

  client.on("colors", function (data) {
    client.broadcast.emit("colors", { myColor: data.myColor });
  });

  client.on("zoom", function (data) {
    client.broadcast.emit("zoom", { zoom: data.zoom });
  });

  client.on("rotate", function (data) {
    client.broadcast.emit("rotate", { rotate: data.rotate });
  });

  client.on("select", function (data) {
    if (data.select == "All") {
      opers.SelectAndLimit(Models.Player, 100, function (data) {
        io.sockets.emit("userData", { data: data });
      });
    }
    else {
      opers.SelectLimitWhere(Models.Player, data.select, 100, function (data) {
        io.sockets.emit("userData", { data: data });
      });
    }
  })
})

// MongoDB
function connectToMongo() {
  db = mongoose.connection;
  // when an error occurs
  db.on("error", function () {
    console.log("Problem with Mongo")
  });
  // when properly connected to the database
  db.once("open", function () {
    console.log("Mongo is connected");
    opers = new Operations();
  });
  // when disconnected from the database
  db.once("close", function () {
    console.log("Mongo was disconnected");
  });
}
connectToMongo();
