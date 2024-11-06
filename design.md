Summary: This game is a skiing game where you can ski down different mountains and terrains. The user’s skier will be able to be customized by the user’s choice of helmet, skis, boots, and goggles. Mountains and runs based off of real-world locations

Theme: Cartoon theme without realistic graphics. 3rd Person viewing mode.


Design:
    Home Screen - all buttons will be colored with those that match with the background
        Customization - In the middle of the screen is your customizable skier as a 3D model, spinning slowly to show off its customization.
            When you click on the skier, it brings the user to a new page to customize

        Stats - Above the skier, it shows some stats: number of runs completed, and number of stars earned (this will all make sense later when the game is described)

        Explore - Under the skier, will be an “Explore button” which brings the user to the page where they can select the mountain they want to ski down.

        Settings - In the top right of the screen, there will be a settings button with a basic options menu with things like volume sliders and sensitivity sliders

        Background - The background of the home screen will be a detailed ski slope, with jumps, trees, and other skiers skiing down in the background

        Leaderboard - On the left hand side of the screen, there will be a leaderboard for stars completed.

    Cosmetics page
        Layout - This page will have the user’s skier in the middle, just a bit smaller.
        You will be able to click on any customizable part of the skier (boots, skis, googles, and helmet) which will bring a dropdown menu of all cosmetics for that part.

        Spin Wheel - To unlock cosmetics, there will be a wheel to spin on the right side of the screen and you will randomly get a cosmetic for any part
                To spin the wheel, it will cost a star (earned by completing runs) and then you will get a new cosmetic and will not be greyed out in the dropdown menu for that part
                When the cosmetic is equipped, the skier in the middle will change based on that cosmetic 

    “Explore” Mountains Page
        Mountains List - You will start at the top of the page where you will the mountains to choose from. As you scroll down the page, there will be more mountains, each with a pathway between another. 

        At the top of the page, your stats will show like the home page.

        Mountain Unlocking - As a first-time user, only the first mountain will be unlocked and available to play, the rest of the mountains will be greyed out and have a lock symbol over them.

        To play the mountain, the user has to click on the mountain which will bring them to a new page, showing all possible runs on the mountain.

        Completion Indicators - If all runs are completed on a mountain, on this page, the mountain will have a checkmark image over it. If all runs are completed with 3 stars on each run, the mountain will have a star image over it.

        At the bottom of the page, there will be a Home button, bringing the user back to the home page

        Progression - Once every run is completed on a select mountain, the next, “locked” mountain will be unlocked and playable. To unlock the next run, half of all stars will need to be collected. Ex: if there are 18 stars available on a mountain, 9 will have to be collected and all runs needs to have at least 1 star, in order to move to the next mountain

    Runs page
        Map - Here, the entire screen will be taken up by a map of the selected mountain

        At certain parts of the mountain, there will be run names that you can click on to complete the run. Under the run name, there will be the time completed for that run, and, similar to the explore mountains page, a checkmark or star

        Star tracker - At the top of the page, there will be a star count. Lets say there are 12 stars available on this mountain, and the user has collected 5, it will say 5/12 with a star icon next to it to tracker the user’s progress on that select mountain.

        Play - Clicking on a run will bring you into the game.

        At the bottom of the page, there will be a “Back” button to bring the user back to the explore page.

    Completed Run Screen
        After you win/lose a run (win 1-3 stars, lose 0 stars), the end screen will show your amount of stars won in the middle, your time for the run right under, a play again button, and a back to map button. The background on this screen will be your skier, either celebrating at the end of the run, or falling in the snow, if you lost with the bottom of a ski slope behind the skier.

