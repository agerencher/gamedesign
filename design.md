# Skiing Adventure Game Design

## Summary

This game is a **Subway Surfers**-like game but with skiing. The user’s skier can be customized by choosing a helmet, skis, boots, and goggles. The mountains and runs are based on real-world locations.

- **Theme**: Cartoonish style with non-realistic graphics.
- **View Mode**: 3rd Person perspective.

---

## Design

### Home Screen

- **Buttons**: All buttons are color-coordinated to match the background.
- **Customization**:

  - In the middle of the screen, the skier is displayed as a 3D model, spinning slowly to showcase the customization.
  - Clicking on the skier opens a new page for customization.

- **Stats**:

  - Displayed above the skier:
    - Most coins collected
    - Longest time played

- **Play**:

  - Under the skier is a “Play” button that leads the user into the game.

- **Settings**:

  - Located in the top-right corner, opens a basic options menu with volume sliders and sensitivity sliders.

- **Background**:

  - Features a detailed ski slope, with jumps, trees, and NPC skiers skiing down.

- **Leaderboard**:
  - On the left-hand side of the screen, there is a leaderboard for stars completed.

### Cosmetics Page

- **Layout**:
  - The skier is displayed in the middle, slightly smaller.
- **Customization**:
  - The player can click on any customizable part of the skier (boots, skis, goggles, and helmet) to open a dropdown menu with available cosmetics for that part.
- **Spin Wheel**:
  - To unlock cosmetics, a wheel is available on the right side of the screen.
  - Each spin costs one star (earned by completing runs) and grants a new cosmetic item for any part.
  - Once unlocked, the cosmetic will no longer be grayed out in the dropdown menu.
  - When a cosmetic is equipped, the skier in the center will update to reflect the change.

### End Screen

- After losing, the end screen shows:

  - Time played
  - Amount of coins collected
  - A "Play Again" button
  - A "Back to Home" button

- **Background**:
  - The background shows the skier’s crash, either into a rock, tree, or another skier, reflecting how the player lost.
  - Pan to the crashed skiier, fade into stats/end screen

---

## Gameplay

### Cut-Scene

- After clicking **Play**, a cutscene shows the skier getting off a chairlift and heading toward the slope. The player can begin playing once they reach the slope.

### Movement

- The skier’s movement should be fluid, allowing the player to change direction smoothly and speed up or brake without jerky animations.
- **Direction**:
  - Changing direction doesn’t snap the skier 90 degrees right or left but gradually turns them in the desired direction.

### Controls

- **Computer**:
  - **A and D**: Move side to side
  - **Spacebar**: Jump
  - **R**: Perform a trick
- **Mobile**:
  - **Swipe**: Move side to side
  - **Button**: On-screen button to perform a trick

### Obstacles

- **NPC Skiers/Snowboarders**:
  - Other skiers or snowboarders are randomly placed on the slopes. Colliding with them results in a loss.
- **Environmental Obstacles**:
  - **Rocks, Trees, and Holes**:
    - Slightly hitting an obstacle will slow the skier significantly and trigger a dizzy animation.
    - Fully ramming into an obstacle will cause the skier to lose.
- **Technique Requirements**:
  - Some levels and runs (particularly the more difficult ones) will require specific movement techniques to navigate quickly enough.
  - Harder levels will have more obstacles.
  - On steeper slopes, the skier may lose control if the technique isn’t correct, requiring a restart.

### Coins

- Coins are scattered throughout the slopes and can be collected by the player.

### Jumps

- Small and large jumps are placed along the slopes, offering extra coins when completed.

### Routes

- **Free Movement**: Unlike Subway Surfers, which has fixed columns, this game allows free movement in any direction.
  - Obstacles are randomly placed, allowing for more creative navigation.
- **Extra Routes**:
  - Some routes pass through trees or lead to other parts of the mountain.
  - These routes may have more obstacles or be easier to navigate (still undecided).

### Function of the Slope

- **Endless Slope**:
  - The slope is infinite; as the player progresses, more of the slope is generated ahead of them.
- **Increasing Difficulty**:
  - As the player advances, their speed increases, and more obstacles appear faster, making it progressively harder to survive.

---

## Additional Notes

- **3rd-Person View**: The skier is always seen from behind, facing down the slope.
- **Procedural Generation**: The game world is procedurally generated, creating endless runs with varying difficulty.
- **Difficulty Curve**: As the player progresses, the game becomes more difficult, with more obstacles, higher speeds, and more challenging routes.
