// Create the scene, camera, and renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);
const renderer = new THREE.WebGLRenderer({
    canvas: document.getElementById('gameCanvas'),
});
renderer.setSize(window.innerWidth, window.innerHeight);

// Set camera position
camera.position.set(0, 5, 10);
camera.lookAt(0, 0, 0);

// Create a new skier model using a group
const skier = new THREE.Group();

// Head
const headGeometry = new THREE.SphereGeometry(0.25, 16, 16);
const headMaterial = new THREE.MeshBasicMaterial({ color: 0xFDD7AA });
const head = new THREE.Mesh(headGeometry, headMaterial);
head.position.set(0, 1.5, 0);
skier.add(head);

// Body
const bodyGeometry = new THREE.CylinderGeometry(0.2, 0.2, 0.75, 16);
const bodyMaterial = new THREE.MeshBasicMaterial({ color: 0x0000FF });
const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
body.position.set(0, 0.75, 0);
skier.add(body);

// Legs
const legGeometry = new THREE.CylinderGeometry(0.1, 0.1, 0.5, 16);
const legMaterial = new THREE.MeshBasicMaterial({ color: 0x000000 });

const leftLeg = new THREE.Mesh(legGeometry, legMaterial);
leftLeg.position.set(-0.1, 0.25, 0);
leftLeg.rotation.z = Math.PI / 12;
skier.add(leftLeg);

const rightLeg = new THREE.Mesh(legGeometry, legMaterial);
rightLeg.position.set(0.1, 0.25, 0);
rightLeg.rotation.z = -Math.PI / 12;
skier.add(rightLeg);

// Skis
const skiGeometry = new THREE.BoxGeometry(0.1, 0.05, 1);
const skiMaterial = new THREE.MeshBasicMaterial({ color: 0x8B4513 });

const leftSki = new THREE.Mesh(skiGeometry, skiMaterial);
leftSki.position.set(-0.15, 0, 0.3);
skier.add(leftSki);

const rightSki = new THREE.Mesh(skiGeometry, skiMaterial);
rightSki.position.set(0.15, 0, 0.3);
skier.add(rightSki);

// Add the skier to the scene
scene.add(skier);

// Initialize the physics world
const world = new CANNON.World();
world.gravity.set(0, -9.82, 0);

// Update the skier's physics body
const skierBody = new CANNON.Body({
    mass: 5,
    position: new CANNON.Vec3(0, 1, 0),
    shape: new CANNON.Box(new CANNON.Vec3(0.25, 1.5, 0.25)), // Adjusted to match skier's height
});
world.addBody(skierBody);

// Create the ground
const groundGeometry = new THREE.PlaneGeometry(16.67, 500);
const groundMaterial = new THREE.MeshBasicMaterial({
    color: 0xEAEAEA,
    side: THREE.DoubleSide,
});
const ground = new THREE.Mesh(groundGeometry, groundMaterial);
ground.rotation.x = -Math.PI / 2;
ground.position.set(0, 0, -250);
scene.add(ground);

const groundBody = new CANNON.Body({
    mass: 0,
    shape: new CANNON.Plane(),
});
groundBody.quaternion.setFromEuler(-Math.PI / 2, 0, 0);
world.addBody(groundBody);

// Set the background color
scene.background = new THREE.Color(0x87ceeb);

// Create borders
const borderMaterial = new THREE.MeshBasicMaterial({ color: 0x964B00 });

const leftBorderGeometry = new THREE.BoxGeometry(0.5, 5, 500);
const leftBorder = new THREE.Mesh(leftBorderGeometry, borderMaterial);
leftBorder.position.set(-8.33, 2.5, -250);
scene.add(leftBorder);

const leftBorderBody = new CANNON.Body({
    mass: 0,
    shape: new CANNON.Box(new CANNON.Vec3(0.25, 2.5, 250)),
});
leftBorderBody.position.set(-8.33, 2.5, -250);
world.addBody(leftBorderBody);

