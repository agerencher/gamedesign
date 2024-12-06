// Obstacles.js
import * as THREE from 'https://unpkg.com/three@0.132.2/build/three.module.js';
import * as CANNON from 'https://cdn.jsdelivr.net/npm/cannon-es@0.20.0/dist/cannon-es.js';
import Coin from './Coin.js'; // Ensure Coin.js is correctly implemented without pooling

// Shared Geometries and Materials to optimize memory usage
const sharedTrunkGeometry = new THREE.CylinderGeometry(0.4, 0.4, 2, 6);
const sharedTrunkMaterial = new THREE.MeshBasicMaterial({ color: 0x8B4513 });

const sharedLeavesGeometry = new THREE.ConeGeometry(1, 3, 6);
const sharedLeavesMaterial = new THREE.MeshBasicMaterial({ color: 0x228B22 });

const sharedJumpGeometry = new THREE.BoxGeometry(6, 1, 4);
const sharedJumpMaterial = new THREE.MeshBasicMaterial({ color: 0xD3D3D3 });

const sharedRockGeometry = new THREE.SphereGeometry(0.6, 6, 6);
const sharedRockMaterial = new THREE.MeshBasicMaterial({ color: 0x808080 });

const sharedCoinGeometry = new THREE.CylinderGeometry(0.5, 0.5, 0.1, 32);
const sharedCoinMaterial = new THREE.MeshBasicMaterial({ color: 0xFFD700 });

/**
 * Utility function to dispose of a mesh and its resources.
 * @param {THREE.Mesh} mesh - The mesh to dispose.
 */
function disposeMesh(mesh) {
    if (mesh) {
        mesh.parent.remove(mesh);
        if (mesh.geometry) mesh.geometry.dispose();
        if (Array.isArray(mesh.material)) {
            mesh.material.forEach(material => material.dispose());
        } else if (mesh.material) {
            mesh.material.dispose();
        }
    }
}

class Obstacles {
    /**
     * Constructor for Obstacles.
     * @param {THREE.Scene} scene - The Three.js scene.
     * @param {CANNON.World} world - The CANNON.js physics world.
     * @param {Skier} skier - The skier object.
     */
    constructor(scene, world, skier) {
        this.scene = scene;
        this.world = world;
        this.skier = skier;
        this.obstacles = [];
        this.coins = [];
        this.totalSlots = 4; // Number of horizontal slots for obstacle placement
        this.maxObstacles = 100; // Maximum number of active obstacles
        this.maxCoins = 200; // Maximum number of active coins
    }

