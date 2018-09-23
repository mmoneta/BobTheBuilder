function Block(myColor) {
	// Material
	if (myColor == null)
		var material = new THREE.MeshPhongMaterial({ color: parseInt(colors[color_counter]) });
	else
		var material = new THREE.MeshPhongMaterial({ color: parseInt(myColor) });
	// Geometry
    var geometryA = new THREE.BoxGeometry(50, 30, 50),
    geometryB = new THREE.CylinderGeometry(6.25, 6.25, 5, 32);
	// Create elements without material
    var cube = new THREE.Mesh(geometryA),
    cylinder1 = new THREE.Mesh(geometryB),
    cylinder2 = new THREE.Mesh(geometryB),
    cylinder3 = new THREE.Mesh(geometryB),
    cylinder4 = new THREE.Mesh(geometryB);
    // Set positions
    cube.position.set(0,15,0)
    cylinder1.position.set(-12.5, 32.5, -12.5)
    cylinder2.position.set(12.5, 32.5, -12.5)
    cylinder3.position.set(-12.5, 32.5, 12.5)
    cylinder4.position.set(12.5, 32.5, 12.5)
	// Create merged object
    var singleGeometry = new THREE.Geometry();
    cube.updateMatrix();
    singleGeometry.merge(cube.geometry, cube.matrix);
    cylinder1.updateMatrix(); 
    singleGeometry.merge(cylinder1.geometry, cylinder1.matrix);
    cylinder2.updateMatrix(); 
    singleGeometry.merge(cylinder2.geometry, cylinder2.matrix);
    cylinder3.updateMatrix(); 
    singleGeometry.merge(cylinder3.geometry, cylinder3.matrix);
    cylinder4.updateMatrix(); 
    singleGeometry.merge(cylinder4.geometry, cylinder4.matrix);
    var singleMesh = new THREE.Mesh(singleGeometry, material);
	return singleMesh;
}