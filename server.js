var http = require("http");
var fs = require("fs");
var mime = require('mime-types');
var qs = require("querystring");
var socketio = require("socket.io");
var mongoose = require("mongoose");
// Utworzenie bazy danych
mongoose.connect('mongodb://localhost/elements');
// Utworzenie tzw. modeli dokumentów - odpowiedników  tabel
var Models = require("./database/Models.js")(mongoose);
var Operations = require("./database/Operations.js");
// Obiekty bazy danych Mongo
var db, opers;

// Serwer
var server = http.createServer(function (request, response) {
    console.log("Żądany przez przeglądarkę adres: " + request.url);
    switch (request.method) {
        case "GET":
            if (request.url === "/") {
                fs.readFile("static/index.html", function (error, data) {
                    if (error) {
                        response.writeHead(404, { 'Content-Type': 'text/html' });
                        response.write("<h1>Błąd 404 - nie ma pliku!<h1>");
                        response.end();
                    }
                    else {
                        response.writeHead(200, { 'Content-Type': 'text/html' });
                        response.write(data);
                        response.end();
                    }
                })
            }
            else {
                request.url = request.url.replace(/%20/g, " ");
                var path = "static/" + request.url;
                var filestream = fs.createReadStream(path);
                filestream.on("open", function () {
                    var stats = fs.statSync(path);
                    response.writeHead(200, {
                        'Content-Type': mime.lookup(path),
                        'Content-Length': stats.size
                    });
                    filestream.pipe(response);
                });
                filestream.on('error', function (err) {
                    filestream.end();
                    console.log(err);
                });
            }
            break;
        case "POST":
			break;
    }
});

server.listen(3000);

// Socket.io
var io = socketio.listen(server);
io.sockets.on("connection", function (client) {    
    console.log("Klient sie podłączył" + client.id) 
    // client.id - unikalna nazwa klienta generowana przez socket.io
	client.emit("onconnect", {
	   clientName: client.id
	})
	client.on("disconnect", function () {
		console.log("Klient " + client.id + " się rozłącza");
	})
	client.on("login", function (data) {
	    client.broadcast.emit("login", { login: data.login });
	    client.id = data.login;
	    // Dane dla administratora
	    if (data.login == "admin" || data.login == "administrator") {
	        opers.SelectAndLimit(Models.Player, 100, function (data) {
	            console.log(data);
	            io.sockets.emit("allData", { data: data });
	        })
	    }
	    else {
	        opers.SelectLimitWhere(Models.Player, data.login, 100, function (data) {
	            console.log(data);
	            io.sockets.emit("thisData", { data: data });
	        })
	    }
	})
	client.on("save", function (data) {
		for (var i = 0; i < data.save.length; i++) {
			var user = new Models.Player(
				{
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
	})
	client.on("positions", function (data) {
	    client.broadcast.emit("positions", { posX: data.posX, posY: data.posY, posZ: data.posZ, myColor: data.myColor });
	})
	client.on("move", function (data) {
	    client.broadcast.emit("move", { posX: data.posX, posY: data.posY, posZ: data.posZ });
	})
	client.on("colors", function (data) {
	    client.broadcast.emit("colors", { myColor: data.myColor });
	})
	client.on("zoom", function (data) {
	    client.broadcast.emit("zoom", { zoom: data.zoom });
	})
	client.on("rotate", function (data) {
	    client.broadcast.emit("rotate", { rotate: data.rotate });
	})
	client.on("select", function (data) {
	    console.log("Zapis użytkownika: " + data.select)
	    if (data.select == "All") {
	        opers.SelectAndLimit(Models.Player, 100, function (data) {
	            console.log(data);
	            io.sockets.emit("userData", { data: data });
	        })
	    }
	    else {
	        opers.SelectLimitWhere(Models.Player, data.select, 100, function (data) {
	            console.log(data);
	            io.sockets.emit("userData", { data: data });
	        })
	    }
	})
})

// MongoDB
function connectToMongo() {
    db = mongoose.connection;
    // przy wystąpieniu błędu
    db.on("error", function () {
        console.log("Problem z Mongo")
    });
    // przy poprawnym połączeniu z bazą
    db.once("open", function () {
        console.log("Mongo jest podłączone - można wykonywać operacje na bazie");
        opers = new Operations();
    });
    // przy rozłączeniu z bazą
    db.once("close", function () {
        console.log("Mongo zostało odłączone");
    });
}
connectToMongo();

// Informacja przy starcie serwera
console.log("Serwer startuje na porcie 3000");