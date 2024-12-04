// game.js
import GameManager from './GameManager.js';

document.addEventListener('DOMContentLoaded', () => {
   window.gameManager = new GameManager();
   gameManager.scene.gameManager = gameManager;
});