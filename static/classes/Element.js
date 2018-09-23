function Element(posX, posZ, step) {
  // Material
  var lineMaterial = new THREE.LineBasicMaterial({ color: 0x000000 });
  // Geometry
  var geometry = new THREE.Geometry();
  geometry.vertices.push(new THREE.Vector3(0, 0, 0));
  geometry.vertices.push(new THREE.Vector3(step, 0, 0));
  geometry.vertices.push(new THREE.Vector3(step, 0, step));
  geometry.vertices.push(new THREE.Vector3(0, 0, step));
  geometry.vertices.push(new THREE.Vector3(0, 0, 0));
  // Line
  var line = new THREE.Line(geometry, lineMaterial);
  line.position.set(posX - step / 2, 0, posZ - step / 2)
  line.name = "line"
  var fill_material = new THREE.MeshPhongMaterial({ color: 0x3f9f62, side: THREE.DoubleSide }),
  plane_geometry = new THREE.PlaneGeometry(step, step, 1),
  cylinder_geometry = new THREE.CylinderGeometry(6.25, 6.25, 7, 32),
  plane = new THREE.Mesh(plane_geometry),
  cylinder1 = new THREE.Mesh(cylinder_geometry),
  cylinder2 = new THREE.Mesh(cylinder_geometry),
  cylinder3 = new THREE.Mesh(cylinder_geometry),
  cylinder4 = new THREE.Mesh(cylinder_geometry);
  // Set positions
  plane.position.set(0, 0, 0)
  plane.rotateX(Math.PI / 2);
  cylinder1.position.set(-12.5, 2.5, -12.5);
  cylinder2.position.set(12.5, 2.5, -12.5);
  cylinder3.position.set(-12.5, 2.5, 12.5);
  cylinder4.position.set(12.5, 2.5, 12.5);
  var singleGeometry = new THREE.Geometry();
  plane.updateMatrix();
  singleGeometry.merge(plane.geometry, plane.matrix);
  cylinder1.updateMatrix();
  singleGeometry.merge(cylinder1.geometry, cylinder1.matrix);
  cylinder2.updateMatrix();
  singleGeometry.merge(cylinder2.geometry, cylinder2.matrix);
  cylinder3.updateMatrix();
  singleGeometry.merge(cylinder3.geometry, cylinder3.matrix);
  cylinder4.updateMatrix();
  singleGeometry.merge(cylinder4.geometry, cylinder4.matrix);
  var fillMesh = new THREE.Mesh(singleGeometry, fill_material);
  fillMesh.position.set(posX, 0, posZ);
  fillMesh.castShadow = true;
  fillMesh.receiveShadow = true;
  fillMesh.name = "fillMesh";
  scene.add(fillMesh);
}