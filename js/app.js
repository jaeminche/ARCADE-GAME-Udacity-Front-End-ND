// Whole-script strict mode syntax
"use strict";

/**
 * @file overview Classic Arcade Game Clone project for Udacity's Front-end NanoDegree.
 * @author Jae M. Choi <jaeminche@gmail.com>
 */


// TODO:
// - Add leader board
// - Add pause button
// - Add a combo bonus for three-serial gems collected


const allEnemies = [];

/**
 * @constant {number} Entities's default position
 * @default
 */
var initPos = {
    ENEMY_X : -120,
    ENEMY_Y : [62, 145, 229, 312, 395],
    PLAYER_X : 3 * 101,
    PLAYER_Y : 574, // 7 * 82
    GEM_X : [0, 101, 202, 303, 404, 505, 606, 707],
    GEM_Y : [62, 145, 229, 312, 395],
    ROCK_X : - 101,
    ROCK_Y : - 100
};

// Phrases for instructions, notifications, and gameover popups
var popupContents = {
    WELCOME : 'INSTRUCTIONS: Get some <span class="yellow">GEMS</span>, Block the bugs using <span class="red">SPACEBAR</span>, and Get to the water using <span class="red">ARROW KEYS</span> to win!!',
    TIP_MORE_BUG : 'You won! and LOOK OUT! \n <span class="red">ONE MORE BUG</span> is coming!!',
    TIP_FASTER_SPEED : 'You won! and \n NOW, THEY are getting <span class="red">FASTER!!</span>',
    TIP_SPACEBAR : 'Tip : Get <span class="yellow">GEMS</span>, and press <span class="red">SPACEBAR</span> to block the bugs!',
    TIP_ROCKS : 'Tip : <span class="yellow">Rocks</span> can block <span class="red">two bugs!</span>',
    GAMEOVER : '<span class="red">- GAMEOVER -</span> \n Press <span class="yellow">ENTER</span> or touch <span class="yellow">this</span> to play again!'
};

/**
 * Returns a random number out of an array
 * @param {number} array - entities' default coordinates options
 */
var getRandomNum = function(array) {
    return array[Math.floor(Math.random() * array.length)];
};

/**
 * Generate a parent class for entities
 * @class
 */
var Entities = function(x, y) {
    this.x = x;
    this.y = y;
};

/**
 * Draw the entities on the canvas
 */
Entities.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

/**
 * Generate an instance of Enemies
 * @class
 */
var Enemy = function(x, y) {
    // Inherit the rendering method and
    // initial x and y coordinates from its parent class, Entities
    Entities.call(this, x, y);

    // Set the enemy's speed with a max speed at 150 and a min speed at 30
    this.speed = Math.floor(Math.random() * 150) + 30;
    // Set the enemy's acceleration
    this.acceleration = 0;
    // Sets the enemy's image
    this.sprite = 'images/enemy-bug.png';
};

Enemy.prototype = Object.create( Entities.prototype );
Enemy.prototype.constructor = Enemy;

/**
 * Reset enemy at the default position with a randomly generated Y coordinate
 */
Enemy.prototype.reposition = function() {
    this.x = initPos.ENEMY_X;
    this.y = getRandomNum(initPos.ENEMY_Y);
};
/**
 * Add up some speed to the max speed
 * @param {number} numOfAcceleration - triggered if leveled up
 */
Enemy.prototype.accelerate = function(numOfAcceleration) {
    this.acceleration += numOfAcceleration;
    this.speed = Math.floor(Math.random() * (150 + this.acceleration)) + 30;
};

/**
 * Update the enemy's position
 * @param {number} dt - a time delta between ticks
 */
Enemy.prototype.update = function(dt) {
    // Multiply x coordinate by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    this.x += this.speed * dt;

    // Detect enemy out of the canvas, and reset its position
    if (this.x > 800) {
        this.reposition(0);
    }

    // Detect collision with player, and if collided,
    // subtract a gem from the gemPocket, and set the player at the default position
    if (player.x < this.x + 80 &&
       player.x + 70 > this.x &&
       player.y < this.y + 25 &&
       30 + player.y > this.y) {
        gemPocket--;
        player.reset();

        // if the player runs out of gems, she/he loses,
        // and show a gameover message pop-up
        if (gemPocket === -1) {
            popup.setContent(popupContents.GAMEOVER);
            // Pass parameters for opacity, autoHide, freeze_listen
            popup.show(0.8, false, true);
        }
    }
};

/**
 * Generate a player with x & y coodinates for the default position and ones for a previous move
 * @class
 */
var Player = function(x, y) {
    // Inherit the rendering method and
    // default x and y coordinates from its parent class, Entities
    Entities.call(this, x, y);

    this.sprite = 'images/char-boy.png';
    this.previousX = 0;
    this.previousY = 0;
};

Player.prototype = Object.create( Entities.prototype );
Player.prototype.constructor = Player;

/**
 * Update player's position
 */
Player.prototype.update = function() {
};

