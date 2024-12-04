// Terrain.js

import * as THREE from 'https://unpkg.com/three@0.132.2/build/three.module.js';
import * as CANNON from 'https://cdn.jsdelivr.net/npm/cannon-es@0.20.0/dist/cannon-es.js';

class Terrain {
    constructor(scene, world) {
        this.scene = scene;
        this.world = world;

        // Adjust ground depth to ensure it extends far enough
        this.groundDepth = 1000; // Increased from 500 to 1000
        this.groundWidth = 16.67;

        // Create the ground
        const groundGeometry = new THREE.PlaneGeometry(this.groundWidth, this.groundDepth);
        const groundMaterial = new THREE.MeshBasicMaterial({
            color: 0xEAEAEA,
            side: THREE.DoubleSide,
        });
        this.ground = new THREE.Mesh(groundGeometry, groundMaterial);
        this.ground.rotation.x = -Math.PI / 2;
        this.ground.position.set(0, 0, 0); // Centered at Z = 0
        this.scene.add(this.ground);

        // Create borders
        const borderMaterial = new THREE.MeshBasicMaterial({ color: 0x964B00 });

        const leftBorderGeometry = new THREE.BoxGeometry(0.5, 5, this.groundDepth);
        this.leftBorder = new THREE.Mesh(leftBorderGeometry, borderMaterial);
        this.leftBorder.position.set(-this.groundWidth / 2, 2.5, 0); // Centered at Z = 0
        this.scene.add(this.leftBorder);

        const rightBorderGeometry = new THREE.BoxGeometry(0.5, 5, this.groundDepth);
        this.rightBorder = new THREE.Mesh(rightBorderGeometry, borderMaterial);
        this.rightBorder.position.set(this.groundWidth / 2, 2.5, 0); // Centered at Z = 0
        this.scene.add(this.rightBorder);

        // Modify the border bodies to be kinematic and centered
        this.leftBorderBody = new CANNON.Body({
            mass: 0,
            type: CANNON.Body.KINEMATIC,
            shape: new CANNON.Box(new CANNON.Vec3(0.25, 2.5, this.groundDepth / 2)),
        });
        this.leftBorderBody.position.set(-this.groundWidth / 2, 2.5, 0);
        this.world.addBody(this.leftBorderBody);

        this.rightBorderBody = new CANNON.Body({
            mass: 0,
            type: CANNON.Body.KINEMATIC,
            shape: new CANNON.Box(new CANNON.Vec3(0.25, 2.5, this.groundDepth / 2)),
        });
        this.rightBorderBody.position.set(this.groundWidth / 2, 2.5, 0);
        this.world.addBody(this.rightBorderBody);

        // Set the background color
        this.scene.background = new THREE.Color(0x87ceeb);
    }

    update(skierPosition) {
        // Update ground and borders to center around the skier
        this.ground.position.z = skierPosition.z;

        this.leftBorder.position.z = skierPosition.z;
        this.leftBorderBody.position.z = this.leftBorder.position.z;

        this.rightBorder.position.z = skierPosition.z;
        this.rightBorderBody.position.z = this.rightBorder.position.z;
    }
}

export default Terrain;
