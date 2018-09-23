function Intro(renderer) {
  // Material
  this.material = new THREE.MeshPhongMaterial({
    specular: 0x000000,
    shininess: 100,
    side: THREE.DoubleSide,
  });

  // Geometry
  this.textGeometry = new THREE.TextGeometry(
    "Bob The Builder", {
    font: "benchnine",
    size: 160,
    height: 60
  });

  // Object of text
  this.text = new THREE.Mesh(this.textGeometry, this.material);
  this.text.position.x = -500;
  this.text.position.y = -30;
  this.text.name = "intro";
  scene.add(this.text);
  camera.lookAt(this.text.position);

  // Animation
  var that = this;
  this.animateScene = function() {
    requestAnimationFrame(that.animateScene);
    renderer.render(scene, camera);
  }

  this.animateScene();
}