// Enemies our player must avoid
var Enemy = function() {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    const initPosX = -120;
    const initPosY = [62, 145, 229, 312, 395];
    let acceleration = 0;
    this.x = initPosX;
    this.y = initPosY[Math.floor(Math.random() * initPosY.length)];
    this.speed = Math.floor(Math.random() * 400) + 50;
    this.sprite = 'images/enemy-bug.png';
    this.reposition = function() {
        this.x = initPosX;
        this.y = initPosY[Math.floor(Math.random() * initPosY.length)];
    };
    this.acceleration = function(accelerate) {
        acceleration += accelerate;
        this.speed = Math.floor(Math.random() * (400 + acceleration)) + 50;
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

    if (player.x < this.x + 80 &&
       player.x + 70 > this.x &&
       player.y < this.y + 25 &&
       30 + player.y > this.y) {
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
    this.y = 574 // 7 * 82;
    this.boundary = {x: 5, y: 5, width: 50, height: 50}
};

Player.prototype.update = function(dt) {
    if (this.y < 0) { // if wins
        this.x = 3 * 101;
        this.y = 574;
        level.up();
        level.display();
    }
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
            break;
        case 'down':
            player.y += 83;
            break;
        case 'left':
            player.x -= 101;
            break;
        case 'right':
            player.x += 101;
    }
};

var Level = function() {
    this.level = 1;
    this.numberOfEnemies = 2;
    this.enemyGenerator = function() { // generates as many enemies as preset in the Level object
        while (allEnemies.length < this.numberOfEnemies) {
            const enemy = new Enemy();
            allEnemies.push(enemy);
            console.log('numberOfEnemies: ', this.numberOfEnemies);
            this.display();
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
        $(".highestSpeed").html(getMaxSpeed(enemiesSpeeds));
    }
};

Level.prototype.up = function() {
    this.level++;
    if (this.numberOfEnemies < 7) { // if 16 enemies, don't add
        this.numberOfEnemies++;
    } else {
        console.log('so now, level up the speeds!');
        for (enemy of allEnemies) {
            enemy.acceleration(50);
            console.log('see the changed speeds: ', enemy.speed);
        }
    }

    // $(".averageSpeed").html(enemy.speed);

    console.log('level.up called');
}

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player


const allEnemies = [];
const level = new Level();
level.enemyGenerator();

const player = new Player();
level.display();



// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});
