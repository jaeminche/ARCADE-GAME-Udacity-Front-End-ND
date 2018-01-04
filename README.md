# Classic Arcade Game Clone

###### Project Overview

I created a classic arcade game with provided visual assets and a game loop engine by adding a number of entities to the game including player characters and skills, enemies, and collectable items.
(Project of Udacity's [Front-End Web Developer Nanodegree](https://www.udacity.com/course/front-end-web-developer-nanodegree--nd001))


## Table of Contents

* [Getting Started](#Getting-Started)
* [How to Play](#How-to-Play)
* [Basic Features](#basic-features)
* [To see the given instruction from Udacity](#to-see-the-given-instruction-from-udacity)
* [Contributing](#Contributing)

## Getting Started

##### Online

Point your browser to https://jaeminche.github.io/build_portfolio_site/projects_copy/frogger_arcade/index.html

##### Local

###### 1. Clone this repo

```
$ git clone https://github.com/jaeminche/ARCADE-GAME-Udacity-Front-End-ND.git
````

###### 2. Open 'index.html'.


## How to play


##### GOAL:

Reach the water, avoiding collision with the enemies.

##### Player's Move:
1. Move left, right, up and down : Arrow keys
2. Block enemies by planting rocks on his/her left : Spacebar
    - The number of rocks the player can plant depends on how many gems she/he collects.
    - A rock can block two enemies, and then disappears.

##### Enemies' Character
1. Move in varying speeds on the paved block portion of the scene.
2. As level goes up, the number of enemies increase up to 7, and their speeds get faster afterwards.

##### Gems & Rocks & Lives
1. Gems means two things: Rock and live.
2. If the player collects a gem, she/he gets a chance to plant a rock.
3. Planting a rock or colliding into an enemy means spending a live.

##### Gameover
1. Once the player collides with an enemy, the game is reset and the player moves back to the default position, and the player loses one gem. Once the player reaches the water the game is won.
2. If the player collides into an enemy having no gem, she/he loses the game.

##### Play Again
Press an enter key or touch the game-over pop-up to restart the game on a game-over.

## Basic Features

Game objects (player and enemies) are implemented using JavaScript object-oriented programming features.
The game includes following features including interactivity:

    1. Player can collect gems.
    2. Player can plant a rock and block enemies.
    3. Pop-ups appear and player's position resets when player wins or loses.
    4. Score increases each time the player reaches the water.
	5. Player only moves inside the screen.
	6. Enemies cross the screen.
	7. Vehicle-player collisions happen logically (not too early or too late).
	8. Vehicle-player collision resets the game.
	9. Device-responsive design

## To see the given instruction from Udacity

If you want to see what's been provided from Udacity and what's not, refer to https://docs.google.com/document/d/1v01aScPjSWCCWQLIpFqvg3-vXLH2e8_SZQKC8jNO0Dc/pub?embedded=true


## Contributing

I'd love to accept pull requests.

For details, check out [CONTRIBUTING.md](CONTRIBUTING.md).