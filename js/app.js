/**
 * @file overview Classic Arcade Game Clone project for Udacity's FEND.
 * @author jaeminche@gmail.com
 */


// TODO:
// - Make it device-responsive, especially with touchable control
// - Add leader board
// - Add pause button


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
    // will detect conditions that generate another enemy instance,
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

/**
 * Update player's position
 */
Player.prototype.update = function() {
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











Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

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

    if (pressedKey === 'spacebar' && gemPocket > 0) {
        console.log('allrockstemp: ', allRocksTemp);
        console.log('allrockstemp.[gempocket -1 ]: ', allRocksTemp[gemPocket - 1]);
        allRocksTemp[gemPocket - 1].plant();
    }
};

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

Gem.prototype.update = function() {
    // Detect a get, hide it, generate a rock object, and display the no. of earned rocks
    if (player.x < this.x + 80 &&
       player.x + 70 > this.x &&
       player.y < this.y + 25 &&
       30 + player.y > this.y) {
        gemPocket++;
        this.hide();
        // console.log("level.rockGenerator(); detected");
        level.rockGenerator();
    }
    $(".num-rock").html(gemPocket);
};

Gem.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

var Rock = function() {
    this.x = - 101;
    this.y = - 100;
    this.sprite = 'images/rock.png';
    this.detected = 0;
    this.planted = false;
};

Rock.prototype.plant = function() {
    this.x = player.x - 101;
    this.y = player.y;
    this.planted = true;
    // if (gemPocket > 0) {
    gemPocket--;
    // }
};

Rock.prototype.update = function() {
    // level.rockGenerator();
    // Detect an encounter, and make entities get by it
    for (enemy of allEnemies) {
        if (enemy.x < this.x + 80 &&
           enemy.x + 70 > this.x &&
           enemy.y < this.y + 25 &&
           30 + enemy.y > this.y) {
            enemy.y = enemy.y + 83;
            this.detected++;
            if (this.detected === 2) {
                this.x = -100;
                // allRocksTemp.splice(this, 1);
            }
        }
    }

    if (player.x < this.x + 80 &&
       player.x + 70 > this.x &&
       player.y < this.y + 25 &&
       30 + player.y > this.y) {
        player.x = player.x - player.previousX;
        player.y = player.y - player.previousY;
    }

};

Rock.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

var Popup = function() {
    this.string = '';
    this.show = function() {
        $(".popup div").css("width", "8em"); // 200
        $(".popup div").css("font-size", "1.5em");  // 25
        $(".popup div").html(this.string);
        $(".popup").css("opacity", 0.7);
        setTimeout(function() {
            $(".popup").css("opacity", 0);
        }, 2500);
    };
    this.show_welcome = function() {
        $(".popup div").css("width", "9em"); // 250
        $(".popup div").css("font-size", "1.8em"); // 30
        $(".popup div").html(this.string);
        $(".popup").css("opacity", 0.8);
        $(document).keyup(function(e) {
            if (e.keyCode == 32 ||
                e.keyCode == 37 ||
                e.keyCode == 38 ||
                e.keyCode == 39 ||
                e.keyCode == 40) {
                $(".popup").css("opacity", 0);
            }
        });
    };
    this.show_gameover = function() {
        $(".popup").css("left", "30vw");
        $(".popup div").css("width", "9em"); // 250
        $(".popup div").css("height", "4em");
        $(".popup div").css("font-size", "4em"); // 45
        $(".popup div").html(this.string);
        $(".popup").css("opacity", 0.8);
        $('html').bind('keyup', function(e) {
            if (e.keyCode == 32 ||
                e.keyCode == 37 ||
                e.keyCode == 38 ||
                e.keyCode == 39 ||
                e.keyCode == 40) {
                e.preventDefault();
                return false;
            } else if (e.keyCode == 13) {
                $(".popup").css("opacity", 0);
                location.reload();
            }
        });
    };

};

Popup.prototype.tip_welcome = function() {
    this.string = 'INSTRUCTIONS: Get some <span class="yellow">GEMS</span>, Block the bugs using <span class="red">SPACEBAR</span>, and Get to the water using <span class="red">ARROW KEYS</span> to win!!';
};

Popup.prototype.tip_more_bug = function() {
    this.string = 'LOOK OUT! <span class="red">ONE MORE BUG</span> is coming!!';
};

Popup.prototype.tip_faster_speed = function() {
    this.string = 'Now, THEY are getting <span class="red">FASTER!!</span>';
};

Popup.prototype.tip_spacebar = function() {
    this.string = 'Tip : Get <span class="yellow">GEMS</span>, and press <span class="red">SPACEBAR</span> to block the bugs!';
};
Popup.prototype.tip_rocks = function() {
    this.string = 'Tip : <span class="yellow">Rocks</span> can block <span class="red">two bugs!</span> Sometimes some can do more!';
};
Popup.prototype.gameover = function() {
    this.string = '<span class="red">- GAMEOVER -</span> \n Press <span class="yellow">ENTER</span> to play again!';
};

var Level = function() {
    this.level = 1;
    this.numberOfEnemies = 2;
    this.score = 0;

    // TODO: create other conditions that will generate another enemy instance or kill one
    this.enemyGenerator = function() { // generates as many enemies as preset in the Level object
        while (allEnemies.length < this.numberOfEnemies) {
            const enemy = new Enemy();
            allEnemies.push(enemy);
            console.log('numberOfEnemies: ', this.numberOfEnemies);
            this.display();
        }
    };

    this.rockGenerator = function() {
        // while (allRocksTemp.length - 1 < gemPocket) {
        const rock = new Rock();
        allRocksTemp.push(rock);
        console.log('level.rockGenerator generated');
        // }
    };

    this.display = function() {
        $(".level").html(this.level);
        $(".numBugs").html(this.numberOfEnemies);

        const enemiesSpeeds = [];
        for (enemy of allEnemies) {
            enemiesSpeeds.push(enemy.speed);
            console.log('enemiesSpeeds: ', enemiesSpeeds);
        }
        function getMaxSpeed(numArray) {
            return Math.max.apply(null, numArray);
        }
        highestSpeed = getMaxSpeed(enemiesSpeeds);
        $(".highestSpeed").html(highestSpeed);
    };
};

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




// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player

let gemPocket = 0;
let highestSpeed = 0;
const allEnemies = [];
const level = new Level();
level.enemyGenerator();
const allRocksTemp = [];
// level.rockGenerator();
const player = new Player();
level.display();
const popup = new Popup();
let gem = new Gem();
let rock = new Rock();
popup.tip_welcome();
popup.show_welcome();




// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
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
