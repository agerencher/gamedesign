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
const groundWidth = 16.67;
const groundDepth = 500;
const groundGeometry = new THREE.PlaneGeometry(groundWidth, groundDepth);
const groundMaterial = new THREE.MeshBasicMaterial({
    color: 0xEAEAEA,
    side: THREE.DoubleSide,
});
const ground = new THREE.Mesh(groundGeometry, groundMaterial);
ground.rotation.x = -Math.PI / 2;
ground.position.set(0, 0, -groundDepth / 2);
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

const leftBorderGeometry = new THREE.BoxGeometry(0.5, 5, groundDepth);
const leftBorder = new THREE.Mesh(leftBorderGeometry, borderMaterial);
leftBorder.position.set(-groundWidth / 2, 2.5, -groundDepth / 2);
scene.add(leftBorder);

const leftBorderBody = new CANNON.Body({
    mass: 0,
    shape: new CANNON.Box(new CANNON.Vec3(0.25, 2.5, groundDepth / 2)),
});
leftBorderBody.position.set(-groundWidth / 2, 2.5, -groundDepth / 2);
world.addBody(leftBorderBody);

const rightBorderGeometry = new THREE.BoxGeometry(0.5, 5, groundDepth);
const rightBorder = new THREE.Mesh(rightBorderGeometry, borderMaterial);
rightBorder.position.set(groundWidth / 2, 2.5, -groundDepth / 2);
scene.add(rightBorder);

const rightBorderBody = new CANNON.Body({
    mass: 0,
    shape: new CANNON.Box(new CANNON.Vec3(0.25, 2.5, groundDepth / 2)),
});
rightBorderBody.position.set(groundWidth / 2, 2.5, -groundDepth / 2);
world.addBody(rightBorderBody);

// Obstacles array
let obstacles = [];

// Helper functions to manage slots and positions
const totalSlots = 4; // Number of horizontal slots
function getAvailableSlot(occupiedSlots) {
    const availableSlots = [];
    for (let i = 0; i < totalSlots; i++) {
        if (!occupiedSlots.has(i)) {
            availableSlots.push(i);
        }
    }
    if (availableSlots.length === 0) return null;
    const randomIndex = Math.floor(Math.random() * availableSlots.length);
    const slot = availableSlots[randomIndex];
    occupiedSlots.add(slot);
    return slot;
}

function getXPositionForSlot(slot) {
    const slotWidth = groundWidth / totalSlots;
    const xPosition = -groundWidth / 2 + slotWidth / 2 + slot * slotWidth;
    return xPosition;
}

// Function to generate trees
function generateTree(zPosition, occupiedSlots) {
    const trunkGeometry = new THREE.CylinderGeometry(0.4, 0.4, 2, 8);
    const trunkMaterial = new THREE.MeshBasicMaterial({ color: 0x8B4513 });
    const slot = getAvailableSlot(occupiedSlots);
    if (slot === null) return; // No available slot
    const xPosition = getXPositionForSlot(slot);
    const trunk = new THREE.Mesh(trunkGeometry, trunkMaterial);
    trunk.position.set(xPosition, 1, zPosition);
    scene.add(trunk);

    const leavesGeometry = new THREE.ConeGeometry(1, 3, 8);
    const leavesMaterial = new THREE.MeshBasicMaterial({ color: 0x228B22 });
    const leaves = new THREE.Mesh(leavesGeometry, leavesMaterial);
    leaves.position.set(trunk.position.x, 2.5, zPosition);
    scene.add(leaves);

    const treeBody = new CANNON.Body({
        mass: 0,
        shape: new CANNON.Cylinder(0.4, 0.4, 2, 8),
    });
    treeBody.position.set(trunk.position.x, 1, zPosition);
    world.addBody(treeBody);
    obstacles.push({ mesh: trunk, body: treeBody, type: 'tree' });
}

