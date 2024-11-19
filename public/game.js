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
const groundGeometry = new THREE.PlaneGeometry(16.67, 500); // 2/3 of the original 25 width
const groundMaterial = new THREE.MeshBasicMaterial({ color: 0xEAEAEA, side: THREE.DoubleSide });
const ground = new THREE.Mesh(groundGeometry, groundMaterial);
ground.rotation.x = -Math.PI / 2;
ground.position.set(0, 0, -250); // Centered to cover a large area
scene.add(ground);

// Ground physics body
const groundBody = new CANNON.Body({
    mass: 0, // Static body
    shape: new CANNON.Plane()
});
groundBody.quaternion.setFromEuler(-Math.PI / 2, 0, 0); // Rotate to match the ground orientation
world.addBody(groundBody);

scene.background = new THREE.Color(0x87ceeb); // Light blue sky color

// Border Material
const borderMaterial = new THREE.MeshBasicMaterial({ color: 0x964B00 }); // Brown color for the borders

// Left Border
const leftBorderGeometry = new THREE.BoxGeometry(0.5, 5, 500); // Long segment
const leftBorder = new THREE.Mesh(leftBorderGeometry, borderMaterial);
leftBorder.position.set(-8.33, 2.5, -250); // 2/3 of the original -12.5 position
scene.add(leftBorder);

// Left border physics body
const leftBorderBody = new CANNON.Body({
    mass: 0, // Static body
    shape: new CANNON.Box(new CANNON.Vec3(0.25, 2.5, 250)) // Half extents of the box
});
leftBorderBody.position.set(-8.33, 2.5, -250);
world.addBody(leftBorderBody);

// Right Border
const rightBorderGeometry = new THREE.BoxGeometry(0.5, 5, 500); // Long segment
const rightBorder = new THREE.Mesh(rightBorderGeometry, borderMaterial);
rightBorder.position.set(8.33, 2.5, -250); // 2/3 of the original 12.5 position
scene.add(rightBorder);

// Right border physics body
const rightBorderBody = new CANNON.Body({
    mass: 0, // Static body
    shape: new CANNON.Box(new CANNON.Vec3(0.25, 2.5, 250)) // Half extents of the box
});
rightBorderBody.position.set(8.33, 2.5, -250);
world.addBody(rightBorderBody);

let obstacles = []; // Store obstacles for management

function generateTree(zPosition) {
    // Tree Trunk
    const trunkGeometry = new THREE.CylinderGeometry(0.2, 0.2, 1, 8);
    const trunkMaterial = new THREE.MeshBasicMaterial({ color: 0x8B4513 }); // Brown color
    const trunk = new THREE.Mesh(trunkGeometry, trunkMaterial);
    trunk.position.set((Math.random() - 0.5) * 16.67, 0.5, zPosition);
    scene.add(trunk);

    // Tree Leaves
    const leavesGeometry = new THREE.ConeGeometry(0.5, 1.5, 8);
    const leavesMaterial = new THREE.MeshBasicMaterial({ color: 0x228B22 }); // Green color
    const leaves = new THREE.Mesh(leavesGeometry, leavesMaterial);
    leaves.position.set(trunk.position.x, 1.25, zPosition);
    scene.add(leaves);

    // Tree physics body
    const treeBody = new CANNON.Body({
        mass: 0, // Static body
        shape: new CANNON.Cylinder(0.2, 0.2, 1, 8) // Same shape as the trunk
    });
    treeBody.position.set(trunk.position.x, 0.5, zPosition);
    world.addBody(treeBody);
    obstacles.push(trunk); // Add to obstacles array for management
}

function generateJump(zPosition) {
    // Jump ramp
    const jumpGeometry = new THREE.BoxGeometry(3, 0.5, 2);
    const jumpMaterial = new THREE.MeshBasicMaterial({ color: 0xD3D3D3 }); // Grey color
    const jump = new THREE.Mesh(jumpGeometry, jumpMaterial);
    jump.position.set((Math.random() - 0.5) * 16.67, 0.25, zPosition);
    jump.rotation.x = Math.PI / 8; // Tilt the ramp upward
    scene.add(jump);

    // Jump physics body
    const jumpBody = new CANNON.Body({
        mass: 0, // Static body
        shape: new CANNON.Box(new CANNON.Vec3(1.5, 0.25, 1)) // Half extents of the box
    });
    jumpBody.position.set(jump.position.x, 0.25, zPosition);
    jumpBody.quaternion.setFromEuler(Math.PI / 8, 0, 0); // Rotate to match the visual ramp
    world.addBody(jumpBody);
    obstacles.push(jump); // Add to obstacles array for management
}

function manageObstacles() {
    while (obstacles.length < 10) {
        const zPosition = skier.position.z - (Math.random() * 30 + 10); // Obstacles start appearing close to the skier
        if (Math.random() > 0.5) {
            generateTree(zPosition); // 50% chance to generate a tree
        } else {
            generateJump(zPosition); // 50% chance to generate a jump
        }
    }

    obstacles = obstacles.filter(obstacle => {
        if (obstacle.position.z > skier.position.z + 50) {
            scene.remove(obstacle);
            return false;
        }
        return true;
    });
}

let velocityX = 0;
let velocityZ = -0.1; // Initial speed
let speedIncreaseRate = 0.0005; // Rate at which speed increases

function animate() {
    requestAnimationFrame(animate);

    // Increase skier's velocity over time
    velocityZ -= speedIncreaseRate; // Make velocityZ more negative to increase speed

    // Update physics
    world.step(1 / 60);

    // Move the skier forward automatically
    skierBody.position.z += velocityZ;
    skierBody.position.x += velocityX;

    // Update skier position
    skier.position.copy(skierBody.position);

    // Keep the camera centered on the skier
    camera.position.set(skier.position.x, skier.position.y + 5, skier.position.z + 10);
    camera.lookAt(skier.position);

    manageObstacles();

    // Render the scene
    renderer.render(scene, camera);

    // Example controls
    document.addEventListener('keydown', (event) => {
        if (event.key === 'a') {
            velocityX = -0.1; // Glide left
        }
        if (event.key === 'd') {
            velocityX = 0.1; // Glide right
        }
    });

    document.addEventListener('keyup', (event) => {
        if (event.key === 'a' || event.key === 'd') {
            velocityX = 0; // Stop movement
        }
    });
}

animate();
