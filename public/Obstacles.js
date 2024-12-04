// Obstacles.js

import * as THREE from 'https://unpkg.com/three@0.132.2/build/three.module.js';
import * as CANNON from 'https://cdn.jsdelivr.net/npm/cannon-es@0.20.0/dist/cannon-es.js';
import Coin from './Coin.js';

class Obstacles {
    constructor(scene, world, skier) {
        this.scene = scene;
        this.world = world;
        this.skier = skier;

        // Obstacles array
        this.obstacles = [];

        // Coins array
        this.coins = [];

        // Helper functions to manage slots and positions
        this.totalSlots = 4; // Number of horizontal slots
    }

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

    getXPositionForSlot(slot) {
        const slotWidth = 16.67 / this.totalSlots;
        const xPosition = -16.67 / 2 + slotWidth / 2 + slot * slotWidth;
        return xPosition;
    }

    generateTree(zPosition, occupiedSlots) {
        const trunkGeometry = new THREE.CylinderGeometry(0.4, 0.4, 2, 8);
        const trunkMaterial = new THREE.MeshBasicMaterial({ color: 0x8B4513 });
        const slot = this.getAvailableSlot(occupiedSlots);
        if (slot === null) return; // No available slot
        const xPosition = this.getXPositionForSlot(slot);
        const trunk = new THREE.Mesh(trunkGeometry, trunkMaterial);
        trunk.position.set(xPosition, 1, zPosition);
        this.scene.add(trunk);

        const leavesGeometry = new THREE.ConeGeometry(1, 3, 8);
        const leavesMaterial = new THREE.MeshBasicMaterial({ color: 0x228B22 });
        const leaves = new THREE.Mesh(leavesGeometry, leavesMaterial);
        leaves.position.set(trunk.position.x, 2.5, zPosition);
        this.scene.add(leaves);

        const treeBody = new CANNON.Body({
            mass: 0,
            shape: new CANNON.Cylinder(0.4, 0.4, 2, 8),
        });
        treeBody.position.set(trunk.position.x, 1, zPosition);
        this.world.addBody(treeBody);
        this.obstacles.push({ mesh: trunk, body: treeBody, type: 'tree' });
    }

    generateJump(zPosition, occupiedSlots) {
        const jumpGeometry = new THREE.BoxGeometry(6, 1, 4);
        const jumpMaterial = new THREE.MeshBasicMaterial({ color: 0xD3D3D3 });
        const slot = this.getAvailableSlot(occupiedSlots);
        if (slot === null) return; // No available slot
        const xPosition = this.getXPositionForSlot(slot);
        const jump = new THREE.Mesh(jumpGeometry, jumpMaterial);
        jump.position.set(xPosition, 0.5, zPosition);
        jump.rotation.x = Math.PI / 8;
        this.scene.add(jump);

        const jumpBody = new CANNON.Body({
            mass: 0,
            shape: new CANNON.Box(new CANNON.Vec3(3, 0.5, 2)),
        });
        jumpBody.position.set(jump.position.x, 0.5, zPosition);
        jumpBody.quaternion.setFromEuler(Math.PI / 8, 0, 0);
        this.world.addBody(jumpBody);
        this.obstacles.push({ mesh: jump, body: jumpBody, type: 'jump' });
    }

    generateRock(zPosition, occupiedSlots) {
        const rockGeometry = new THREE.SphereGeometry(0.6, 8, 8);
        const rockMaterial = new THREE.MeshBasicMaterial({ color: 0x808080 });
        const slot = this.getAvailableSlot(occupiedSlots);
        if (slot === null) return; // No available slot
        const xPosition = this.getXPositionForSlot(slot);
        const rock = new THREE.Mesh(rockGeometry, rockMaterial);
        rock.position.set(xPosition, 0.6, zPosition);
        this.scene.add(rock);

        const rockBody = new CANNON.Body({
            mass: 0,
            shape: new CANNON.Sphere(0.6),
        });
        rockBody.position.set(rock.position.x, 0.6, zPosition);
        this.world.addBody(rockBody);
        this.obstacles.push({ mesh: rock, body: rockBody, type: 'rock' });
    }

