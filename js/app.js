/**
 * @file overview Classic Arcade Game Clone project for Udacity's FEND.
 * @author Jae M. Choi <jaeminche@gmail.com>
 */


// TODO:
// - Add leader board
// - Add pause button
// - Add a combo bonus for three-serial gems collected


/**
 * Generate an instance of Enemies
 * @class
 */
var Enemy = function() {
    // Set the enemy's default position with an x coordinate and a randomly generated y coordinate from initPosY array
    const initPosX = -120;
    const initPosY = [62, 145, 229, 312, 395];
    // Get added up to enemy's speed
    let acceleration = 0;
    this.x = initPosX;
    this.y = initPosY[Math.floor(Math.random() * initPosY.length)];
    // Set the enemy's speed with a max speed at 150 and a min speed at 50
    this.speed = Math.floor(Math.random() * 150) + 50;
    // Sets the enemy's image
    this.sprite = 'images/enemy-bug.png';
    /**
     * Reset enemy at the default position with a randomly generated Y coordinate
     */
    this.reposition = function() {
        this.x = initPosX;
        this.y = initPosY[Math.floor(Math.random() * initPosY.length)];
    };
    /**
     * Add up some speed(40) to the max speed
     * @param {number} acceleration speed - triggered if leveled up
     */
    this.acceleration = function(accelerate) {
        acceleration += accelerate;
        this.speed = Math.floor(Math.random() * (150 + acceleration)) + 50;
    };
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
    // Call enemy instance generation function, which
    // will detect conditions under which another enemy instance gets generated,
    // for instance : level-up followed by player's win
    level.enemyGenerator();

    // Detect collision with player, and if collided,
    // subtract a gem from the gemPocket, and set the player at the default position
    if (player.x < this.x + 80 &&
       player.x + 70 > this.x &&
       player.y < this.y + 25 &&
       30 + player.y > this.y) {
        gemPocket--;
        player.x = 3 * 101;
        player.y = 574;
        // if player runs out of gems, she/he loses,
        // and show a gameover message
        if (gemPocket === -1) {
            popup.gameover();
            popup.show_gameover();
        }
    }
};

/**
 * Draw the enemy on the canvas
 */
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

/**
 * Generate a player with x & y coodinates for the default position and ones for a previous move
 * @class
 */
var Player = function() {
    this.sprite = 'images/char-boy.png';
    this.x = 3 * 101;
    this.y = 574; // 7 * 82;
    this.previousX = 0;
    this.previousY = 0;
};

Player.prototype.controller = function() {
    // $('.rotate').css("transform-origin", 50%, 50%);
    // $('.rotate').css("top", this.y);
    // $('.rotate').css("left", this.x);
    // $('.rotate').css("top", this.y - ($('.rectangle').width()) + 101);
    // $('.rotate').css("left", this.x - ($('.rectangle').height()) + 25);

    // $('.touch-controller').offset({top: this.y, left: this.x + ($('.rectangle').width() * 2)});


    // $('.touch-controller').offset({top: this.y - 244, left: this.x -353});
};

/**
 * Update player's position
 */
