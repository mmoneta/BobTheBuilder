function Klocek(myColor) {
	// Materiał
	if (myColor == null) {
		var material = new THREE.MeshPhongMaterial({ color: parseInt(colors[color_counter]) });
	} 
	else {
		var material = new THREE.MeshPhongMaterial({ color: parseInt(myColor) });
	}
	// Geometrie
    var geometryA = new THREE.BoxGeometry(50, 30, 50);
    var geometryB = new THREE.CylinderGeometry(6.25, 6.25, 5, 32);
	// Tworzenie elementów bez materiału
    var cube = new THREE.Mesh(geometryA) 
    var cylinder1 = new THREE.Mesh(geometryB);
    var cylinder2 = new THREE.Mesh(geometryB);
    var cylinder3 = new THREE.Mesh(geometryB);
    var cylinder4 = new THREE.Mesh(geometryB);
    // Ustawiamy ich pozycje
    cube.position.set(0,15,0)
    cylinder1.position.set(-12.5, 32.5, -12.5)
    cylinder2.position.set(12.5, 32.5, -12.5)
    cylinder3.position.set(-12.5, 32.5, 12.5)
    cylinder4.position.set(12.5, 32.5, 12.5)
	// Tworzenie scalonego obiektu
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
	// Obiekt zwracany
	return singleMesh;
}