const rightBorderGeometry = new THREE.BoxGeometry(0.5, 5, 500);
const rightBorder = new THREE.Mesh(rightBorderGeometry, borderMaterial);
rightBorder.position.set(8.33, 2.5, -250);
scene.add(rightBorder);

const rightBorderBody = new CANNON.Body({
    mass: 0,
    shape: new CANNON.Box(new CANNON.Vec3(0.25, 2.5, 250)),
});
rightBorderBody.position.set(8.33, 2.5, -250);
world.addBody(rightBorderBody);

// Obstacles array
let obstacles = [];

// Function to generate trees
function generateTree(zPosition) {
    const trunkGeometry = new THREE.CylinderGeometry(0.2, 0.2, 1, 8);
    const trunkMaterial = new THREE.MeshBasicMaterial({ color: 0x8B4513 });
    const trunk = new THREE.Mesh(trunkGeometry, trunkMaterial);
    trunk.position.set((Math.random() - 0.5) * 16.67, 0.5, zPosition);
    scene.add(trunk);

    const leavesGeometry = new THREE.ConeGeometry(0.5, 1.5, 8);
    const leavesMaterial = new THREE.MeshBasicMaterial({ color: 0x228B22 });
    const leaves = new THREE.Mesh(leavesGeometry, leavesMaterial);
    leaves.position.set(trunk.position.x, 1.25, zPosition);
    scene.add(leaves);

    const treeBody = new CANNON.Body({
        mass: 0,
        shape: new CANNON.Cylinder(0.2, 0.2, 1, 8),
    });
    treeBody.position.set(trunk.position.x, 0.5, zPosition);
    world.addBody(treeBody);
    obstacles.push({ mesh: trunk, body: treeBody, type: 'tree' });
}

// Function to generate jumps
function generateJump(zPosition) {
    const jumpGeometry = new THREE.BoxGeometry(3, 0.5, 2);
    const jumpMaterial = new THREE.MeshBasicMaterial({ color: 0xD3D3D3 });
    const jump = new THREE.Mesh(jumpGeometry, jumpMaterial);
    jump.position.set((Math.random() - 0.5) * 16.67, 0.25, zPosition);
    jump.rotation.x = Math.PI / 8;
    scene.add(jump);

    const jumpBody = new CANNON.Body({
        mass: 0,
        shape: new CANNON.Box(new CANNON.Vec3(1.5, 0.25, 1)),
    });
    jumpBody.position.set(jump.position.x, 0.25, zPosition);
    jumpBody.quaternion.setFromEuler(Math.PI / 8, 0, 0);
    world.addBody(jumpBody);
    obstacles.push({ mesh: jump, body: jumpBody, type: 'jump' });
}

// Function to generate rocks
function generateRock(zPosition) {
    const rockGeometry = new THREE.SphereGeometry(0.3, 8, 8);
    const rockMaterial = new THREE.MeshBasicMaterial({ color: 0x808080 });
    const rock = new THREE.Mesh(rockGeometry, rockMaterial);
    rock.position.set((Math.random() - 0.5) * 16.67, 0.3, zPosition);
    scene.add(rock);

    const rockBody = new CANNON.Body({
        mass: 0,
        shape: new CANNON.Sphere(0.3),
    });
    rockBody.position.set(rock.position.x, 0.3, zPosition);
    world.addBody(rockBody);
    obstacles.push({ mesh: rock, body: rockBody, type: 'rock' });
}

