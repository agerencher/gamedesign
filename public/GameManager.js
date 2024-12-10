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

        this.homeScreen = document.getElementById('homeScreen');
        document.getElementById('startButton').addEventListener('click', () => {
            this.startGame();
        });
    }

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
        });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.camera.position.set(0, 5, 10);
        this.camera.lookAt(0, 0, 0);
    }

    setupPhysics() {
        this.world = new CANNON.World();
        this.world.gravity.set(0, -9.82, 0);
        const groundBody = new CANNON.Body({
            mass: 0,
            shape: new CANNON.Plane(),
        });
        groundBody.quaternion.setFromEuler(-Math.PI / 2, 0, 0);
        this.world.addBody(groundBody);
    }

    setupComponents() {
        this.skier = new Skier(this.scene, this.world);
        this.terrain = new Terrain(this.scene, this.world);
        this.obstacles = new Obstacles(this.scene, this.world, this.skier);
        this.startZPosition = 0;
        this.distanceTraveled = 0;
        this.coinsCollected = 0;

        // Player death control
        this.playerDead = false;
        this.deathAnimationProgress = 0;
        this.deathSide = 1; // Default if not set otherwise
    }

    setupUI() {
        this.distanceDisplay = document.getElementById('distanceDisplay');
        this.coinDisplay = document.getElementById('coinDisplay');
        this.gameOverScreen = document.getElementById('gameOverScreen');
        this.finalScore = document.getElementById('finalScore');
        this.finalCoins = document.getElementById('finalCoins');
        // Removed zDisplay entirely
    }

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

    startGame() {
        const video = document.getElementById('transitionVideo');
        video.style.display = 'block';
        video.play();
    
        video.onended = () => {
            video.style.display = 'none'; // Hide the video after it ends
            this.homeScreen.style.display = 'none'; // Hide the home screen
            this.gameActive = true; // Start the game
            this.animate(); // Begin game animation loop
        };
    }

    gameOver() {
        this.gameActive = false;
        this.gameOverScreen.style.display = 'block';
        this.finalScore.textContent = `Distance: ${Math.floor(this.distanceTraveled)} meters`;
        this.finalCoins.textContent = `Coins: ${this.coinsCollected}`;
    }

    restartGame() {
        location.reload();
    }

    updateDistanceDisplay() {
        const distance = Math.floor(this.distanceTraveled);
        this.distanceDisplay.textContent = `Distance: ${distance} meters`;
    }

    updateCoinDisplay() {
        this.coinDisplay.textContent = `Coins: ${this.coinsCollected}`;
    }

    /**
     * Trigger the death animation with a given side
     * @param {number} side - -1 for left side death, +1 for right side death
     */
    triggerDeath(side) {
        this.playerDead = true;
        this.deathAnimationProgress = 0;
        this.deathSide = side;

        // Store initial camera state
        this.deathCameraStartPosition = this.camera.position.clone();
        this.deathCameraStartFOV = this.camera.fov;

        // No immediate gameOver call, we run death animation first
    }

    animate() {
        if (!this.gameActive) return;

        requestAnimationFrame(this.animate.bind(this));

        if (this.playerDead) {
            this.runDeathAnimation();
        } else {
            // Normal game logic
            this.world.step(1 / 60);
            this.skier.update();
            this.obstacles.update();
            this.terrain.update(this.skier.getPosition());

            const skierPosition = this.skier.getPosition();
            this.distanceTraveled = Math.abs(this.startZPosition - skierPosition.z);
            this.coinsCollected = this.skier.getCoinsCollected();

            this.updateDistanceDisplay();
            this.updateCoinDisplay();

            this.camera.position.set(
                skierPosition.x,
                skierPosition.y + 5,
                skierPosition.z + 10
            );
            this.camera.lookAt(skierPosition);

            this.renderer.render(this.scene, this.camera);
        }
    }

    runDeathAnimation() {
        const duration = 120; // ~2 seconds at 60fps
        this.deathAnimationProgress += 1 / duration;
        if (this.deathAnimationProgress > 1) this.deathAnimationProgress = 1;

        const skierPos = this.skier.getPosition();

        // We'll swing around the player along an arc just like before
        // Angle 0 = behind the player, π = in front of the player
        const angle = THREE.MathUtils.lerp(0, Math.PI, this.deathAnimationProgress);

        // Reduced radius to 5
        const radius = 5;

        // Vertical positioning
        const startHeight = skierPos.y + 5; // starting behind and above
        const endHeight = skierPos.y + 2;   // end closer to skier's head
        const currentHeight = THREE.MathUtils.lerp(startHeight, endHeight, this.deathAnimationProgress);

        // Introduce a slight offset to the final position depending on deathSide
        // We want the camera to end a little off-center. Let's say offsetX = 1 unit
        const offsetX = 2 * this.deathSide;

        // Compute camera X/Z on the arc
        // angle=0: behind player (z+radius)
        // angle=π: in front of player (z-radius)
        // We'll apply offsetX at the end position. Interpolate angle on a perfect arc, then add offset near the end.

        // Basic arc without offset:
        let cameraX = skierPos.x + radius * Math.sin(angle);
        let cameraZ = skierPos.z + radius * Math.cos(angle);

        // As we approach the end, we add horizontal offset:
        // At deathAnimationProgress=1, we add full offsetX.
        // Use the same progress for offset blending:
        cameraX += offsetX * this.deathAnimationProgress;

        // Ensure camera does not travel outside walls
        // Suppose walls are at ±8.335 (half of 16.67)
        const wallLeft = -8.335;
        const wallRight = 8.335;

        // If cameraX would be outside walls, adjust logic:
        if (cameraX < wallLeft) {
            // If going left is impossible, try right side or clamp
            cameraX = Math.max(cameraX, wallLeft);
        } else if (cameraX > wallRight) {
            // If going right is impossible, try left side or clamp
            cameraX = Math.min(cameraX, wallRight);
        }

        this.camera.position.set(cameraX, currentHeight, cameraZ);

        // Interpolate FOV
        const originalFOV = this.deathCameraStartFOV;
        const finalFOV = 40;
        const newFOV = THREE.MathUtils.lerp(originalFOV, finalFOV, this.deathAnimationProgress);
        this.camera.fov = newFOV;
        this.camera.updateProjectionMatrix();

        // Look at skier's head
        const lookAtPos = skierPos.clone();
        lookAtPos.y += 1;
        this.camera.lookAt(lookAtPos);

        this.renderer.render(this.scene, this.camera);

        if (this.deathAnimationProgress >= 1) {
            this.gameOver();
        }
    }
}

export default GameManager;
