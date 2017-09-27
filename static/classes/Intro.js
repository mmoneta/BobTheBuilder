function Intro() {
	// Materiał
    var material = new THREE.MeshPhongMaterial({
        specular: 0x000000,
        shininess: 100,
        side: THREE.DoubleSide,
    })
	// Geometria
    var textGeometry = new THREE.TextGeometry(
        "Bob The Builder", {
            font: "benchnine",
            size: 160,
            height: 60
    });
    // Obiekt
    var text = new THREE.Mesh(textGeometry, material);
    text.position.x = -500;
    text.position.y = -30;
    text.name = "intro";
    scene.add(text);
    camera.lookAt(text.position)
	// Animacja
    function animateScene() {
        requestAnimationFrame(animateScene);
        renderer.render(scene, camera);
    }
    animateScene();
}