function Intro(renderer) {
	// Material
    var material = new THREE.MeshPhongMaterial({
        specular: 0x000000,
        shininess: 100,
        side: THREE.DoubleSide,
    })
	// Geometry
    var textGeometry = new THREE.TextGeometry(
        "Bob The Builder", {
            font: "benchnine",
            size: 160,
            height: 60
    });
    // Object of text
    var text = new THREE.Mesh(textGeometry, material);
    text.position.x = -500;
    text.position.y = -30;
    text.name = "intro";
    scene.add(text);
    camera.lookAt(text.position)
	// Animation
    function animateScene() {
        requestAnimationFrame(animateScene);
        renderer.render(scene, camera);
    }
    animateScene();
}