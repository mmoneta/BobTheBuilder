function Net() {
  client = io();
  var counter = 1, newBlock, importBlock, pozX, pozY, pozZ, myColor, user = ["All"], allObject = [];

  client.on("onconnect", function (data) {
    // console.log(data.clientName);
  })

  client.on("login", function (data) {
    document.getElementById("userInfo").innerHTML += "<p>" + data.login + "</p><br />";
  })

  client.on("positions", function (data) {
    if (introExist == false) {
	  newBlock = game.create(data.posX, data.posY, data.posZ, 1, data.myColor);
	  scene.add(newBlock);
	  pozX = data.posX;
	  pozY = data.posY;
	  pozZ = data.posZ;
	  myColor = data.myColor;
	}
  })

  client.on("move", function (data) {
    newBlock.position.x = data.posX;
	newBlock.position.y = data.posY;
	newBlock.position.z = data.posZ;
	pozX = data.posX;
	pozY = data.posY;
	pozZ = data.posZ;
  })

  client.on("colors", function (data) {
	newBlock.material.color.setHex(data.myColor);
	myColor = data.myColor;
  })

  client.on("zoom", function (data) {
    counter++;
	if (counter <= 4) {
	  scene.remove(newBlock);
	  newBlock = game.create(pozX, pozY, pozZ, counter, myColor);
	  scene.add(newBlock);
	}
	else {
	  scene.remove(newBlock);
	  newBlock = game.create(pozX, pozY, pozZ, 1, myColor);
	  scene.add(newBlock);
	  counter = 1;
	}
  })

  client.on("rotate", function (data) {
    newBlock.rotateY(Math.PI / 2);
  })

  client.on("allData", function (data) {
    if (adminState == true) {
	  for (var i = 0; i < data.data.length; i++) {
	    var exist = false;
	    var nick = data.data[i].nick;
	    for (var j = 0; j < user.length; j++) {
	      if (user[j] == nick) {
	        exist = true;
	      }
	    }
	    if (exist == false && nick != "admin" && nick != "administrator")
	      user.push(nick);
	    var pozX = data.data[i].pozX,
	    pozY = data.data[i].pozY,
	    pozZ = data.data[i].pozZ,
	    color = data.data[i].color,
	    size = data.data[i].size,
	    rotate = data.data[i].rotate,
	    importBlock = game.create(pozX, pozY,pozZ, size, color);
		scene.add(importBlock);
		if (rotate != 0) {
		  for (var j = 0; j < rotate; j++) {
		    importBlock.rotateY(Math.PI / 2);
		  }
		}
	    allObject.push(importBlock);
	  }
	  for (var j = 0; j < user.length; j++) {
	    if (user[j] == nick)
	      exist = true;
	  }
	  // Select user
	  var select = document.createElement('select');
	  select.id = "adminSelect";
	  select.setAttribute("name", "Users");
	  for (var i = 0; i < user.length; i++) {
	    select.options[select.options.length] = new Option(user[i], user[i]);
	  }
	  document.body.appendChild(select);
      select.addEventListener('change', function () {
        var selected = this.value;
        client.emit("select", {
          select: selected
        })
        for (var i = 0; i < allObject.length; i++) {
          scene.remove(allObject[i]);
        }
        allObject = [];
      });
    }
  });

  client.on("userData", function (data) {
    if (adminState == true) {
	  for (var i = 0; i < data.data.length; i++) {
	    var nick = data.data[i].nick,
	    pozX = data.data[i].pozX,
	    pozY = data.data[i].pozY,
	    pozZ = data.data[i].pozZ,
	    color = data.data[i].color,
	    size = data.data[i].size,
	    rotate = data.data[i].rotate,
	    importBlock = game.create(pozX, pozY,pozZ, size, color);
		scene.add(importBlock);
		if (rotate != 0) {
		  for (var j = 0; j < rotate; j++) {
		    importBlock.rotateY(Math.PI / 2);
		  }
	    }
	    allObject.push(importBlock);
	  }
	}
  });

  client.on("thisData", function (data) {
    if (adminState == false) {
	  for (var i = 0; i < data.data.length; i++) {
	    var nick = data.data[i].nick,
	    pozX = data.data[i].pozX,
	    pozY = data.data[i].pozY,
	    pozZ = data.data[i].pozZ,
	    color = data.data[i].color,
	    size = data.data[i].size,
	    rotate = data.data[i].rotate,
	    importBlock = game.create(pozX, pozY, pozZ, size, color);
		scene.add(importBlock);
		if (rotate != 0) {
		  for (var j = 0; j < rotate; j++) {
		    importBlock.rotateY(Math.PI / 2);
		  }
		}
		allObject.push(importBlock);
	  }
	}
  });
}