/**
 * Take as its input an user's input
 * among up, down, left, right, spacebar, and enter keys,
 * and produce as its output the player's coordinates if the keys were arrow keys
 * or a rock plantation if a spacebar
 */
Player.prototype.handleInput = function(pressedKey) {
    switch(pressedKey) {
        case 'up':
            this.y -= 83;
            this.previousY = -83;
            break;
        case 'down':
            this.y += 83;
            this.previousY = 83;
            break;
        case 'left':
            this.x -= 101;
            this.previousX = -101;
            break;
        case 'right':
            this.x += 101;
            this.previousX = 101;
            break;
        case 'enter':
            break;
    }

    // If player wins(reaches the water):
    if (this.y < 0) {
        // Take instances of planted rocks out of allRocksTemp array(out of canvas),
        for (let rock of allRocksTemp) {
            if (rock.planted === true) {
                let index = allRocksTemp.indexOf(rock);
                allRocksTemp.splice(index, 1);
            }
        }

        // Set the player on the default position, and set the level up
        this.reset();
        level.up();
        level.display();
    }

    // Set the player's move in the boundary of the canvas
    if (this.y > 574) {
        this.y -= 83;
    }
    if (this.x < 0) {
        this.x += 101;
    }
    if (this.x > 707) {
        this.x -= 101;
    }

    // If the player has more than one gem, pressing spacebar plants a rock instance
    if (pressedKey === 'spacebar' && gemPocket > 0) {
        allRocksTemp[gemPocket - 1].plant();
    }
    // Make all the pop-ups but the gameover pop-up disappear on a handle input
    if (popup.name != 'gameover') {
        $(".popup").css("opacity", 0);
    }
};

Player.prototype.reset = function() {
    this.x = initPos.PLAYER_X;
    this.y = initPos.PLAYER_Y;
};

/**
 * Generate a gem at a random position and can hide it
 * @class
 */
var Gem = function(x, y) {
    // Inherit the rendering method and
    // initial x and y coordinates from its parent class, Entities
    Entities.call(this, x, y);

    this.sprite = 'images/gem-orange.png';

};

Gem.prototype = Object.create( Entities.prototype );
Gem.prototype.constructor = Gem;

Gem.prototype.hide = function() {
    gem.x = undefined;
};

/**
 * Update the gem's appearance depending on its being collected
 */
Gem.prototype.update = function() {
    // How many gems the player collects is the number of rocks she/he can plant
    // Detect a gem collected, then add a gem in the gemPocket,
    // hide it from the canvas, and generate a rock object
    if (player.x < this.x + 80 &&
       player.x + 70 > this.x &&
       player.y < this.y + 25 &&
       30 + player.y > this.y) {
        gemPocket++;
        this.hide();
        level.rockGenerator();
    }
    // Display the number of rocks earned
    $(".num-rock").html(gemPocket);
};

/**
 * Generate a rock off the canvas for its default position
 * @class
 */
var Rock = function(x, y) {
    // Inherit the rendering method and
    // initial x and y coordinates from its parent class, Entities
    Entities.call(this, x, y);

    this.sprite = 'images/rock.png';
    this.detected = 0;
    this.planted = false;
};

Rock.prototype = Object.create( Entities.prototype );
Rock.prototype.constructor = Rock;

/**
 * Plant a rock on the left spot of the player
 */
Rock.prototype.plant = function() {
    this.x = player.x - 101;
    this.y = player.y;
    // Give the rock a 'true' for planted's boolean value
    this.planted = true;
    // A rock planted, a gem paid for it; subtract one from the gemPocket
    gemPocket--;
};

// TODO: The code below do not need to run every frame.
//      Perhaps nested loops for both enemies and rocks being executed would be necessary?
/**
 * Detect approach of entities, and make them get by it
 */
Rock.prototype.update = function() {
    // Detect collision with enemies, and slide the enemies down
    for (let enemy of allEnemies) {
        if (enemy.x < this.x + 80 &&
           enemy.x + 70 > this.x &&
           enemy.y < this.y + 25 &&
           30 + enemy.y > this.y) {
            enemy.y = enemy.y + 83;
            // if collided twice, set the rock off the canvas (it gets disappeared)
            this.detected++;
            if (this.detected === 2) {
                this.x = -100;
            }
        }
    }

    // Detect the player getting by, and make it unpenetratable
    if (player.x < this.x + 80 &&
       player.x + 70 > this.x &&
       player.y < this.y + 25 &&
       30 + player.y > this.y) {
        player.x = player.x - player.previousX;
        player.y = player.y - player.previousY;
    }

};

/**
 * Generate pop-ups
 * @class
 */
var Popup = function(content) {
    this.content = content;
};

Popup.prototype.setContent = function(content) {
    this.content = content;
};

/**
 * @param {number, boolean, boolean} - opacity, autoHide, freeze_listen
 */
