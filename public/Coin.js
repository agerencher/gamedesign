// Coin.js
import * as THREE from 'https://unpkg.com/three@0.132.2/build/three.module.js';
import * as CANNON from 'https://cdn.jsdelivr.net/npm/cannon-es@0.20.0/dist/cannon-es.js';

// Shared Coin Geometry and Material for optimization
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

class Coin {
    /**
     * Constructor for Coin.
     * @param {THREE.Scene} scene - The Three.js scene.
     * @param {CANNON.World} world - The CANNON.js physics world.
     */
    constructor(scene, world) {
        this.scene = scene;
        this.world = world;
        this.collected = false;

        // Create the coin mesh
        this.mesh = new THREE.Mesh(sharedCoinGeometry, sharedCoinMaterial);
        this.mesh.rotation.x = Math.PI / 2; // Lay flat on the ground
        this.scene.add(this.mesh);

        // Create the coin physics body
        const coinShape = new CANNON.Cylinder(0.5, 0.5, 0.1, 32);
        this.body = new CANNON.Body({
            mass: 0, // Static object
            shape: coinShape,
            position: new CANNON.Vec3(0, 1.5, 0), // Placeholder, set actual position when generating
        });
        this.body.quaternion.setFromEuler(Math.PI / 2, 0, 0); // Match rotation with the mesh
        this.world.addBody(this.body);
    }

    /**
     * Updates the coin's rotation for a spinning effect.
     */
    update() {
        if (!this.collected) {
            this.mesh.rotation.y += 0.05; // Rotate for visual effect
        }
    }

    /**
     * Handles the collection of the coin by the skier.
     */
    collect() {
        this.collected = true;
        this.mesh.visible = false;
        // Additional logic like incrementing score can be added here
    }
}

export default Coin;
