// GameManager.js
import * as THREE from 'https://unpkg.com/three@0.132.2/build/three.module.js';
import * as CANNON from 'https://cdn.jsdelivr.net/npm/cannon-es@0.20.0/dist/cannon-es.js';
import Skier from './Skier.js';
import Terrain from './Terrain.js';
import Obstacles from './Obstacles.js';

class GameManager {
   constructor() {
       this.gameActive = true;
       this.setupScene();
       this.setupPhysics();
       this.setupComponents();
       this.setupUI();
       this.setupEventListeners();
       this.animate();
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
   }

   setupUI() {
       this.distanceDisplay = document.getElementById('distanceDisplay');
       this.coinDisplay = document.getElementById('coinDisplay');
       this.gameOverScreen = document.getElementById('gameOverScreen');
       this.finalScore = document.getElementById('finalScore');
       this.finalCoins = document.getElementById('finalCoins');
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

   animate() {
       if (!this.gameActive) return;
       
       requestAnimationFrame(this.animate.bind(this));

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

export default GameManager;