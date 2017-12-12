// Enemies our player must avoid
var Enemy = function() {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    const initPosX = -120;
    const initPosY = [62, 145, 229, 312, 395];
    let acceleration = 0;
    this.boundary = {x: 5, y: 5, width: 50, height: 50};
    this.x = initPosX;
    this.y = initPosY[Math.floor(Math.random() * initPosY.length)];
    this.speed = Math.floor(Math.random() * 150) + 50;
    this.sprite = 'images/enemy-bug.png';
    this.reposition = function() {
        this.x = initPosX;
        this.y = initPosY[Math.floor(Math.random() * initPosY.length)];
    };
    this.acceleration = function(accelerate) {
        acceleration += accelerate;
        this.speed = Math.floor(Math.random() * (150 + acceleration)) + 50;
    }
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    this.x += this.speed * dt;

    // Detect enemy out of the canvas, and regenerate it
    if (this.x > 800) {
        this.reposition(0);
    }

    level.enemyGenerator();


    // Detect collision, and set the player at the default position
    if (player.x < this.x + 80 &&
       player.x + 70 > this.x &&
       player.y < this.y + 25 &&
       30 + player.y > this.y) {
        gemPocket--;
        player.x = 3 * 101;
        player.y = 574;
    }
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
var Player = function() {
    this.sprite = 'images/char-boy.png';
    this.x = 3 * 101;
    this.y = 574; // 7 * 82;
    this.previousX = 0;
    this.previousY = 0;
};

Player.prototype.update = function(dt) {
    // if player reaches the water, set her on the default position
    if (this.y < 0) {
        this.x = 3 * 101;
        this.y = 574;
        level.up();
        level.display();
        console.log('allRocks.length: ', allRocks.length);
        console.log('gempocket called: ', gemPocket);
        let numOfRocksToBeDeleted = allRocks.length - 1;
        for (let i = 0; i < numOfRocksToBeDeleted; i ++) {
            allRocks.pop();
        }
    }

    // set the player's move in the boundary of the canvas
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
    }

    if (pressedKey === 'spacebar' && gemPocket > 0) {
        allRocks[gemPocket].plant();
        console.log('gempocket called: ', gemPocket);

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
        console.log('gempocket called: ', gemPocket);
    };
};

Gem.prototype.update = function() {
    // Detect a get, hide the gem, generate rock object, and display the no. of earned rocks
    if (player.x < this.x + 80 &&
       player.x + 70 > this.x &&
       player.y < this.y + 25 &&
       30 + player.y > this.y) {
        gemPocket++;
        this.hide();
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
};

Rock.prototype.plant = function() {
    this.x = player.x - 101;
    this.y = player.y;
    if (gemPocket > 0) {
        gemPocket--;
    }
};

Rock.prototype.update = function() {
    level.rockGenerator();
    // Detect an encounter, and make entities get by it
    for (enemy of allEnemies) {
        if (enemy.x < this.x + 80 &&
           enemy.x + 70 > this.x &&
           enemy.y < this.y + 25 &&
           30 + enemy.y > this.y) {
            enemy.y = enemy.y + 83;
            console.log('detected');
            this.detected++;
            if (this.detected === 2) {
                this.x = -100;
            }
        }
    }

    if (player.x < this.x + 80 &&
       player.x + 70 > this.x &&
       player.y < this.y + 25 &&
       30 + player.y > this.y) {
        player.x = player.x - player.previousX;
        player.y = player.y - player.previousY;
        // if (player.x < this.x + 10) {
        //     console.log('1st detected');
        //     player.x += 101;
        // } else if (player.x + 70 > this.x) {
        //     console.log('2st detected');
        //     player.x -= 101;
        // } else if (player.y < this.y + 25) {
        //     console.log('3st detected');
        //     player.y += 83;
        // } else if (30 + player.y > this.y) {
        //     console.log('4st detected');
        //     player.y -= 83;
        // }
    }

};

Rock.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
}

var Popup = function() {
    this.string = '';
    this.show = function() {
        $(".popup div").css("width", "200px");
        $(".popup div").css("font-size", "25px");
        $(".popup div").html(this.string);
        $(".popup").css("opacity", 0.7);
        setTimeout(function() {
            $(".popup").css("opacity", 0);
        }, 2500);
    };
    this.show_welcome = function() {
    $(".popup div").css("width", "250px");
    $(".popup div").css("font-size", "30px");
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


Popup.prototype.tip_welcome = function() {
    this.string = 'INSTRUCTIONS: Get some <span class="yellow">GEMS</span>, Block the bugs using <span class="red">SPACEBAR</span>, and Get to the water using <span class="red">ARROW KEYS</span> to win!!';
    }
};

Popup.prototype.tip_more_bug = function() {
    this.string = 'LOOK OUT! There comes <span class="yellow">one more bug!</span>';
};

Popup.prototype.tip_faster_speed = function() {
    this.string = 'Now, THEY are getting <span class="red">FASTER!!</span>';
};

Popup.prototype.tip_spacebar = function() {
    this.string = 'Tip : Get <span class="yellow">GEMS</span>, and press <span class="red">SPACEBAR</span> to block the bugs!';
};
Popup.prototype.tip_rocks = function() {
    this.string = 'Tip : Rocks block <span class="red">two bugs</span>! Sometimes some can do more!';
};

var Level = function() {
    this.level = 1;
    this.numberOfEnemies = 2;
    this.score = 0;
    this.enemyGenerator = function() { // generates as many enemies as preset in the Level object
        while (allEnemies.length < this.numberOfEnemies) {
            const enemy = new Enemy();
            allEnemies.push(enemy);
            console.log('numberOfEnemies: ', this.numberOfEnemies);
            this.display();
        }
    };

    this.rockGenerator = function() {
        while (allRocks.length - 1 < gemPocket) {
            const rock = new Rock();
            allRocks.push(rock);
            console.log('level.rockGenerator generated');
        }
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
        // $(".num-rock").html(gemPocket);
    }
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
const allRocks = [];
const allEnemies = [];
const level = new Level();
level.enemyGenerator();
level.rockGenerator();
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
})
