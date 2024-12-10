// Obstacles.js
import * as THREE from 'https://unpkg.com/three@0.132.2/build/three.module.js';
import * as CANNON from 'https://cdn.jsdelivr.net/npm/cannon-es@0.20.0/dist/cannon-es.js';
import Coin from './Coin.js';

class Obstacles {
    constructor(scene, world, skier) {
        this.scene = scene;
        this.world = world;
        this.skier = skier;
        this.obstacles = [];
        this.coins = [];
        this.totalSlots = 4;
        this.maxObstacles = 100;
        this.maxCoins = 200;
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
        return -16.67 / 2 + slotWidth / 2 + slot * slotWidth;
    }

    getSlotFromPosition(xPosition) {
        return Math.floor((xPosition + 16.67 / 2) / (16.67 / this.totalSlots));
    }

    createTree() {
        const trunkGeometry = new THREE.CylinderGeometry(0.4, 0.4, 2, 8);
        const trunkMaterial = new THREE.MeshBasicMaterial({ color: 0x8B4513 });
        const trunk = new THREE.Mesh(trunkGeometry, trunkMaterial);
        trunk.position.set(0, 1, 0);

        const leavesGeometry = new THREE.ConeGeometry(1, 3, 8);
        const leavesMaterial = new THREE.MeshBasicMaterial({ color: 0x228B22 });
        const leaves = new THREE.Mesh(leavesGeometry, leavesMaterial);
        leaves.position.set(0, 2.5, 0);

        const treeGroup = new THREE.Group();
        treeGroup.add(trunk);
        treeGroup.add(leaves);

        const treeBody = new CANNON.Body({
            mass: 0,
            shape: new CANNON.Cylinder(0.4, 0.4, 2, 8),
            position: new CANNON.Vec3(0, 1, 0)
        });
        this.world.addBody(treeBody);
        return { mesh: treeGroup, body: treeBody, type: 'tree', slot: null };
    }

    createJump() {
        const jumpGeometry = new THREE.BoxGeometry(6, 1, 4);
        const jumpMaterial = new THREE.MeshBasicMaterial({ color: 0xD3D3D3 });
        const jump = new THREE.Mesh(jumpGeometry, jumpMaterial);
        jump.position.set(0, 0.5, 0);
        jump.rotation.x = Math.PI / 8;

        const jumpBody = new CANNON.Body({
            mass: 0,
            shape: new CANNON.Box(new CANNON.Vec3(3, 0.5, 2)),
            position: new CANNON.Vec3(0, 0.5, 0)
        });
        jumpBody.quaternion.setFromEuler(Math.PI / 8, 0, 0);
        this.world.addBody(jumpBody);
        return { mesh: jump, body: jumpBody, type: 'jump', slot: null };
    }

    createRock() {
        const rockGeometry = new THREE.SphereGeometry(0.6, 8, 8);
        const rockMaterial = new THREE.MeshBasicMaterial({ color: 0x808080 });
        const rock = new THREE.Mesh(rockGeometry, rockMaterial);
        rock.position.set(0, 0.6, 0);

        const rockBody = new CANNON.Body({
            mass: 0,
            shape: new CANNON.Sphere(0.6),
            position: new CANNON.Vec3(0, 0.6, 0)
        });
        this.world.addBody(rockBody);
        return { mesh: rock, body: rockBody, type: 'rock', slot: null };
    }

    createCoin(position) {
        const coin = new Coin(this.scene, this.world, position);
        return coin;
    }

    generateTree(zPosition, occupiedSlots) {
        const slot = this.getAvailableSlot(occupiedSlots);
        if (slot === null) return;
        const xPosition = this.getXPositionForSlot(slot);

        const tree = this.createTree();
        tree.mesh.position.set(xPosition, 0, zPosition);
        this.scene.add(tree.mesh);
        tree.body.position.set(xPosition, 1, zPosition);
        this.obstacles.push(tree);
    }

    generateJump(zPosition, occupiedSlots) {
        const slot = this.getAvailableSlot(occupiedSlots);
        if (slot === null) return;
        const xPosition = this.getXPositionForSlot(slot);

        const jump = this.createJump();
        jump.mesh.position.set(xPosition, 0, zPosition);
        this.scene.add(jump.mesh);
        jump.body.position.set(xPosition, 0.5, zPosition);
        this.obstacles.push(jump);
    }