    generateOtherSkier(zPosition, occupiedSlots) {
        const otherSkierGeometry = new THREE.BoxGeometry(1, 2, 1);
        const otherSkierMaterial = new THREE.MeshBasicMaterial({ color: 0xFF0000 });
        const slot = this.getAvailableSlot(occupiedSlots);
        if (slot === null) return; // No available slot
        const xPosition = this.getXPositionForSlot(slot);
        const otherSkier = new THREE.Mesh(otherSkierGeometry, otherSkierMaterial);
        otherSkier.position.set(xPosition, 1, zPosition);
        this.scene.add(otherSkier);

        const otherSkierBody = new CANNON.Body({
            mass: 1,
            position: new CANNON.Vec3(xPosition, 1, zPosition),
            shape: new CANNON.Box(new CANNON.Vec3(0.5, 1, 0.5)),
        });

        otherSkierBody.velocity.set((Math.random() - 0.5) * 0.1, 0, -0.05);

        this.world.addBody(otherSkierBody);
        this.obstacles.push({
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

    generateCoin(zPosition, occupiedSlots) {
        const slot = this.getAvailableSlot(occupiedSlots);
        if (slot === null) return; // No available slot
        const xPosition = this.getXPositionForSlot(slot);
        const position = new THREE.Vector3(xPosition, 0.5, zPosition);
        const coin = new Coin(this.scene, this.world, position);
        this.coins.push(coin);
    }

    manageObstacles() {
        const obstacleSpacing = 20; // Z-axis spacing between obstacle groups
        const maxObstaclesPerGroup = 3;
        const skierPosition = this.skier.getPosition();

        // Generate obstacles ahead of the skier
        const generateObstaclesAhead = () => {
            const zStart = Math.floor(skierPosition.z / obstacleSpacing) * obstacleSpacing - 100;
            const zEnd = zStart - 200;

            for (let z = zStart; z >= zEnd; z -= obstacleSpacing) {
                const existingObstacles = this.obstacles.filter(
                    (obs) => Math.abs(obs.mesh.position.z - z) < obstacleSpacing / 2
                );
                if (existingObstacles.length >= maxObstaclesPerGroup) continue;

                const obstaclesToGenerate = maxObstaclesPerGroup - existingObstacles.length;
                const occupiedSlots = new Set();

                for (let i = 0; i < obstaclesToGenerate; i++) {
                    const obstacleType = Math.random();
                    if (obstacleType < 0.25) {
                        this.generateTree(z, occupiedSlots);
                    } else if (obstacleType < 0.5) {
                        this.generateJump(z, occupiedSlots);
                    } else if (obstacleType < 0.75) {
                        this.generateRock(z, occupiedSlots);
                    } else {
                        this.generateOtherSkier(z, occupiedSlots);
                    }
                }
            }
        };

        generateObstaclesAhead();

        // Remove obstacles that are far behind the skier
        this.obstacles = this.obstacles.filter((obstacle) => {
            if (obstacle.mesh.position.z > skierPosition.z + 50) {
                this.scene.remove(obstacle.mesh);
                this.world.removeBody(obstacle.body); // Correct method
                return false;
            }
            return true;
        });

        // Remove coins that are far behind the skier
        this.coins = this.coins.filter((coin) => {
            if (coin.mesh.position.z > skierPosition.z + 50 || coin.collected) {
                if (!coin.collected) {
                    this.scene.remove(coin.mesh);
                    this.world.removeBody(coin.body);
                }
                return false;
            }
            return true;
        });
    }

    updateCoins() {
        this.coins.forEach((coin) => {
            coin.update();
        });
    }

    checkCoinCollisions() {
        const skierPosition = this.skier.getPosition();
        this.coins.forEach((coin) => {
            if (!coin.collected) {
                const distance = skierPosition.distanceTo(coin.mesh.position);
                if (distance < 1) {
                    coin.collect();
                    this.skier.collectCoin(); // Method to update coin count
                }
            }
        });
    }

    updateOtherSkiers() {
        this.obstacles.forEach((obstacle) => {
            if (obstacle.type === 'otherSkier') {
                const time = performance.now() * 0.001;
                const { baseX, amplitude, frequency } = obstacle.movementData;

                const sidewaysOffset = Math.sin(time * frequency) * amplitude;
                obstacle.body.position.x = baseX + sidewaysOffset;

                obstacle.mesh.position.copy(obstacle.body.position);
            }
        });
    }

    checkCollisions() {
        const skierPosition = this.skier.getPosition();
        this.obstacles.forEach((obstacle) => {
            const distance = skierPosition.distanceTo(obstacle.mesh.position);
            if (distance < 1.5) {
                if (obstacle.type === 'jump') {
                    this.skier.applyJump();
                } else {
                    // Game over
                    this.scene.gameManager.gameOver();
                }
            }
        });
    }

    update() {
        this.updateOtherSkiers();
        this.manageObstacles();
        this.checkCollisions();
        this.updateCoins();
        this.checkCoinCollisions();
    }
}

export default Obstacles;
