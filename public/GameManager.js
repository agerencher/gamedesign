// GameManager.js
import * as THREE from 'https://unpkg.com/three@0.132.2/build/three.module.js';
import * as CANNON from 'https://cdn.jsdelivr.net/npm/cannon-es@0.20.0/dist/cannon-es.js';
import Skier from './Skier.js';
import Terrain from './Terrain.js';
import Obstacles from './Obstacles.js';

class GameManager {
    constructor() {
        this.gameActive = false;
        this.setupScene();
        this.setupPhysics();
        this.setupComponents();
        this.setupUI();
        this.setupEventListeners();

        // Home screen handling
        this.homeScreen = document.getElementById('homeScreen');
        document.getElementById('startButton').addEventListener('click', () => {
            this.startGame();
        });
    }

    /**
     * Initializes the Three.js scene, camera, and renderer.
     */
    setupScene() {
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(
            75,
            window.innerWidth / window.innerHeight,
            0.1,
            2000
        );
        this.renderer = new THREE.WebGLRenderer({
            canvas: document.getElementById('gameCanvas'),
            antialias: true, // Optional: smoother edges
        });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(window.devicePixelRatio); // Handle high-DPI screens
        this.camera.position.set(0, 5, 10);
        this.camera.lookAt(0, 0, 0);
    }

    /**
     * Sets up the CANNON.js physics world.
     */
    setupPhysics() {
        this.world = new CANNON.World();
        this.world.gravity.set(0, -9.82, 0); // Earth gravity

        // Ground Plane
        const groundBody = new CANNON.Body({
            mass: 0, // Static
            shape: new CANNON.Plane(),
        });
        groundBody.quaternion.setFromEuler(-Math.PI / 2, 0, 0); // Rotate to make it horizontal
        this.world.addBody(groundBody);
    }

    /**
     * Initializes game components: skier, terrain, and obstacles.
     */
    setupComponents() {
        this.skier = new Skier(this.scene, this.world);
        this.terrain = new Terrain(this.scene, this.world);
        this.obstacles = new Obstacles(this.scene, this.world, this.skier);
        this.startZPosition = 0;
        this.distanceTraveled = 0;
        this.coinsCollected = 0;
    }

    /**
     * Sets up the user interface elements.
     */
    setupUI() {
        this.distanceDisplay = document.getElementById('distanceDisplay');
        this.coinDisplay = document.getElementById('coinDisplay');
        this.zDisplay = document.getElementById('zDisplay'); // Access Z-Axis Display
        this.gameOverScreen = document.getElementById('gameOverScreen');
        this.finalScore = document.getElementById('finalScore');
        this.finalCoins = document.getElementById('finalCoins');
    }

    /**
     * Sets up event listeners for window resize and game controls.
     */
    setupEventListeners() {
        window.addEventListener('resize', () => {
            this.camera.aspect = window.innerWidth / window.innerHeight;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(window.innerWidth, window.innerHeight);
        });

        document.getElementById('restartButton').addEventListener('click', () => {
            this.restartGame();
        });
    }

    /**
     * Starts the game by hiding the home screen and initiating the game loop.
     */
    startGame() {
        this.homeScreen.style.display = 'none';
        this.gameActive = true;
        this.animate();
    }

    /**
     * Handles game over logic by displaying the game over screen and final scores.
     */
    gameOver() {
        this.gameActive = false;
        this.gameOverScreen.style.display = 'block';
        this.finalScore.textContent = `Distance: ${Math.floor(this.distanceTraveled)} meters`;
        this.finalCoins.textContent = `Coins: ${this.coinsCollected}`;
    }

    /**
     * Restarts the game by reloading the page.
     */
    restartGame() {
        location.reload();
    }

    /**
     * Updates the distance display based on the skier's position.
     */
    updateDistanceDisplay() {
        const distance = Math.floor(this.distanceTraveled);
        this.distanceDisplay.textContent = `Distance: ${distance} meters`;
    }

    /**
     * Updates the coin display based on coins collected.
     */
    updateCoinDisplay() {
        this.coinDisplay.textContent = `Coins: ${this.coinsCollected}`;
    }

    /**
     * Updates the Z-Axis Position Display.
     */
    updateZDisplay() {
        const skierPosition = this.skier.getPosition();
        this.zDisplay.textContent = `Z Position: ${skierPosition.z.toFixed(2)} m`;
    }

    /**
     * The main animation loop called each frame.
     */
    animate() {
        if (!this.gameActive) return;

        requestAnimationFrame(this.animate.bind(this));

        // Step the physics world
        this.world.step(1 / 60);

        // Update game components
        this.skier.update();
        this.obstacles.update();
        this.terrain.update(this.skier.getPosition());

        // Update distance and coins
        const skierPosition = this.skier.getPosition();
        this.distanceTraveled = Math.abs(this.startZPosition - skierPosition.z);
        this.coinsCollected = this.skier.getCoinsCollected();

        // Update UI displays
        this.updateDistanceDisplay();
        this.updateCoinDisplay();
        this.updateZDisplay(); // Update Z-Axis Display

        // Update camera position to follow the skier
        this.camera.position.set(
            skierPosition.x,
            skierPosition.y + 5,
            skierPosition.z + 10
        );
        this.camera.lookAt(skierPosition);

        // Render the scene
        this.renderer.render(this.scene, this.camera);
    }
}

export default GameManager;
