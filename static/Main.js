function Main() {
	// Initializing variables
	var pozX, pozY, pozZ, counter, currentBlock;
	var options = false;
	var block = false;
	var rotateCounter = 0;

	// View
    degreeVertical = 400;
    degreeHorizontal = 4.2;
    distance = 1600;
    centre = new THREE.Vector3(0, 0, 0);

	// Scene
    scene = new THREE.Scene();

	// Orthographic Camera
    camera = new THREE.OrthographicCamera(
		(window.innerWidth) / -2,
		(window.innerWidth) / 2,
		(window.innerHeight-5) / 2,
		(window.innerHeight-5) / -2,
		-10000,
		10000
	);

	// Renderer
    var renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setClearColor(0x000000, 0);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMapEnabled = true;
    renderer.shadowMapType = THREE.PCFSoftShadowMap;

	// Raycasting
    raycaster = new THREE.Raycaster(); // obiekt symulujący "rzucanie" promieni
    mouseVector = new THREE.Vector2();
	var currentBlock = '';
    document.getElementById("field").appendChild(renderer.domElement);

    // Lights
    var redLight = new THREE.SpotLight(0xff0000, 3, 2000, 3.14);
    redLight.position.set(700, 200, 800);
    redLight.lookAt(centre);
    scene.add(redLight);

    var greenLight = new THREE.SpotLight(0x00ff00, 3, 2000, 3.14);
    greenLight.position.set(-700, 200, 800);
    greenLight.lookAt(centre);
    scene.add(greenLight);

    var blueLight = new THREE.SpotLight(0x0000ff, 3, 1200, 3.14);
    blueLight.position.set(0, 200, 800);
    blueLight.lookAt(centre);
    scene.add(blueLight);

	// Intro
    var intro = new Intro(renderer);

	// Camera position
    camera.position.x = Math.cos(degreeHorizontal / Math.PI) * distance;
    camera.position.y = degreeVertical;
    camera.position.z = Math.sin(degreeHorizontal / Math.PI) * distance;
    camera.lookAt(centre);

	// Log in
    document.getElementById("login").addEventListener("click", function () {
    	userName = document.getElementById("username").value;
        if (userName != '') {
            client.emit("login", {
                login: userName
            })
            options = true;
            document.getElementById("loginScreen").style.display = "none";
        }
        switch(userName) {
        	case "admin":
        	case "administrator":
            	adminState = true;
		        break;
        	default:
            	adminState = false;
            	document.getElementById("save").style.display = "none";
				break;
        }
	})

	// Events
    document.addEventListener("mousedown", function(event) {
        mouseVector.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouseVector.y = -(event.clientY / (window.innerHeight - 5)) * 2 + 1;
        raycaster.setFromCamera(mouseVector, camera);
        var intersects = raycaster.intersectObjects(scene.children, true);
        if (intersects.length > 0) {
            var selectedObject = scene.getObjectByName("intro");
            if (intersects[0].object == selectedObject) {
				document.getElementById("loginScreen").style.display = "block";
                scene.remove(selectedObject);
                scene.remove(greenLight);
                scene.remove(redLight);
                scene.remove(blueLight);
                introExist = false;
				game = new Game();
                var light = new THREE.SpotLight(0xffffff, 3, 5000, 3.14);
                light.position.set(800, 1200, 800);
                light.castShadow = true;
                light.shadowDarkness = 0.8;
                light.lookAt(centre);
                scene.add(light);
            }
			if (options == true && block == false) {
				var obj = intersects[0].object;
				var counter = 0;
				switch (event.button) {	
					// adding new block
					case 0:
						if (obj.name != "line" && obj.name == "fillMesh") {
							currentBlock = game.create(obj.position.x, 0, obj.position.z, 1);
							scene.add(currentBlock);
							client.emit("positions", {
								id: currentBlock.id,
								posX: obj.position.x,
								posY: 0,
								posZ: obj.position.z,
								myColor: colors[color_counter]
							})
							counter = 1;
							pozX = obj.position.x;
							pozY = 0;
							pozZ = obj.position.z;
						}
						else if (obj.name != "line" && obj.name == "klocek") {
							var exist = false;
							for (var i = 0; i < scene.children.length; i++) {
								if (scene.children[i].position.x == obj.position.x && scene.children[i].position.z == obj.position.z && scene.children[i].position.y == obj.position.y + 30) {
									exist = true;
									break;
								}
							}
							if (exist == false) {
								currentBlock = game.create(obj.position.x, obj.position.y + 30, obj.position.z, 1);
								scene.add(currentBlock);
								counter = 1;
								pozX = obj.position.x;
								pozY = obj.position.y + 30;
								pozZ = obj.position.z;
								if (adminState == false) {
								    client.emit("positions", {
								        posX: pozX,
								        posY: pozY,
								        posZ: pozZ,
								        myColor: colors[color_counter]
								    })
								}
							}
						}
						break;
					// select current block
					case 1: 
						if (obj.name == "klocek") {
							currentBlock = obj;
						}
						break;
					// remove current block
					case 2:
						for (var i = 0; i < scene.children.length; i++) {
							if (obj.name == "klocek" && scene.children[i].name == "klocek" && scene.children[i].position.x == obj.position.x && scene.children[i].position.z == obj.position.z && (scene.children[i].position.y < obj.position.y || obj.position.y == 0)) {
								counter++;
								break;
							}
						}
						for (var i = 0; i < scene.children.length; i++) {
							if (obj.name == "klocek" && scene.children[i].name == "klocek" && scene.children[i].position.x == obj.position.x && scene.children[i].position.z == obj.position.z && scene.children[i].position.y > obj.position.y) {
								counter--;
								break;
							}
						}
						if (counter == 1)
							scene.remove(obj);
						break;
				}
			}
        }
    })

    function move() {
    	if (adminState == false) {
	        client.emit("move", {
	            posX: currentBlock.position.x,
	            posY: currentBlock.position.y,
	            posZ: currentBlock.position.z
	        })
	    }
    }

	// Keybord
	document.addEventListener("keydown", function(event) {
        var keyCode = event.which;
        switch (keyCode) {
			// Color change (C)
            case 67:
                color_counter++;
                if (color_counter == 4) 
					color_counter = 0;
                if (currentBlock != null) {
					currentBlock.material.color.setHex(colors[color_counter]);
					currentBlock.userData.color = colors[color_counter];
				}
				if (adminState == false) {
				    client.emit("colors", {
				        myColor: colors[color_counter]
				    })
				}
                break;
			//  Positioning of camera (arrows)
            case 37:
                degreeHorizontal += 0.1;
                camera.position.x = Math.cos(degreeHorizontal / Math.PI) * distance;
                camera.position.z = Math.sin(degreeHorizontal / Math.PI) * distance;
                camera.lookAt(centre);
                break;
            case 39:
                degreeHorizontal -= 0.1;
                camera.position.x = Math.cos(degreeHorizontal / Math.PI) * distance;
                camera.position.z = Math.sin(degreeHorizontal / Math.PI) * distance;
                camera.lookAt(centre);
                break;
            case 38:
                degreeVertical += 20;
                camera.position.y = degreeVertical;
                camera.lookAt(centre);
                break;
            case 40:
                degreeVertical -= 20;
                camera.position.y = degreeVertical;
                camera.lookAt(centre);
                break;
			// Positioning (WSAD)
			case 87:
			    currentBlock.position.z -= 25;
				currentBlock.userData.pozZ -= 25;
			    move();
                break;
            case 83:
                currentBlock.position.z += 25;
				currentBlock.userData.pozZ += 25;
			    move();
                break;
            case 65:
                currentBlock.position.x -= 25;
				currentBlock.userData.pozX -= 25;
			    move();
                break;
            case 68:
                currentBlock.position.x += 25;
				currentBlock.userData.pozX += 25;
			    move();
                break;
			//  Resizing (T)
			case 84:
				counter++;
				var rotate = currentBlock.userData.rotate;
				if (counter <= 4) {
					scene.remove(currentBlock);
					currentBlock = game.create(pozX, pozY, pozZ, counter);
					scene.add(currentBlock);
				}
				else {
					scene.remove(currentBlock);
					currentBlock = game.create(pozX, pozY, pozZ, 1);
					scene.add(currentBlock);
					counter = 1;
				}
				currentBlock.userData.size = counter;
				currentBlock.userData.rotate = rotate;
				for (var i = 0; i < rotate; i++) {
					currentBlock.rotateY(Math.PI / 2);
				}
				if (adminState == false) {
				    client.emit("zoom", {
				        zoom: "yes"
				    })
				}
                break;
			// Rotate (Q)
			case 81:
			    currentBlock.rotateY(Math.PI / 2);
			    if (adminState == false) {
			        client.emit("rotate", {
			            rotate: "yes"
			        })
					if (rotateCounter <= 2) {
						rotateCounter++;
					}
					else {
						rotateCounter = 0;
					}
					currentBlock.userData.rotate = rotateCounter;
			    }
                break;
			// Information about other active users
			case 85:
				if (options == true) {
					document.getElementById("statements").style.display = "block";
					block = true;
				}
                break;
        }
    })

	document.addEventListener("keyup", function(event) {
		var keyCode = event.which;
        switch (keyCode) {
			case 85:
				if (options == true) {
					document.getElementById("statements").style.display = "none";
					block = false;
				}
				break;
		}
	})

	// Save data on server
	var save = [];
    document.getElementById("save").addEventListener("click", function () {
		save = [];
        for (var i = 0; i < scene.children.length; i++) {
			var validate = true;
			for (var j = 0; j < save.length; j++) {
				if (scene.children[i].userData.pozX == save[j].pozX && scene.children[i].userData.pozY == save[j].pozY && scene.children[i].userData.pozZ == save[j].pozZ) {
					validate = false;
				}
			}
			if (scene.children[i].name == "klocek" && validate == true) {
				if (scene.children[i].userData.pozX != null && scene.children[i].userData.pozY != null && scene.children[i].userData.pozZ != null && scene.children[i].userData.size != null && scene.children[i].userData.color != null && scene.children[i].userData.rotate != null)
				save.push({ nick: userName, pozX: scene.children[i].userData.pozX, pozY: scene.children[i].userData.pozY, pozZ: scene.children[i].userData.pozZ, size: scene.children[i].userData.size, color: scene.children[i].userData.color, rotate: scene.children[i].userData.rotate });
			}
		}
		client.emit("save", {
			save: save
		})
	})
}