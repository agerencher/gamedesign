// Skier.js

import * as THREE from 'https://unpkg.com/three@0.132.2/build/three.module.js';
import * as CANNON from 'https://cdn.jsdelivr.net/npm/cannon-es@0.20.0/dist/cannon-es.js';

class Skier {
    constructor(scene, world) {
        this.scene = scene;
        this.world = world;

        // Create a new skier model using a group
        this.skier = new THREE.Group();

        // Head
        const headGeometry = new THREE.SphereGeometry(0.25, 16, 16);
        const headMaterial = new THREE.MeshBasicMaterial({ color: 0xFDD7AA });
        const head = new THREE.Mesh(headGeometry, headMaterial);
        head.position.set(0, 1.5, 0);
        this.skier.add(head);

        // Body
        const bodyGeometry = new THREE.CylinderGeometry(0.2, 0.2, 0.75, 16);
        const bodyMaterial = new THREE.MeshBasicMaterial({ color: 0x0000FF });
        const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
        body.position.set(0, 0.75, 0);
        this.skier.add(body);

        // Legs
        const legGeometry = new THREE.CylinderGeometry(0.1, 0.1, 0.5, 16);
        const legMaterial = new THREE.MeshBasicMaterial({ color: 0x000000 });

        const leftLeg = new THREE.Mesh(legGeometry, legMaterial);
        leftLeg.position.set(-0.1, 0.25, 0);
        leftLeg.rotation.z = Math.PI / 12;
        this.skier.add(leftLeg);

        const rightLeg = new THREE.Mesh(legGeometry, legMaterial);
        rightLeg.position.set(0.1, 0.25, 0);
        rightLeg.rotation.z = -Math.PI / 12;
        this.skier.add(rightLeg);

        // Skis
        const skiGeometry = new THREE.BoxGeometry(0.1, 0.05, 1);
        const skiMaterial = new THREE.MeshBasicMaterial({ color: 0x8B4513 });

        const leftSki = new THREE.Mesh(skiGeometry, skiMaterial);
        leftSki.position.set(-0.15, 0, 0.3);
        this.skier.add(leftSki);

        const rightSki = new THREE.Mesh(skiGeometry, skiMaterial);
        rightSki.position.set(0.15, 0, 0.3);
        this.skier.add(rightSki);

        // Add the skier to the scene
        this.scene.add(this.skier);

        // Initialize skier physics body
        this.skierBody = new CANNON.Body({
            mass: 5,
            position: new CANNON.Vec3(0, 1, 0),
            shape: new CANNON.Box(new CANNON.Vec3(0.25, 1.5, 0.25)), // Adjusted to match skier's height
        });
        this.world.addBody(this.skierBody);

        // Player movement variables
        this.velocityX = 0;
        this.velocityZ = -0.1;
        this.speedIncreaseRate = 0.0001;

        this.coinsCollected = 0;

        // Event listeners for player input
        document.addEventListener('keydown', (event) => {
            if (event.key === 'a') {
                this.velocityX = -0.1;
            }
            if (event.key === 'd') {
                this.velocityX = 0.1;
            }
        });

        document.addEventListener('keyup', (event) => {
            if (event.key === 'a' || event.key === 'd') {
                this.velocityX = 0;
            }
        });
    }

    update() {
        this.velocityZ -= this.speedIncreaseRate;

        // Update skier's position
        this.skierBody.position.z += this.velocityZ;
        this.skierBody.position.x += this.velocityX;

        this.skier.position.copy(this.skierBody.position);

        // Tilt the skier based on movement direction
        if (this.velocityX < 0) {
            this.skier.rotation.z = Math.PI / 8; // Tilt left
        } else if (this.velocityX > 0) {
            this.skier.rotation.z = -Math.PI / 8; // Tilt right
        } else {
            this.skier.rotation.z = 0; // Upright
        }
    }

    getPosition() {
        return this.skier.position;
    }

    applyJump() {
        this.skierBody.velocity.y = 5; // Adjust this value for jump height
    }

    collectCoin() {
        this.coinsCollected += 1;
    }

    getCoinsCollected() {
        return this.coinsCollected;
    }
}

export default Skier;