    /**
     * Retrieves an available slot for obstacle placement.
     * @param {Set} occupiedSlots - Set of currently occupied slots.
     * @returns {number|null} - The selected slot index or null if none available.
     */
    getAvailableSlot(occupiedSlots) {
        const availableSlots = [];
        for (let i = 0; i < this.totalSlots; i++) {
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

    /**
     * Calculates the X position based on the slot index.
     * @param {number} slot - The slot index.
     * @returns {number} - The X position.
     */
    getXPositionForSlot(slot) {
        const slotWidth = 16.67 / this.totalSlots; // Assuming total width is 16.67 units
        return -16.67 / 2 + slotWidth / 2 + slot * slotWidth;
    }

    /**
     * Determines the slot index from an X position.
     * @param {number} xPosition - The X position.
     * @returns {number} - The slot index.
     */
    getSlotFromPosition(xPosition) {
        return Math.floor((xPosition + 16.67 / 2) / (16.67 / this.totalSlots));
    }

    /**
     * Creates a tree obstacle.
     * @returns {object} - The tree object containing mesh and physics body.
     */
    createTree() {
        const treeGroup = new THREE.Group();

        // Trunk
        const trunk = new THREE.Mesh(sharedTrunkGeometry, sharedTrunkMaterial);
        trunk.position.y = 1; // Half the height to align base with y=0
        treeGroup.add(trunk);

        // Leaves
        const leaves = new THREE.Mesh(sharedLeavesGeometry, sharedLeavesMaterial);
        leaves.position.y = 2.5; // Positioned atop the trunk
        treeGroup.add(leaves);

        // Physics Body
        const treeBody = new CANNON.Body({
            mass: 0, // Static object
            shape: new CANNON.Cylinder(0.4, 0.4, 2, 6),
            position: new CANNON.Vec3(0, 1, 0), // Placeholder, set actual position when generating
        });
        this.world.addBody(treeBody);

        return { mesh: treeGroup, body: treeBody, type: 'tree', slot: null };
    }

    /**
     * Creates a jump obstacle.
     * @returns {object} - The jump object containing mesh and physics body.
     */
    createJump() {
        const jump = new THREE.Mesh(sharedJumpGeometry, sharedJumpMaterial);
        jump.rotation.x = Math.PI / 8; // Slightly tilt the jump for realism

        // Physics Body
        const jumpBody = new CANNON.Body({
            mass: 0, // Static object
            shape: new CANNON.Box(new CANNON.Vec3(3, 0.5, 2)),
            position: new CANNON.Vec3(0, 0.5, 0), // Placeholder, set actual position when generating
        });
        jumpBody.quaternion.setFromEuler(Math.PI / 8, 0, 0); // Match rotation with the mesh
        this.world.addBody(jumpBody);

        return { mesh: jump, body: jumpBody, type: 'jump', slot: null };
    }

    /**
     * Creates a rock obstacle.
     * @returns {object} - The rock object containing mesh and physics body.
     */
    createRock() {
        const rock = new THREE.Mesh(sharedRockGeometry, sharedRockMaterial);

        // Physics Body
        const rockBody = new CANNON.Body({
            mass: 0, // Static object
            shape: new CANNON.Sphere(0.6),
            position: new CANNON.Vec3(0, 0.6, 0), // Placeholder, set actual position when generating
        });
        this.world.addBody(rockBody);

        return { mesh: rock, body: rockBody, type: 'rock', slot: null };
    }

    /**
     * Creates a coin.
     * @returns {object} - The coin object containing mesh and physics body.
     */
    createCoin() {
        const coin = new Coin(this.scene, this.world); // Ensure Coin.js correctly sets up mesh and body
        return coin;
    }

    /**
     * Generates a tree at the specified Z position.
     * @param {number} zPosition - The Z position for the tree.
     * @param {Set} occupiedSlots - Set of currently occupied slots.
     */
    generateTree(zPosition, occupiedSlots) {
        const slot = this.getAvailableSlot(occupiedSlots);
        if (slot === null) return;
        const xPosition = this.getXPositionForSlot(slot);

        const tree = this.createTree();
        tree.mesh.position.set(xPosition, 0, zPosition); // Position the tree group
        this.scene.add(tree.mesh);
        tree.body.position.set(xPosition, 1, zPosition); // Position the physics body
        tree.body.velocity.set(0, 0, 0); // Ensure it's stationary

        tree.slot = slot;
        this.obstacles.push(tree);
    }

    /**
     * Generates a jump at the specified Z position.
     * @param {number} zPosition - The Z position for the jump.
     * @param {Set} occupiedSlots - Set of currently occupied slots.
     */
    generateJump(zPosition, occupiedSlots) {
        const slot = this.getAvailableSlot(occupiedSlots);
        if (slot === null) return;
        const xPosition = this.getXPositionForSlot(slot);

        const jump = this.createJump();
        jump.mesh.position.set(xPosition, 0, zPosition); // Position the jump in the scene
        this.scene.add(jump.mesh);
        jump.body.position.set(xPosition, 0.5, zPosition); // Position the physics body
        jump.body.velocity.set(0, 0, 0); // Ensure it's stationary

        jump.slot = slot;
        this.obstacles.push(jump);
    }

    /**
     * Generates a rock at the specified Z position.
     * @param {number} zPosition - The Z position for the rock.
     * @param {Set} occupiedSlots - Set of currently occupied slots.
     */
    generateRock(zPosition, occupiedSlots) {
        const slot = this.getAvailableSlot(occupiedSlots);
        if (slot === null) return;
        const xPosition = this.getXPositionForSlot(slot);

        const rock = this.createRock();
        rock.mesh.position.set(xPosition, 0, zPosition); // Position the rock in the scene
        this.scene.add(rock.mesh);
        rock.body.position.set(xPosition, 0.6, zPosition); // Position the physics body
        rock.body.velocity.set(0, 0, 0); // Ensure it's stationary

        rock.slot = slot;
        this.obstacles.push(rock);
    }

    /**
     * Generates a coin at the specified Z position.
     * @param {number} zPosition - The Z position for the coin.
     * @param {Set} occupiedSlots - Set of currently occupied slots.
     */
    generateCoin(zPosition, occupiedSlots) {
        const slot = this.getAvailableSlot(occupiedSlots);
        if (slot === null) return;
        const xPosition = this.getXPositionForSlot(slot);
        const yPosition = 1.5; // Adjust based on ramp height to prevent intersection

        const coin = this.createCoin();
        coin.mesh.position.set(xPosition, yPosition, zPosition);
        this.scene.add(coin.mesh);
        coin.body.position.set(xPosition, yPosition, zPosition);
        this.world.addBody(coin.body);

        this.coins.push(coin);
    }

    /**
     * Manages obstacle and coin generation and cleanup.
     * Ensures that memory usage remains controlled by disposing of objects that are no longer needed.
     */
    manageObstacles() {
        const obstacleSpacing = 20; // Distance between obstacle generations
        const skierPosition = this.skier.getPosition();

        const zStart = Math.floor(skierPosition.z / obstacleSpacing) * obstacleSpacing;
        const zEnd = zStart - 200; // Define how far back to generate obstacles

        for (let z = zStart; z >= zEnd; z -= obstacleSpacing) {
            const occupiedSlots = new Set();

            // Track existing obstacles in the current z-position group
            this.obstacles.forEach(obs => {
                if (Math.abs(obs.mesh.position.z - z) < obstacleSpacing / 2) {
                    const slot = this.getSlotFromPosition(obs.mesh.position.x);
                    if (slot >= 0 && slot < this.totalSlots) {
                        occupiedSlots.add(slot);
                    }
                }
            });

            // Generate new obstacles if needed
            const maxObstaclesPerGroup = 3;
            const existingObstacles = this.obstacles.filter(
                obs => Math.abs(obs.mesh.position.z - z) < obstacleSpacing / 2
            );

            if (existingObstacles.length < maxObstaclesPerGroup) {
                const obstaclesToGenerate = maxObstaclesPerGroup - existingObstacles.length;

                for (let i = 0; i < obstaclesToGenerate; i++) {
                    const obstacleType = Math.random();
                    if (obstacleType < 0.4) this.generateTree(z, occupiedSlots);
                    else if (obstacleType < 0.7) this.generateJump(z, occupiedSlots);
                    else this.generateRock(z, occupiedSlots);
                }
            }

            // Generate coins in remaining free slots
            if (Math.random() < 0.3 && occupiedSlots.size < this.totalSlots) {
                this.generateCoin(z, occupiedSlots);
            }
        }

        // Cleanup Obstacles
        this.obstacles = this.obstacles.filter(obstacle => {
            // Assuming skier moves along the negative z-axis
            if (obstacle.mesh.position.z > skierPosition.z + 50) {
                // Dispose obstacle
                disposeMesh(obstacle.mesh);
                this.world.removeBody(obstacle.body);
                return false; // Remove from array
            }
            return true; // Keep in array
        });

        // Cleanup Coins
        this.coins = this.coins.filter(coin => {
            if (coin.mesh.position.z > skierPosition.z + 50 || coin.collected) {
                // Dispose coin
                disposeMesh(coin.mesh);
                this.world.removeBody(coin.body);
                return false; // Remove from array
            }
            return true; // Keep in array
        });

        // Enforce Maximum Counts to prevent runaway memory usage
        if (this.obstacles.length > this.maxObstacles) {
            const excess = this.obstacles.length - this.maxObstacles;
            for (let i = 0; i < excess; i++) {
                const obstacle = this.obstacles.pop();
                disposeMesh(obstacle.mesh);
                this.world.removeBody(obstacle.body);
            }
        }

        if (this.coins.length > this.maxCoins) {
            const excess = this.coins.length - this.maxCoins;
            for (let i = 0; i < excess; i++) {
                const coin = this.coins.pop();
                disposeMesh(coin.mesh);
                this.world.removeBody(coin.body);
            }
        }
    }

    /**
     * Detects collisions between the skier and obstacles.
     * Triggers appropriate actions based on obstacle type.
     */
    checkCollisions() {
        const skierPosition = this.skier.getPosition();
        this.obstacles.forEach(obstacle => {
            const distance = skierPosition.distanceTo(obstacle.mesh.position);
            if (distance < 1.5) { // Collision threshold
                if (obstacle.type === 'jump') {
                    this.skier.applyJump();
                } else {
                    this.scene.gameManager.gameOver(); // Assuming gameManager is accessible
                }
            }
        });
    }

    /**
     * Detects collisions between the skier and coins.
     * Collects coins when within proximity.
     */
    checkCoinCollisions() {
        const skierPosition = this.skier.getPosition();
        this.coins.forEach(coin => {
            if (!coin.collected) {
                const distance = skierPosition.distanceTo(coin.mesh.position);
                if (distance < 1) { // Collection threshold
                    coin.collect();
                    this.skier.collectCoin(); // Assuming skier has a method to increment coin count
                }
            }
        });
    }

    /**
     * Updates the rotation of coins for a spinning effect.
     */
    updateCoins() {
        this.coins.forEach(coin => coin.update());
    }

    /**
     * The main update loop called each frame.
     * Manages obstacles, detects collisions, and updates coin states.
     */
    update() {
        this.manageObstacles();
        this.checkCollisions();
        this.updateCoins();
        this.checkCoinCollisions();
    }
}

export default Obstacles;