    generateRock(zPosition, occupiedSlots) {
        const slot = this.getAvailableSlot(occupiedSlots);
        if (slot === null) return;
        const xPosition = this.getXPositionForSlot(slot);

        const rock = this.createRock();
        rock.mesh.position.set(xPosition, 0, zPosition);
        this.scene.add(rock.mesh);
        rock.body.position.set(xPosition, 0.6, zPosition);
        this.obstacles.push(rock);
    }

    generateCoin(zPosition, occupiedSlots) {
        const slot = this.getAvailableSlot(occupiedSlots);
        if (slot === null) return;
        const xPosition = this.getXPositionForSlot(slot);
        const position = new THREE.Vector3(xPosition, 1, zPosition);

        const coin = new Coin(this.scene, this.world, position);
        this.coins.push(coin);
    }

    manageObstacles() {
        const obstacleSpacing = 20;
        const skierPosition = this.skier.getPosition();

        const zStart = Math.floor(skierPosition.z / obstacleSpacing) * obstacleSpacing;
        const zEnd = zStart - 200;

        for (let z = zStart; z >= zEnd; z -= obstacleSpacing) {
            const occupiedSlots = new Set();

            this.obstacles.forEach(obs => {
                if (Math.abs(obs.mesh.position.z - z) < obstacleSpacing / 2) {
                    const slot = this.getSlotFromPosition(obs.mesh.position.x);
                    if (slot >= 0 && slot < this.totalSlots) {
                        occupiedSlots.add(slot);
                    }
                }
            });

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

            if (Math.random() < 0.3 && occupiedSlots.size < this.totalSlots) {
                this.generateCoin(z, occupiedSlots);
            }
        }

        this.obstacles = this.obstacles.filter(obstacle => {
            if (obstacle.mesh.position.z > skierPosition.z + 50) {
                this.scene.remove(obstacle.mesh);
                this.world.removeBody(obstacle.body);
                return false;
            }
            return true;
        });

        this.coins = this.coins.filter(coin => {
            if (coin.mesh.position.z > skierPosition.z + 50 || coin.collected) {
                if (!coin.collected) {
                    this.scene.remove(coin.mesh);
                    this.world.removeBody(coin.body);
                }
                return false;
            }
            return true;
        });

        if (this.obstacles.length > this.maxObstacles) {
            const excess = this.obstacles.length - this.maxObstacles;
            for (let i = 0; i < excess; i++) {
                const obstacle = this.obstacles.pop();
                this.scene.remove(obstacle.mesh);
                this.world.removeBody(obstacle.body);
            }
        }

        if (this.coins.length > this.maxCoins) {
            const excess = this.coins.length - this.maxCoins;
            for (let i = 0; i < excess; i++) {
                const coin = this.coins.pop();
                this.scene.remove(coin.mesh);
                this.world.removeBody(coin.body);
            }
        }
    }

    checkCollisions() {
        const skierPosition = this.skier.getPosition();
        this.obstacles.forEach(obstacle => {
            const distance = skierPosition.distanceTo(obstacle.mesh.position);
            if (distance < 1.5) {
                if (obstacle.type === 'jump') {
                    this.skier.applyJump();
                } else {
                            // Determine death side:
                            // For example, if the skier's velocityX < 0, deathSide = -1 (left), else +1 (right)
                            const deathSide = (this.skier.velocityX < 0) ? -1 : 1;
                            this.scene.gameManager.triggerDeath(deathSide);
                }
            }
        });
    }

    checkCoinCollisions() {
        const skierPosition = this.skier.getPosition();
        // console.log('Skier position:', skierPosition);
        this.coins.forEach(coin => {
            if (!coin.collected) {
                const distance = skierPosition.distanceTo(coin.mesh.position);
                // console.log('Coin position:', coin.mesh.position);
                // console.log('Distance:', distance);
                // Coin radius=0.5, Skier half width~0.25, total threshold ~0.75
                if (distance < 1.5) {
                    // console.log('Coin collection triggered');
                    coin.collect();
                    this.skier.collectCoin();
                }
            }
        });
    }

    updateCoins() {
        this.coins.forEach(coin => {
            coin.update();
            coin.syncPosition();
        });
    }

    update() {
        this.manageObstacles();
        this.checkCollisions();
        this.updateCoins();
        this.checkCoinCollisions();
    }
}

export default Obstacles;