Gameplay
    After clicking on a run, your skier will be at the top of the run, about to go down, but frozen in place.

    Start game - There will be a play button at the bottom of the screen, which will unfreeze the skier, and allow you to go down the run.

    The movement should be fluid with the user being adn to change direction with ease and speed up and brake without a jerk of the screen.
        Changing direction wont move the skier 90 degrees right or left, but will gradually point them in the directions they want to move

    Controls
        Computer: A and D for side to side movement. W and S for speed up and brake. Space bar for jump. R to do a trick

        Mobile: swipe side to side to change direction. There will be three buttons on the side for speed up, brake, and trick.
    
    Obstacles - On runs, there will be obstacles
        Other skers/snowboarders going down the mountain (not multiplayer, just npcs)
            If hit them, there will be a penalty

        Rocks, trees, and holes will be other obstacles

        Hitting an obstacle will slow down the user a lot and a dizzy animation will play.
        Technique Req - Some levels and run(the more difficult ones) will require certain movement techniques to be able to get down the mountain quick enough.
            Harder levels will also have more obstacles

        On more steep slopes, the user may lose control of their character bc their technique wasnt right and have to restart the level

    Stars
        2 stars will be granted for completing the run in a certian time
            1 if slower
            
        The last star will have to be collected somewhere on the run, whether that be through some trees, on a jump, of just on the run.

Phase 1: Basic Game Framework
Set Up Phaser Environment:

Initialize Phaser game instance.
Create scenes for Main Menu, Build Mode, and Ski Mode.
Design Core UI Elements:

Build Main Menu with options for "Play" and "Settings."
Add a "Leaderboard" screen for viewing high scores.
Phase 2: Ski Mode Core Gameplay
Skier Controls:

Controls: Implement A and D for left-right movement, W and S for acceleration/braking, Space for jump, and R for tricks.
Physics: Use Phaser's physics engine to handle skier momentum, friction, and gravity for realistic movement.
Smooth Turning: Implement gradual turning instead of abrupt changes.
Obstacles and Collisions:

Types of Obstacles: Define Tree, Rock, Other Skier.
Collision Detection: Use Phaser’s built-in collision detection to slow the player down and apply penalties for collisions.
Obstacle Placement: Randomly place obstacles on each run with varying difficulty.
Trick System:

Implement a basic trick system where players press R to perform tricks when jumping.
Scoring: Assign points based on trick duration and successful landing.
Star Collection and Scoring:

Add stars along runs, rewarding players for skillful navigation.
Time-Based Stars: Assign 1-3 stars based on completion time and trick points.
Display score and star count at the end of each run.
Phase 3: Progression and Unlocks
Mountain and Run Unlock System:

First Mountain: Start with the initial mountain unlocked.
Run Progression: Unlock new runs based on star count and time-based achievements.
Mountain Progression: When all runs on a mountain are completed, unlock the next mountain.
Player Progression:

Leveling Up: Players level up by earning stars, which unlocks new mountains and rewards.
Leaderboard Integration: Track fastest times and highest trick scores for each mountain.
Phase 4: Build Mode and Customization
Build Mode UI:

Display a catalog of terrain features like jumps, rails, and boxes.
Implement drag-and-drop to place features on a slope.
Free Camera: Allow players to move the camera around to view their park.
Cosmetic Customization:

Basic items: Skis, helmet, boots, and goggles.
Unlock items by leveling up or completing challenges (like collecting all stars on a mountain).
Allow players to equip items that alter gameplay stats, such as increased jump height or reduced friction.
Phase 5: Leaderboard and Competition
Leaderboard:

Track high scores and completion times per run.
Implement a backend API (using Express) to store and retrieve leaderboard data.
Daily Competitions:

Implement a rotating daily challenge, such as fastest time on a specific run.
Display winners and award points or exclusive items.
Phase 6: Testing and Optimization
Performance Testing:

Optimize Phaser scenes and assets for smooth performance across devices.
Test physics settings to ensure realistic movement and collision responses.
User Experience:

Refine controls for responsiveness and playability.
Adjust difficulty to ensure a smooth progression curve.
Summary of Class Relationships
GameManager:
Handles game state, unlocks, progression, and leaderboard.
Skier:
Manages movement, collision detection, and trick execution.
Run:
Defines obstacles, scoring, and star requirements.
Obstacle:
Tracks types and locations of obstacles.
Leaderboard:
Stores and retrieves high scores from the backend.





