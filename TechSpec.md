# Technology Stack

## Candidates

- three.js; simple library for rendering 3d graphics
- cannon.js pairs nicely with three.js for physics

## Other Options

- babylon.js: seems wayy too complicated for the scope of this project
- PlayCanvas.js: tutorials seem difficult to follow and initially confusing for beginners

# Architecture

## GameManager

- Manages the overall game state, including the level progression, score, and game flow. It communicates with other game components like the skier, obstacles, and physics engine.

### Variables

- level: int - Tracks the current level or stage of the game.
- score: int - Player’s score, typically based on coins collected or distance traveled.
- lives: int - Number of lives remaining.
- isGameOver: boolean - Indicates if the game is over (player crashed or quit).
- player: Skier - Instance of the player character (skier).
- terrain: Terrain - Object that represents the mountain terrain (slopes, jumps, paths).
- timeElapsed: float - Total time spent in the current run.
- isPaused: boolean - Indicates if the game is paused.

### Methods

- initializeGame()
  Behavior: Initializes the game state, sets score, lives, and level to defaults, and prepares the initial game objects.
- startLevel()
  Behavior: Sets up the initial level layout, including terrain, obstacles, and player position, and starts the game physics.
- endLevel()
  Behavior: Ends the current level, possibly unlocking new levels or rewards. Increments the level counter, and checks if the game is over.
- updateScore()
  Input: int points - Adds points based on player actions (coins collected, distance covered).
  Behavior: Increases the score.
- resetGame()
  Behavior: Resets the game to the initial state, clearing all game objects and resetting variables like score, lives, and level.
- toggleGamePause()
  Behavior: Pauses or unpauses the game by setting isPaused.
- tickGamePlay()
  Behavior: Advances the game by updating the positions of the skier, checking for collisions, and handling game logic (e.g., collecting coins or losing lives).

## Skier

Represents the skier controlled by the player. Handles the movement, animations, and interaction with obstacles and terrain.

### Variables

- position: THREE.Vector3 - The current position of the skier in 3D space.
- velocity: THREE.Vector3 - The current velocity of the skier.
- rotation: THREE.Quaternion - The rotation of the skier (important for turning).
- rigidBody: Cannon.Body - The Cannon.js rigid body that handles the skier’s physics (gravity, friction, collisions).
- model: THREE.Object3D - The 3D model of the skier (e.g., a GLTF or OBJ file loaded into the game).
- isJumping: boolean - Indicates if the skier is in mid-air after a jump.
- isCrashed: boolean - True if the skier has crashed into an obstacle.

### Methods

- initializeSkier()
  Behavior: Loads the skier’s model, creates a rigid body, and sets up initial physical properties like mass and friction.
- moveSkier()
  Input: direction: string - Determines the direction of movement (e.g., forward, left, right).
  Behavior: Applies movement controls based on user input (e.g., using WASD or arrow keys for keyboard, or swipes for mobile).
- jump()
  Behavior: Applies an upward impulse to the skier when the player presses the jump button.
- rotate()
  Input: angle: float - Rotates the skier smoothly based on user input.
- update()
  Behavior: Updates the skier's position, velocity, and state (jumping, turning).
- crash()
  Behavior: Detects a collision with an obstacle, and if the skier crashes, triggers a game-over condition or loss of life.

## Terrain

Handles the mountain slope, paths, jumps, and obstacles. It controls the layout of the ski run, the placement of obstacles, and how the skier interacts with the terrain.

### Variables

- terrainMesh: THREE.Mesh - The 3D terrain object, typically a large plane or set of meshes representing the ski slope.
- obstacles: List<Obstacle> - List of obstacles (trees, rocks, NPC skiers, etc.) placed on the terrain.
- coins: List<Coin> - Coins scattered across the slope for the player to collect.
- terrainShape: Cannon.Body - The physical representation of the terrain, used for collision detection with the skier.

### Methods

- initializeTerrain()
  Behavior: Loads the terrain, placing obstacles and other interactable elements (like jumps) in the environment.
- updateTerrain()
  Behavior: Throws out past terrain/coins/obstacles and generates new, fluid terrain/coins/obstacles
- checkSlope()
  Input: Vector3 position - Checks the slope at the given position to determine if the skier is on an incline, flat ground, or downhill.
  Output: float - Returns the angle of the slope, which can affect the skier’s velocity.

## Obstacle

Represents an object on the slope that the player must avoid, such as a tree, rock, or another skier. These objects interact with the skier’s physics.

### Variables

- position: THREE.Vector3 - The 3D position of the obstacle.
- model: THREE.Object3D - The 3D model of the obstacle.
- rigidBody: Cannon.Body - The physical body for the obstacle, used for collisions.
- type: enum - The type of obstacle (e.g., tree, rock, NPC skier).

### Methods

- initializeObstacle()
  Behavior: Loads the 3D model and assigns physical properties to the obstacle.
- checkCollisionWithSkier()
  Behavior: Detects if the skier collides with the obstacle and handles the appropriate response (e.g., slow down, crash, or bounce).
- applyEffects()
  Behavior: Defines the effects of hitting the obstacle (e.g., crash, slow down, dizzy animation).

## Coin

Represents collectible coins scattered across the terrain for the skier to collect.

### Variables

position: THREE.Vector3 - The position of the coin.
model: THREE.Object3D - The 3D model of the coin.
isCollected: boolean - Whether the coin has been collected by the player.

### Methods

- initializeCoin()
  Behavior: Places a coin at a random or predefined location on the slope.
- collectCoin()
  Behavior: Checks if the skier has collected the coin and updates the score accordingly.

# Data Model

https://www.figma.com/board/FvIGDkrEn6VCOn1RObXb4r/Untitled?node-id=0-1&t=yfdamC8gmrgPTfQz-1