// Function to generate other skiers
function generateOtherSkier(zPosition) {
    const otherSkierGeometry = new THREE.BoxGeometry(0.5, 1, 0.5);
    const otherSkierMaterial = new THREE.MeshBasicMaterial({ color: 0xFF0000 });
    const otherSkier = new THREE.Mesh(otherSkierGeometry, otherSkierMaterial);
    const xPosition = (Math.random() - 0.5) * 16.67;
    otherSkier.position.set(xPosition, 0.5, zPosition);
    scene.add(otherSkier);

    const otherSkierBody = new CANNON.Body({
        mass: 1,
        position: new CANNON.Vec3(xPosition, 0.5, zPosition),
        shape: new CANNON.Box(new CANNON.Vec3(0.25, 0.5, 0.25)),
    });

    otherSkierBody.velocity.set((Math.random() - 0.5) * 0.1, 0, -0.05);

    world.addBody(otherSkierBody);
    obstacles.push({
        mesh: otherSkier,
        body: otherSkierBody,
        type: 'otherSkier',
        movementData: {
            baseX: xPosition,
            amplitude: 2,
            frequency: Math.random() * 0.02 + 0.01,
        },
    });
}

// Function to manage obstacles
function manageObstacles() {
    if (obstacles.length === 0) {
        for (let i = 0; i < 10; i++) {
            const zPosition = -50 - i * 50;
            const obstacleType = Math.random();

            if (obstacleType < 0.25) {
                generateTree(zPosition);
            } else if (obstacleType < 0.5) {
                generateJump(zPosition);
            } else if (obstacleType < 0.75) {
                generateRock(zPosition);
            } else {
                generateOtherSkier(zPosition);
            }
        }
    }

    while (obstacles.length < 15) {
        const zPosition = skier.position.z - (Math.random() * 150 + 100);
        const obstacleType = Math.random();

        if (obstacleType < 0.25) {
            generateTree(zPosition);
        } else if (obstacleType < 0.5) {
            generateJump(zPosition);
        } else if (obstacleType < 0.75) {
            generateRock(zPosition);
        } else {
            generateOtherSkier(zPosition);
        }
    }

    obstacles = obstacles.filter((obstacle) => {
        if (obstacle.mesh.position.z > skier.position.z + 150) {
            scene.remove(obstacle.mesh);
            world.remove(obstacle.body);
            return false;
        }
        return true;
    });
}

// Function to update other skiers
function updateOtherSkiers() {
    obstacles.forEach((obstacle) => {
        if (obstacle.type === 'otherSkier') {
            const time = performance.now() * 0.001;
            const { baseX, amplitude, frequency } = obstacle.movementData;

            const sidewaysOffset = Math.sin(time * frequency) * amplitude;
            obstacle.body.position.x = baseX + sidewaysOffset;

            obstacle.mesh.position.copy(obstacle.body.position);
        }
    });
}

// Player movement variables
let velocityX = 0;
let velocityZ = -0.1;
let speedIncreaseRate = 0.0005;

// Function to check for collisions
function checkCollisions() {
    obstacles.forEach((obstacle) => {
        const distance = skier.position.distanceTo(obstacle.mesh.position);
        if (distance < 1) {
            alert('Game Over!');
            // Reset game or handle collision
        }
    });
}

// The main animation loop
function animate() {
    requestAnimationFrame(animate);

    velocityZ -= speedIncreaseRate;

    world.step(1 / 60);

    skierBody.position.z += velocityZ;
    skierBody.position.x += velocityX;

    skier.position.copy(skierBody.position);

    // Tilt the skier based on movement direction
    if (velocityX < 0) {
        skier.rotation.z = Math.PI / 8; // Tilt left
    } else if (velocityX > 0) {
        skier.rotation.z = -Math.PI / 8; // Tilt right
    } else {
        skier.rotation.z = 0; // Upright
    }

    updateOtherSkiers();

    camera.position.set(
        skier.position.x,
        skier.position.y + 5,
        skier.position.z + 10
    );
    camera.lookAt(skier.position);

    manageObstacles();
    checkCollisions();

    renderer.render(scene, camera);
}

// Event listeners for player input
document.addEventListener('keydown', (event) => {
    if (event.key === 'a') {
        velocityX = -0.1;
    }
    if (event.key === 'd') {
        velocityX = 0.1;
    }
});

document.addEventListener('keyup', (event) => {
    if (event.key === 'a' || event.key === 'd') {
        velocityX = 0;
    }
});

// Initialize obstacles and start animation
manageObstacles();
animate();
