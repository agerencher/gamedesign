// Coin.js

import * as THREE from 'https://unpkg.com/three@0.132.2/build/three.module.js';
import * as CANNON from 'https://cdn.jsdelivr.net/npm/cannon-es@0.20.0/dist/cannon-es.js';

class Coin {
    constructor(scene, world, position) {
        this.scene = scene;
        this.world = world;

        // Create the coin mesh
        const coinGeometry = new THREE.CylinderGeometry(0.5, 0.5, 0.1, 32);
        const coinMaterial = new THREE.MeshBasicMaterial({ color: 0xFFD700 });
        this.mesh = new THREE.Mesh(coinGeometry, coinMaterial);
        this.mesh.rotation.x = Math.PI / 2;
        this.mesh.position.copy(position);
        this.scene.add(this.mesh);

        // Create the coin physics body
        const coinShape = new CANNON.Cylinder(0.5, 0.5, 0.1, 32);
        this.body = new CANNON.Body({
            mass: 0,
            shape: coinShape,
            position: new CANNON.Vec3(position.x, position.y, position.z),
        });
        this.body.quaternion.setFromEuler(Math.PI / 2, 0, 0);
        this.world.addBody(this.body);

        // Flag to check if the coin has been collected
        this.collected = false;
    }

    update() {
        // Rotate the coin for a visual effect
        this.mesh.rotation.y += 0.05;
    }

    collect() {
        this.collected = true;
        // Remove the coin from the scene and world
        this.scene.remove(this.mesh);
        this.world.removeBody(this.body);
    }
}

export default Coin;
