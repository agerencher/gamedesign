# Skiing Game Project

Welcome to the **Skiing Game Project**! This game is built using **Three.js** for 3D rendering and **Cannon.js (cannon-es)** for physics. Players control a skier navigating an infinite slope, collecting coins and avoiding obstacles. The game tracks the distance traveled and coins collected in each run.

---

## **Project Setup**

Follow these steps to set up and run the project locally:

### **Prerequisites**

Ensure you have the following installed on your system:

- **Node.js** (v14 or later) and **npm** (Node Package Manager)
- A code editor like **Visual Studio Code**
- A local development server (e.g., `http-server`)

### **Installation**

1. Clone this repository or download the ZIP file.
2. Open the project folder in your terminal.
3. Install the required dependencies:
   ```bash
   npm install
4. If you don’t have http-server installed globally, install it:
    npm install -g http-server

### **Running the Proj.**

1. Start the local server:
    http-server .
2. Open the project in your browser by navigating to:
    http://localhost:8080

### **Main Files/Classes**

index.html: The main HTML file for the game. It includes the <canvas> for rendering the game and UI elements for tracking distance and coins collected.

game.js: The entry point for the game. Initializes the GameManager class and starts the game loop.

GameManager.js: The central controller of the game. Manages the scene, camera, renderer, and interactions between the skier, terrain, and obstacles.

Skier.js: Defines the skier's appearance, movement, and interaction with the game world. Tracks the skier's distance traveled and coins collected.

Terrain.js: Manages the infinite slope and borders. Ensures the terrain extends seamlessly as the skier moves.

Obstacles.js: Handles the generation and management of obstacles (trees, jumps, rocks) and coins. Includes collision detection for coins and obstacles.

Coin.js: Represents individual coins in the game. Handles their creation, animation, and collection logic

### **Special Instructions**

The project uses the module versions of Three.js and Cannon.js. These are imported via CDN in the individual JavaScript files:

import * as THREE from 'https://unpkg.com/three@0.132.2/build/three.module.js';
import * as CANNON from 'https://cdn.jsdelivr.net/npm/cannon-es@0.20.0/dist/cannon-es.js';