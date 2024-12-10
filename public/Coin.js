// Coin.js
import * as THREE from 'https://unpkg.com/three@0.132.2/build/three.module.js';
import * as CANNON from 'https://cdn.jsdelivr.net/npm/cannon-es@0.20.0/dist/cannon-es.js';

class Coin {
    /**
     * Constructor for the Coin.
     * @param {THREE.Scene} scene - The Three.js scene.
     * @param {CANNON.World} world - The Cannon-ES physics world.
     * @param {THREE.Vector3} position - The initial position of the coin.
     */
    constructor(scene, world, position) {
        this.scene = scene;
        this.world = world;
        this.collected = false;

        // Create the coin mesh
        const coinGeometry = new THREE.CylinderGeometry(0.5, 0.5, 0.1, 32);
        const coinMaterial = new THREE.MeshBasicMaterial({ color: 0xFFD700 });
        this.mesh = new THREE.Mesh(coinGeometry, coinMaterial);
        this.mesh.rotation.x = Math.PI / 2; // Lying flat
        this.mesh.position.copy(position);
        this.scene.add(this.mesh);

        // Create physics body
        const coinShape = new CANNON.Cylinder(0.5, 0.5, 0.1, 32);
        this.body = new CANNON.Body({
            mass: 0, // Static body
            shape: coinShape,
            position: new CANNON.Vec3(position.x, position.y, position.z),
        });
        // Match orientation
        this.body.quaternion.setFromEuler(Math.PI / 2, 0, 0);
        this.world.addBody(this.body);
    }

    /**
     * Updates the Coin's rotation for a spinning effect.
     */
    update() {
        if (!this.collected) {
            this.mesh.rotation.y += 0.05; // Spin the coin for visual effect
        }
    }

    /**
     * Synchronizes the Three.js mesh position with the CANNON.js body.
     */
    syncPosition() {
        this.mesh.position.copy(this.body.position);
    }

    /**
     * Handles the coin being collected by the skier.
     */
    collect() {
        if (!this.collected) {
            this.collected = true;
            this.scene.remove(this.mesh);
            this.world.removeBody(this.body);
        }
    }
}

export default Coin;
