const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('gameCanvas') });
renderer.setSize(window.innerWidth, window.innerHeight);

// Position the camera behind and above the skier
camera.position.set(0, 5, 10);
camera.lookAt(0, 0, 0);

const skierGeometry = new THREE.BoxGeometry(0.5, 1, 0.5); // Simple box for the skier
const skierMaterial = new THREE.MeshBasicMaterial({ color: 0x000000 });
const skier = new THREE.Mesh(skierGeometry, skierMaterial);
scene.add(skier);

// Skier physics body
const world = new CANNON.World();
world.gravity.set(0, -9.82, 0); // Gravity
const skierBody = new CANNON.Body({
    mass: 5,
    position: new CANNON.Vec3(0, 5, 0), // Start position
    shape: new CANNON.Box(new CANNON.Vec3(0.25, 0.5, 0.25))
});
world.addBody(skierBody);

// Ground
const groundGeometry = new THREE.PlaneGeometry(25, 50);
const groundMaterial = new THREE.MeshBasicMaterial({ color: 0xEAEAEA, side: THREE.DoubleSide });
const ground = new THREE.Mesh(groundGeometry, groundMaterial);
ground.rotation.x = -Math.PI / 2;
scene.add(ground);

scene.background = new THREE.Color(0x87ceeb); // Example: Light blue sky color


// Ground physics body
const groundBody = new CANNON.Body({
    mass: 0,
    shape: new CANNON.Plane()
});
groundBody.quaternion.setFromEuler(-Math.PI / 2, 0, 0);
world.addBody(groundBody);

// Example obstacle
const obstacleGeometry = new THREE.BoxGeometry(1, 1, 1);
const obstacleMaterial = new THREE.MeshBasicMaterial({ color: 0x964B00 });
const obstacle = new THREE.Mesh(obstacleGeometry, obstacleMaterial);
obstacle.position.set(0, 0.5, -10); // Place it on the path
scene.add(obstacle);

// Create a geometry to hold the trail points
const trailGeometry = new THREE.BufferGeometry();
const trailMaterial = new THREE.LineBasicMaterial({ color: 0xffffff }); // White trail

// Start with an empty array of points
const trailPoints = [];
trailGeometry.setFromPoints(trailPoints);

// Create the line object and add it to the scene
const skiTrail = new THREE.Line(trailGeometry, trailMaterial);
scene.add(skiTrail);

let groundSegments = []; // Store ground segments for management

function generateGroundSegment(zPosition) {
    const groundGeometry = new THREE.PlaneGeometry(25, 50);
    const groundMaterial = new THREE.MeshBasicMaterial({ color: 0xEAEAEA, side: THREE.DoubleSide });
    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotation.x = -Math.PI / 2;
    ground.position.set(0, 0, zPosition);
    scene.add(ground);
    groundSegments.push(ground);
}

// Initial ground segments
for (let i = 0; i < 5; i++) {
    generateGroundSegment(-i * 50); // Place segments along the z-axis
}

function manageGround() {
    if (skier.position.z < groundSegments[0].position.z + 50) {
        // Remove the oldest segment
        scene.remove(groundSegments[0]);
        groundSegments.shift();

        // Add a new segment at the end
        const newZPosition = groundSegments[groundSegments.length - 1].position.z - 50;
        generateGroundSegment(newZPosition);
    }
}

let obstacles = []; // Store obstacles for management

function generateObstacle(zPosition) {
    const obstacleGeometry = new THREE.BoxGeometry(1, 1, 1);
    const obstacleMaterial = new THREE.MeshBasicMaterial({ color: 0x964B00 });
    const obstacle = new THREE.Mesh(obstacleGeometry, obstacleMaterial);
    obstacle.position.set((Math.random() - 0.5) * 20, 0.5, zPosition); // Random x position within bounds
    scene.add(obstacle);
    obstacles.push(obstacle);
}

