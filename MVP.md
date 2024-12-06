# **MVP.md**

## **Project Overview**

This skiing game simulates a skier navigating down an infinite slope, collecting coins and avoiding obstacles. The game features a third-person perspective, dynamic terrain, distance tracking, and coin collection. While the game is functional, several features remain to be implemented or refined to create a polished and engaging experience.

---

## **What Has Been Completed**

### **Core Gameplay**
- Skier movement:
  - Player-controlled skier with smooth movement along the X-axis.
  - Forward acceleration and distance tracking.
  - Collision detection with obstacles.
- Obstacles:
  - Randomly generated trees, rocks, jumps, and other skiers.
  - Obstacles dynamically appear ahead of the skier and are removed once far behind.
- Coins:
  - Sparse generation of coins along the slope.
  - Visual effects for coins (rotation).
- Infinite terrain:
  - Seamless terrain and border extension.
- UI:
  - Distance tracker that updates as the skier moves.
  - Coin tracker that increments as coins are collected.

---

## Completed edits
1. **Make coin functionality complete:**
   - Ensure the coin collection system works reliably.
   - Debug collision detection for coins to ensure consistency.
2. **Game reset on collision:**
   - Implement a reset or "game over" mechanic when the skier hits an obstacle.
   - Restart the game loop and reset UI counters.
## **Next Steps**

### **Immediate Fixes**

3. **Refine obstacle placement:**
   - Make obstacle placement less random to ensure that different routes or paths are viable.
   - Create patterns or clusters of obstacles for more strategic gameplay.

---

### **Additional Features**
1. **Home Screen:**
   - Add a home screen with a "Start Game" button.
   - Include a brief set of instructions or controls.

2. **Crash Animation:**
   - Animate the skier on collision (e.g., a fall animation).
   - Add a sound effect for the crash.

3. **End Screen:**
   - Display an end screen with:
     - Distance traveled.
     - Coins collected.
     - Option to restart the game.

4. **Enhance Terrain and Borders:**
   - Add more visual details to the terrain (e.g., snow texture, shadows).
   - Add boundary markers, such as poles or flags, along the borders.

5. **High Score Tracking:**
   - Implement a high score tracker for distance and coins collected.
   - Use `localStorage` to persist scores across sessions.

6. **Dynamic Difficulty:**
   - Gradually increase obstacle density as the player progresses.
   - Introduce faster-moving "other skiers" or larger clusters of obstacles.

---

## **Next Steps Timeline**

### Immediate Fixes
- Debug and finalize coin collection.
- Implement game reset mechanics.
- Refine obstacle placement.

### Gameplay Enhancements
- Add home screen and end screen.
- Implement crash animation and sound effects.

### Visual and Functional Improvements
- Add more details to terrain and borders.
- Implement high score tracking.
- Introduce dynamic difficulty scaling.

---

## **Project Roadmap**

This project aims to evolve from a functional skiing game prototype to a polished and engaging experience. The next steps focus on:
1. Debugging and completing core features (coin collection, resets).
2. Enhancing gameplay mechanics for smoother and more strategic play.
3. Improving visuals and adding user-friendly UI elements.
4. Creating replay value through high scores and dynamic difficulty.

---

## **Handoff Notes** written by GPT

If you're taking over this project:
- Refer to the `README.md` for setup instructions and file structure.
- Start by addressing the **Immediate Fixes** outlined above.
- Review `Obstacles.js` and `GameManager.js` for core game logic.
- Use `console.log` statements liberally to debug dynamic elements like coins and obstacles.
- Focus on modularity: Add new features in their own classes/files where possible to maintain clean, manageable code.