// GameManager.js

// Import Three.js and Cannon.js
import * as THREE from 'https://unpkg.com/three@0.132.2/build/three.module.js';
import * as CANNON from 'https://cdn.jsdelivr.net/npm/cannon-es@0.20.0/dist/cannon-es.js';

// Import other classes
import Skier from './Skier.js';
import Terrain from './Terrain.js';
import Obstacles from './Obstacles.js';
import Coin from './Coin.js';


class GameManager {
    constructor() {
        // Create the scene, camera, and renderer
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(
            75,
            window.innerWidth / window.innerHeight,
            0.1,
            2000
        );
        this.renderer = new THREE.WebGLRenderer({
            canvas: document.getElementById('gameCanvas'),
        });
        this.renderer.setSize(window.innerWidth, window.innerHeight);

        // Set camera position
        this.camera.position.set(0, 5, 10);
        this.camera.lookAt(0, 0, 0);

        // Initialize the physics world
        this.world = new CANNON.World();
        this.world.gravity.set(0, -9.82, 0);

        // Create the ground body (Cannon.js plane)
        const groundBody = new CANNON.Body({
            mass: 0,
            shape: new CANNON.Plane(),
        });
        groundBody.quaternion.setFromEuler(-Math.PI / 2, 0, 0);
        this.world.addBody(groundBody);

        // Initialize components
        this.skier = new Skier(this.scene, this.world);
        this.terrain = new Terrain(this.scene, this.world);
        this.obstacles = new Obstacles(this.scene, this.world, this.skier);

        this.distanceDisplay = document.getElementById('distanceDisplay');

        // Reference to the coin display element
        this.coinDisplay = document.getElementById('coinDisplay');

        // Initialize distance tracking
        this.startZPosition = 0; // Assuming skier starts at Z = 0
        this.distanceTraveled = 0;
        this.coinsCollected = 0;

        // Start animation loop
        this.animate = this.animate.bind(this);
        this.animate();
    }

    animate() {
        requestAnimationFrame(this.animate);

        // Step the physics world
        this.world.step(1 / 60);

        // Update skier
        this.skier.update();

        // Update obstacles
        this.obstacles.update();

        // Update terrain
        this.terrain.update(this.skier.getPosition());

        // Update distance traveled
        const skierPosition = this.skier.getPosition();
        this.distanceTraveled = Math.abs(this.startZPosition - skierPosition.z);
        this.updateDistanceDisplay();

        this.coinsCollected = this.skier.getCoinsCollected();
        this.updateCoinDisplay();

        // Update camera
        this.camera.position.set(
            skierPosition.x,
            skierPosition.y + 5,
            skierPosition.z + 10
        );
        this.camera.lookAt(skierPosition);

        // Render the scene
        this.renderer.render(this.scene, this.camera);
    }
    updateDistanceDisplay() {
        // Round the distance to the nearest integer
        const distance = Math.floor(this.distanceTraveled);
        this.distanceDisplay.textContent = `Distance: ${distance} meters`;
    }

    updateCoinDisplay() {
        this.coinDisplay.textContent = `Coins: ${this.coinsCollected}`;
    }
}

export default GameManager;