// Function to generate jumps
function generateJump(zPosition, occupiedSlots) {
    const jumpGeometry = new THREE.BoxGeometry(6, 1, 4);
    const jumpMaterial = new THREE.MeshBasicMaterial({ color: 0xD3D3D3 });
    const slot = getAvailableSlot(occupiedSlots);
    if (slot === null) return; // No available slot
    const xPosition = getXPositionForSlot(slot);
    const jump = new THREE.Mesh(jumpGeometry, jumpMaterial);
    jump.position.set(xPosition, 0.5, zPosition);
    jump.rotation.x = Math.PI / 8;
    scene.add(jump);

    const jumpBody = new CANNON.Body({
        mass: 0,
        shape: new CANNON.Box(new CANNON.Vec3(3, 0.5, 2)),
    });
    jumpBody.position.set(jump.position.x, 0.5, zPosition);
    jumpBody.quaternion.setFromEuler(Math.PI / 8, 0, 0);
    world.addBody(jumpBody);
    obstacles.push({ mesh: jump, body: jumpBody, type: 'jump' });
}

// Function to generate rocks
function generateRock(zPosition, occupiedSlots) {
    const rockGeometry = new THREE.SphereGeometry(0.6, 8, 8);
    const rockMaterial = new THREE.MeshBasicMaterial({ color: 0x808080 });
    const slot = getAvailableSlot(occupiedSlots);
    if (slot === null) return; // No available slot
    const xPosition = getXPositionForSlot(slot);
    const rock = new THREE.Mesh(rockGeometry, rockMaterial);
    rock.position.set(xPosition, 0.6, zPosition);
    scene.add(rock);

    const rockBody = new CANNON.Body({
        mass: 0,
        shape: new CANNON.Sphere(0.6),
    });
    rockBody.position.set(rock.position.x, 0.6, zPosition);
    world.addBody(rockBody);
    obstacles.push({ mesh: rock, body: rockBody, type: 'rock' });
}

// Function to generate other skiers
function generateOtherSkier(zPosition, occupiedSlots) {
    const otherSkierGeometry = new THREE.BoxGeometry(1, 2, 1);
    const otherSkierMaterial = new THREE.MeshBasicMaterial({ color: 0xFF0000 });
    const slot = getAvailableSlot(occupiedSlots);
    if (slot === null) return; // No available slot
    const xPosition = getXPositionForSlot(slot);
    const otherSkier = new THREE.Mesh(otherSkierGeometry, otherSkierMaterial);
    otherSkier.position.set(xPosition, 1, zPosition);
    scene.add(otherSkier);

    const otherSkierBody = new CANNON.Body({
        mass: 1,
        position: new CANNON.Vec3(xPosition, 1, zPosition),
        shape: new CANNON.Box(new CANNON.Vec3(0.5, 1, 0.5)),
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
    const obstacleSpacing = 20; // Z-axis spacing between obstacle groups
    const maxObstaclesPerGroup = 3;

    // Generate obstacles ahead of the skier
    const generateObstaclesAhead = () => {
        const zStart = Math.floor(skier.position.z / obstacleSpacing) * obstacleSpacing - 100;
        const zEnd = zStart - 200;

        for (let z = zStart; z >= zEnd; z -= obstacleSpacing) {
            const existingObstacles = obstacles.filter(
                (obs) => Math.abs(obs.mesh.position.z - z) < obstacleSpacing / 2
            );
            if (existingObstacles.length >= maxObstaclesPerGroup) continue;

            const obstaclesToGenerate = maxObstaclesPerGroup - existingObstacles.length;
            const occupiedSlots = new Set();

            for (let i = 0; i < obstaclesToGenerate; i++) {
                const obstacleType = Math.random();
                if (obstacleType < 0.25) {
                    generateTree(z, occupiedSlots);
                } else if (obstacleType < 0.5) {
                    generateJump(z, occupiedSlots);
                } else if (obstacleType < 0.75) {
                    generateRock(z, occupiedSlots);
                } else {
                    generateOtherSkier(z, occupiedSlots);
                }
            }
        }
    };

    generateObstaclesAhead();

    // Remove obstacles that are far behind the skier
    obstacles = obstacles.filter((obstacle) => {
        if (obstacle.mesh.position.z > skier.position.z + 50) {
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
        if (distance < 1.5) {
            if (obstacle.type === 'jump') {
                // Allow the skier to go over the jump
                skierBody.velocity.y = 5; // Adjust this value for jump height
            } else {
                alert('Game Over!');
                // Reset game or handle collision
            }
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