Popup.prototype.show = function(opacityNum, autoHide, freeze_listen) {
    $(".popup div").html(this.content);
    $(".popup").css("opacity", opacityNum);

    if (autoHide) {
        // After 2.5 sec, pop-ups disappear automatically
        setTimeout(function() {
            $(".popup").css("opacity", 0);
        }, 2500);
    }

    if (freeze_listen) {
        // Listen only to an 'enter' key pressed back up, and reload the page to play it again
        $('html').bind('keydown', function(e) {
            if (e.keyCode != 13) {
                e.preventDefault();
                return false;
            } else {
                location.reload();
            }
        });
        // Disable the controller, and listen to a tap on the popup, and reload the page to play it again
        $('.rectangle').unbind('click');
        $('.popup').on('click', function(e) {
            location.reload();
        });
    }
};

/**
 * Helper Class object for leveling up each round, generating enemy and rock objects, and displaying the panel
 * @class
 */
var Level = function() {
    // leveling up
    this.level = 1;
    this.numberOfEnemies = 2;
    this.score = 0;
};

// TODO: create other conditions under which another enemy instance gets generated or gets killed

// Generate as many enemy instances as it's set for each Level object having been leveled up
Level.prototype.enemyGenerator = function() {
    while (allEnemies.length < this.numberOfEnemies) {
        // Create an enemy instance with its default position
        // on an x and a randomly generated y coordinates
        const enemy = new Enemy(initPos.ENEMY_X, getRandomNum(initPos.ENEMY_Y));
        allEnemies.push(enemy);
        this.display();
    }
};

// Generate and push a rock instance into 'allRocksTemp' array
Level.prototype.rockGenerator = function() {
    const rock = new Rock(initPos.ROCK_X, initPos.ROCK_Y);
    allRocksTemp.push(rock);
};

// Display data on the panel
Level.prototype.display = function() {
    $(".level").html(this.level);
    $(".numBugs").html(this.numberOfEnemies);
    const enemiesSpeeds = [];
    for (let enemy of allEnemies) {
        enemiesSpeeds.push(enemy.speed);
    }
    // display the highest speed of the fasted bug generated
    function getMaxSpeed(numArray) {
        return Math.max.apply(null, numArray);
    }
    highestSpeed = getMaxSpeed(enemiesSpeeds);
    $(".highestSpeed").html(highestSpeed);
};


/**
 * If leveled up, add up one level and the score,
 * generate a new gem instance and a new enemy or speed,
 * and show pop-ups on each new game
 */
Level.prototype.up = function() {
    this.level++;
    this.score += this.numberOfEnemies * highestSpeed;
    $(".score").html(this.score);
    gem = new Gem(getRandomNum(initPos.GEM_X), getRandomNum(initPos.GEM_Y));
    if (this.numberOfEnemies < 7) { // only if under 7 enemies, add an enemy
        this.numberOfEnemies++;
    } else { // if over 7 enemies, accelerate enemies's speed
        for (let enemy of allEnemies) {
            enemy.accelerate(40);
        }
    }

    // Call enemy instance generation function, which
    // will detect conditions under which another enemy instance gets generated,
    // for instance : level-up followed by player's win
    level.enemyGenerator();

    // Show a notification pop-up in accordance of level numbers
    switch (true) {
        case this.level % 5 == 0:
            popup.setContent(popupContents.TIP_ROCKS);
            break;
        case this.level % 3 == 0:
            popup.setContent(popupContents.TIP_SPACEBAR);
            break;
        case this.level < 7:
            popup.setContent(popupContents.TIP_MORE_BUG);
            break;
        default:
            popup.setContent(popupContents.TIP_FASTER_SPEED);
    }
    // Pass parameters for opacity, autoHide, freeze_listen
    popup.show(0.7, true, false);
};

// Instantiate objects, and initialize variables
let gemPocket = 0;
let highestSpeed = 0;
const level = new Level();
level.enemyGenerator();
const allRocksTemp = [];
const player = new Player(initPos.PLAYER_X, initPos.PLAYER_Y);
level.display();
let gem = new Gem(getRandomNum(initPos.GEM_X), getRandomNum(initPos.GEM_Y));
let rock = new Rock(initPos.ROCK_X, initPos.ROCK_Y);
const popup = new Popup(popupContents.WELCOME);
// Pass parameters for opacity, autoHide, freeze_listen
popup.show(0.8, false, false);

// Listen for key presses,
// and pass the user's input as a parameter to Player.handleInput() method
document.addEventListener('keydown', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down',
        13: 'enter',
        32: 'spacebar'
    };
    player.previousX = 0;
    player.previousY = 0;
    player.handleInput(allowedKeys[e.keyCode]);
});

// Listen for a touch or a click on the controller,
// and pass the user's input as a parameter to Player.handleInput() method
$('.rectangle1').on("click", function(event) {
    player.handleInput('left');
});
$('.rectangle2').on("click", function(event) {
    player.handleInput('up');
});
$('.rectangle3').on("click", function(event) {
    player.handleInput('down');
});
$('.rectangle4').on("click", function(event) {
    player.handleInput('right');
});
$(".rock-button-controller").on("click", function(event) {
    player.previousX = 0;
    player.previousY = 0;
    player.handleInput('spacebar');
});