function manageObstacles() {
    // Generate obstacles as the skier moves
    if (obstacles.length < 10) {
        const zPosition = skier.position.z - (Math.random() * 100 + 50);
        generateObstacle(zPosition);
    }

    // Remove obstacles that are too far behind the skier
    obstacles = obstacles.filter(obstacle => {
        if (obstacle.position.z > skier.position.z + 50) {
            scene.remove(obstacle);
            return false;
        }
        return true;
    });
}

let velocityX = 0;
let velocityZ = -0.1;

// Border Material
const borderMaterial = new THREE.MeshBasicMaterial({ color: 0xEAEAEAa }); // Brown color for the borders

// Left Border
const leftBorderGeometry = new THREE.BoxGeometry(0.5, 5, 50); // Thin, tall wall
const leftBorder = new THREE.Mesh(leftBorderGeometry, borderMaterial);
leftBorder.position.set(-12.5, 2.5, 0); // Position it on the left edge
scene.add(leftBorder);

// Create a Cannon.js body for the left border
const leftBorderBody = new CANNON.Body({
    mass: 0, // Static body
    shape: new CANNON.Box(new CANNON.Vec3(0.25, 2.5, 25)) // Half extents of the box
});
leftBorderBody.position.set(-12.5, 2.5, 0);
world.addBody(leftBorderBody);

// Right Border
const rightBorderGeometry = new THREE.BoxGeometry(0.5, 5, 50); // Thin, tall wall
const rightBorder = new THREE.Mesh(rightBorderGeometry, borderMaterial);
rightBorder.position.set(12.5, 2.5, 0); // Position it on the right edge
scene.add(rightBorder);

// Create a Cannon.js body for the right border
const rightBorderBody = new CANNON.Body({
    mass: 0, // Static body
    shape: new CANNON.Box(new CANNON.Vec3(0.25, 2.5, 25)) // Half extents of the box
});
rightBorderBody.position.set(12.5, 2.5, 0);
world.addBody(rightBorderBody);

// Grey outline material
const outlineMaterial = new THREE.LineBasicMaterial({ color: 0x808080 }); // Grey color

// Add outline to the left border
const leftBorderEdges = new THREE.EdgesGeometry(leftBorderGeometry);
const leftBorderOutline = new THREE.LineSegments(leftBorderEdges, outlineMaterial);
leftBorderOutline.position.copy(leftBorder.position); // Match position
scene.add(leftBorderOutline);

// Add outline to the right border
const rightBorderEdges = new THREE.EdgesGeometry(rightBorderGeometry);
const rightBorderOutline = new THREE.LineSegments(rightBorderEdges, outlineMaterial);
rightBorderOutline.position.copy(rightBorder.position); // Match position
scene.add(rightBorderOutline);

function animate() {
    requestAnimationFrame(animate);

    // Update physics
    world.step(1 / 60);

    // Move the skier forward automatically
    skierBody.position.z += velocityZ;
    skierBody.position.x += velocityX;

    // Update skier position
    skier.position.copy(skierBody.position);

    // Add the skier's current position to the trail
    trailPoints.push(new THREE.Vector3(skier.position.x, 0.01, skier.position.z)); // Keep y close to the ground
    if (trailPoints.length > 100) { // Limit the number of points to avoid performance issues
        trailPoints.shift();
    }

    trailGeometry.setFromPoints(trailPoints);

    // Keep the camera centered on the skier
    camera.position.set(skier.position.x, skier.position.y + 5, skier.position.z + 10); // Adjust camera position to follow skier
    camera.lookAt(skier.position);

    manageGround();
    manageObstacles();

    // Render the scene
    renderer.render(scene, camera);

    // Example of simple left/right controls (using WASD or arrow keys)
    document.addEventListener('keydown', (event) => {
        if (event.key === 'a') {
            velocityX = -0.1; // Smoothly glide left
        }
        if (event.key === 'd') {
            velocityX = 0.1; // Smoothly glide right
        }
    });

    document.addEventListener('keyup', (event) => {
        if (event.key === 'a' || event.key === 'd') {
            velocityX = 0; // Stop movement when key is released
        }
    });
}

animate();
