// Create the canvas
var canvas = document.createElement("canvas");
var ctx = canvas.getContext("2d");
canvas.width = 512;
canvas.height = 480;
document.body.appendChild(canvas);

// Background image
var bgReady = false;
var bgImage = new Image();
bgImage.onload = function () {
    bgReady = true;
};
bgImage.src = "images/background.png";

// Hero image
var heroReady = false;
var heroImage = new Image();
heroImage.onload = function () {
    heroReady = true;
};
heroImage.src = "images/hero.png";

// Monster image
var monsterReady = false;
var monsterImage = new Image();
monsterImage.onload = function () {
    monsterReady = true;
};
monsterImage.src = "images/monster.png";

// Game objects

var monster = {};
var monstersCaught = 0;

// Reset the game when the player catches a monster
var reset = function () {
    hero.x = canvas.width / 2;
    hero.y = canvas.height / 2;

    // Throw the monster somewhere on the screen randomly
    monster.x = 32 + (Math.random() * (canvas.width - 64));
    monster.y = 32 + (Math.random() * (canvas.height - 64));
};






//------------------------------------------------real thing------------------------------------------




var hero = {};
var metric=20;
var manDir=-1;
var lastDir=-1;
var step=0;
var playerPic0=["move_Anim/day/up/player_child_up_1.png","move_Anim/day/up/player_child_up_2.png","move_Anim/day/up/player_child_up_3.png","move_Anim/day/up/player_child_up_4.png"];

var playerPic1=["move_Anim/day/down/player_child_down_1.png","move_Anim/day/down/player_child_down_2.png","move_Anim/day/down/player_child_down_3.png","move_Anim/day/down/player_child_down_4.png"];

var playerPic2=["move_Anim/day/left/player_child_left_1.png","move_Anim/day/left/player_child_left_2.png","move_Anim/day/left/player_child_left_3.png","move_Anim/day/left/player_child_left_4.png"];

var playerPic3=["move_Anim/day/right/player_child_right_1.png","move_Anim/day/right/player_child_right_2.png","move_Anim/day/right/player_child_right_3.png","move_Anim/day/right/player_child_right_4.png"];
// Handle keyboard controls
var keysDown = {};

addEventListener("keydown", function (e) {
    keysDown[e.keyCode] = true;
    step=(step+1)%4;
    if(e.keyCode == 40)
        manDir=1;
    if(e.keyCode == 38)
        manDir=0;
    if(e.keyCode == 37)
        manDir=2;
    if(e.keyCode == 39)
        manDir=3;
}, false);

addEventListener("keyup", function (e) {
    delete keysDown[e.keyCode];
}, false);


var move = function(){
    if (manDir!=lastDir){
        //step=0;
    }

    update(metric);
}

// Update game objects
var update = function (modifier) {
    switch(manDir){

        case 0: { // Player holding up
            hero.y -= modifier;
            lastDir=manDir;
            manDir=-1;
            heroImage.src = playerPic0[step];
            break;
        }
        case 1: { // Player holding down
            hero.y += modifier;
            lastDir=manDir;
            manDir=-1;
            heroImage.src = playerPic1[step];
            break;
            }
        case 2:{ // Player holding left
            hero.x -= modifier;
            lastDir=manDir;
            manDir=-1;
            heroImage.src = playerPic2[step];
            break;
            }
        case 3: { // Player holding right
            hero.x += modifier;
            lastDir=manDir;
            manDir=-1;
            heroImage.src = playerPic3[step];
            break;
            }

    }


    // Are they touching?
    if (
        hero.x <= (monster.x + 32)
        && monster.x <= (hero.x + 32)
        && hero.y <= (monster.y + 32)
        && monster.y <= (hero.y + 32)
    ) {
        ++monstersCaught;
        reset();
    }
};

















//------------------------------------------------real thing------------------------------------------



// Draw everything
var render = function () {
    if (bgReady) {
        ctx.drawImage(bgImage, 0, 0);
    }

    if (heroReady) {
        ctx.drawImage(heroImage, hero.x, hero.y);
    }

    if (monsterReady) {
        ctx.drawImage(monsterImage, monster.x, monster.y);
    }

    // Score
    ctx.fillStyle = "rgb(250, 250, 250)";
    ctx.font = "24px Helvetica";
    ctx.textAlign = "left";
    ctx.textBaseline = "top";
    ctx.fillText("Goblins caught: " + step, 32, 32);
};

// The main game loop
var main = function () {
    var now = Date.now();
    var delta = now - then;

    //update(metric);
    move();
    render();

    then = now;

    // Request to do this again ASAP
    requestAnimationFrame(main);
};

// Cross-browser support for requestAnimationFrame
var w = window;
requestAnimationFrame = w.requestAnimationFrame || w.webkitRequestAnimationFrame || w.msRequestAnimationFrame || w.mozRequestAnimationFrame;

// Let's play this game!
var then = Date.now();
reset();
main();
