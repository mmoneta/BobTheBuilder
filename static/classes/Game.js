function Game() {
  colors = ["0xfec400", "0xe76318", "0xde000d", "0xde378b", "0x9c006b", "0x0057a8", "0x87c0ea", "0x007b28", "0x95b90b", "0x5b1c0c", "0xf4f4f4", "0x010101"];
  color_counter = 0;
  var width = 1000,
  height = 1000,
  step = 50,
  pointX = height / 2 - height,
  pointZ = width / 2 - width;

  // Field
  for (var i = 0; i < width; i += step) {
    for (var j = 0; j < height; j += step) {
      Element(pointX + i, pointZ + j, step)
    }
  }
  
  this.create = function (posX, posY, posZ, size, myColor) {
    // Material
    if (myColor == null)
      var material = new THREE.MeshPhongMaterial({ color: parseInt(colors[color_counter]) });
    else
      var material = new THREE.MeshPhongMaterial({ color: parseInt(myColor) });
    // Merge elements
    var singleGeometry = new THREE.Geometry();
    for (var i = 0; i < size; i++) {
      var newElement = new Block(myColor)
      newElement.position.set(0, 0, i * 50)
      newElement.updateMatrix();
      singleGeometry.merge(newElement.geometry, newElement.matrix)
    }
    var singleMesh = new THREE.Mesh(singleGeometry, material);
    singleMesh.position.set(posX, posY, posZ);
    singleMesh.name = "block";
    singleMesh.userData = { pozX: posX, pozY: posY, pozZ: posZ, color: colors[color_counter], size: size, rotate: 0 }
    return singleMesh;
  }
}