Player.prototype.update = function() {
    // player.controller();
    // If player wins(reaches the water):
    if (this.y < 0) {
        // Take instances of planted rocks out of allRocksTemp array(out of canvas),
        for (rock of allRocksTemp) {
            if (rock.planted === true) {
                let index = allRocksTemp.indexOf(rock);
                allRocksTemp.splice(index, 1);
            }
        }

        // Set the player on the default position, and set the level up
        this.x = 3 * 101;
        this.y = 574;
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
};

/**
 * Draw the player on the canvas
 */
Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

/**
 * Handle the up, down, left, and right keyboard arrow keys to move players,
 * enter, and spacebar keys
 */
Player.prototype.handleInput = function(pressedKey) {
    switch(pressedKey) {
        case 'up':
            player.y -= 83;
            player.previousY = -83;
            break;
        case 'down':
            player.y += 83;
            player.previousY = 83;
            break;
        case 'left':
            player.x -= 101;
            player.previousX = -101;
            break;
        case 'right':
            player.x += 101;
            player.previousX = 101;
            break;
        case 'enter':
            break;
    }
    // If the player has more than one gem, pressing spacebar plants a rock instance
    if (pressedKey === 'spacebar' && gemPocket > 0) {
        allRocksTemp[gemPocket - 1].plant();
    }
    if (popup.name != 'gameover') {
        $(".popup").css("opacity", 0);
    }
};

/**
 * Generate a gem at a random position and can hide it
 * @class
 */
var Gem = function() {
    const initPosX = [0, 101, 202, 303, 404, 505, 606, 707];
    const initPosY = [62, 145, 229, 312, 395];
    this.x = initPosX[Math.floor(Math.random() * initPosX.length)];
    this.y = initPosY[Math.floor(Math.random() * initPosY.length)];
    this.sprite = 'images/gem-orange.png';
    this.hide = function() {
        gem.x = undefined;
    };
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
    // Display the no. of earned rocks
    $(".num-rock").html(gemPocket);
};

/**
 * Draw the gem on the canvas
 */
Gem.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

/**
 * Generate a rock off the canvas, the default position
 * @class
 */
var Rock = function() {
    this.x = - 101;
    this.y = - 100;
    this.sprite = 'images/rock.png';
    this.detected = 0;
    this.planted = false;
};

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

/**
 * Detect approach of entities, and make them get by it
 */
Rock.prototype.update = function() {
    // Detect collision with enemies, and slide the enemies down
    for (enemy of allEnemies) {
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
 * Draw the rock on the canvas
 */
Rock.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

/**
 * Generate pop-ups
 * @class
 */
var Popup = function() {
    this.name = ''
    this.string = '';
    this.show = function() {
        $(".popup div").css("width", "10em");
        $(".popup div").css("font-size", "1.7em");
        $(".popup div").html(this.string);
        $(".popup").css("opacity", 0.7);
        // After 2.5 sec, pop-ups disappear automatically
        setTimeout(function() {
            $(".popup").css("opacity", 0);
        }, 2500);
    };
    this.show_welcome = function() {
        $(".popup div").css("width", "9em");
        $(".popup div").css("font-size", "1.8em");
        $(".popup div").html(this.string);
        $(".popup").css("opacity", 0.8);
        // Listen to arrow keys or spacebar pressed back up, and the welcome pop-up disappear
        // $(document).keyup(function(e) {
        //     if (e.keyCode == 32 ||
        //         e.keyCode == 37 ||
        //         e.keyCode == 38 ||
        //         e.keyCode == 39 ||
        //         e.keyCode == 40) {
        //         $(".popup").css("opacity", 0);
        //     }
        // });
    };
    this.show_gameover = function() {
        $(".popup div").css("width", "6em");
        $(".popup div").css("font-size", "2.5em");
        $(".popup div").html(this.string);
        $(".popup").css("opacity", 0.8);
        // Listen only to an 'enter' key pressed back up, and the gameover pop-up disappear and game restarts
        $('html').bind('keyup', function(e) {
            if (e.keyCode != 13) {
                e.preventDefault();
                return false;
            } else {
                $(".popup").css("opacity", 0);
                location.reload();
            }
        });

        // $(".rock-button-controller").on("click", function(event) {
        //     player.previousX = 0;
        //     player.previousY = 0;
        //     player.handleInput('spacebar');
        // });
    };

};

// Phrases for instructions, notifications, and gameover popups
Popup.prototype.tip_welcome = function() {
    this.name = 'welcome';
    this.string = 'INSTRUCTIONS: Get some <span class="yellow">GEMS</span>, Block the bugs using <span class="red">SPACEBAR</span>, and Get to the water using <span class="red">ARROW KEYS</span> to win!!';
};

Popup.prototype.tip_more_bug = function() {
    this.name = 'more_bug';
    this.string = 'LOOK OUT! <span class="red">ONE MORE BUG</span> is coming!!';
};

Popup.prototype.tip_faster_speed = function() {
    this.name = 'faster';
    this.string = 'Now, THEY are getting <span class="red">FASTER!!</span>';
};

Popup.prototype.tip_spacebar = function() {
    this.name = 'tip_spacebar';
    this.string = 'Tip : Get <span class="yellow">GEMS</span>, and press <span class="red">SPACEBAR</span> to block the bugs!';
};

Popup.prototype.tip_rocks = function() {
    this.name = 'tip_rocks';
    this.string = 'Tip : <span class="yellow">Rocks</span> can block <span class="red">two bugs!</span>';
};

Popup.prototype.gameover = function() {
    this.name = 'gameover';
    this.string = '<span class="red">- GAMEOVER -</span> \n Press <span class="yellow">ENTER</span> to play again!';
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

    // TODO: create other conditions under which another enemy instance gets generated or gets killed
    // Generate as many enemy instances as preset in this Level object having been leveled up
    this.enemyGenerator = function() {
        while (allEnemies.length < this.numberOfEnemies) {
            const enemy = new Enemy();
            allEnemies.push(enemy);
            console.log('numberOfEnemies: ', this.numberOfEnemies);
            this.display();
        }
    };

    // Generate and push a rock instance into 'allRocksTemp' array
    this.rockGenerator = function() {
        const rock = new Rock();
        allRocksTemp.push(rock);
    };

    // Display data on the panel
    this.display = function() {
        $(".level").html(this.level);
        $(".numBugs").html(this.numberOfEnemies);
        const enemiesSpeeds = [];
        for (enemy of allEnemies) {
            enemiesSpeeds.push(enemy.speed);
        }
        // display the highest speed of the fasted bug generated
        function getMaxSpeed(numArray) {
            return Math.max.apply(null, numArray);
        }
        highestSpeed = getMaxSpeed(enemiesSpeeds);
        $(".highestSpeed").html(highestSpeed);
    };
};

/**
 * If leveled up, add up one level and score,
 * generate a new gem instance and a new enemy or speed,
 * and show pop-ups on each new start
 */
Level.prototype.up = function() {
    this.level++;
    this.score += this.numberOfEnemies * highestSpeed;
    $(".score").html(this.score);
    gem = new Gem();
    if (this.numberOfEnemies < 7) { // only if under 7 enemies, add an enemy
        this.numberOfEnemies++;
    } else { // if over 7 enemies, accelerate enemies's speed
        for (enemy of allEnemies) {
            enemy.acceleration(40);
        }
    }
    // Show a notification pop-up in accordance of level
    switch (true) {
        case this.level % 5 == 0:
            popup.tip_rocks();
            break;
        case this.level % 3 == 0:
            popup.tip_spacebar();
            break;
        case this.level < 7:
            popup.tip_more_bug();
            break;
        default:
            popup.tip_faster_speed();
    }
    popup.show();
};


// var Controller1 = function() {
//     this.x = player.x;
//     this.y = player.y;
//     this.sprite = 'images/controller.png';
//     this.show = function() {
//         $(".touch-controller").css()
//         $(".popup div").css("width", "10em");
// };

// Controller.prototype.update = function() {

// };

// Controller.prototype.render = function() {

// };


// Instantiate objects, and initialize variables
let gemPocket = 0;
let highestSpeed = 0;
const allEnemies = [];
const level = new Level();
level.enemyGenerator();
const allRocksTemp = [];
const player = new Player();
level.display();
const popup = new Popup();
let gem = new Gem();
let rock = new Rock();
popup.tip_welcome();
popup.show_welcome();

// player.controller();
// let controller = new Controller();




// Listen for key presses and send the keys to Player.handleInput() method.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down',
        13: 'enter'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});

document.addEventListener('keydown', function(e) {
    var allowedKeys1 = {
        32: 'spacebar'
    };
    player.previousX = 0;
    player.previousY = 0;
    player.handleInput(allowedKeys1[e.keyCode]);
});

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