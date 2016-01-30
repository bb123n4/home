// Create the canvas
var canvas = document.createElement("canvas");
var ctx = canvas.getContext("2d");
canvas.width = 640;
canvas.height = 640;
document.body.appendChild(canvas);

// Background image
var bgReady = false;
var bgImage = new Image();
bgImage.onload = function () {
    bgReady = true;
};
bgImage.src = "images/background.jpg";

var camera = {
    x:100,
    y:100,
    offset_X:30,
    offset_Y:30
};

// Reset the game when the player catches a monster
var reset = function () {
    player.x = canvas.width / 2;
    player.y = canvas.height / 2;
    
};






//------------------------------------------------real thing------------------------------------------





// Player image
var playerReady = false;
var playerImage = new Image();
playerImage.onload = function () {
    playerReady = true;
};
playerImage.src = "move_Anim/day/down/player_child_down_1.png";
//Player image buffer for reducing flickering
var playerReadyB = false;
var playerImageB = new Image();
playerImageB.onload = function () {
    playerReadyB = true;
};
playerImageB.src = "move_Anim/day/down/player_child_down_1.png";


var player = {};
var metric=3;
//current and last facing directions
var manDir=-1;
var lastDir=-1;
//the status for selecting player image
var step=0;



//up position
var playerPic0=["move_Anim/day/up/player_child_up_1.png","move_Anim/day/up/player_child_up_2.png","move_Anim/day/up/player_child_up_3.png","move_Anim/day/up/player_child_up_4.png"];
//down position
var playerPic1=["move_Anim/day/down/player_child_down_1.png","move_Anim/day/down/player_child_down_2.png","move_Anim/day/down/player_child_down_3.png","move_Anim/day/down/player_child_down_4.png"];
//left position
var playerPic2=["move_Anim/day/left/player_child_left_1.png","move_Anim/day/left/player_child_left_2.png","move_Anim/day/left/player_child_left_3.png","move_Anim/day/left/player_child_left_4.png"];
//right position
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
        switch(manDir){
            case 0: { // Player holding up
                playerImageB.src = playerPic0[0];
                break;
            }
            case 1: { // Player holding down
                playerImageB.src = playerPic1[0];
                break;
            }
            case 2:{ // Player holding left
                playerImageB.src = playerPic2[0];
                break;
            }
            case 3: { // Player holding right
                playerImageB.src = playerPic3[0];
                break;
            }
        }
    }
    update(metric);
    //cam_pos();
};


// Update player object
var update = function (modifier) {
    switch(manDir){

        case 0: { // Player holding up
            //player.y -= modifier;
            camera.y -= modifier;
            lastDir=manDir;
            manDir=-1;
            playerImage.src = playerPic0[step];
            break;
        }
        case 1: { // Player holding down
            //player.y += modifier;
            camera.y+=modifier;
            lastDir=manDir;
            manDir=-1;
            playerImage.src = playerPic1[step];
            break;
            }
        case 2:{ // Player holding left
            //player.x -= modifier;
            camera.x-= modifier;

            lastDir=manDir;
            manDir=-1;
            playerImage.src = playerPic2[step];
            break;
            }
        case 3: { // Player holding right
            //player.x += modifier;
            camera.x+=modifier;
            lastDir=manDir;
            manDir=-1;
            playerImage.src = playerPic3[step];
            break;
            }

    }

};
//return the object camera, camera.x and camera.y are the camera locations
function get_cam(){
    return camera;
}


//------------------------------------------------EEEEEEEEEnd: real thing------------------------------------------


// Draw everything
var render = function () {
    if (bgReady) {
        ctx.drawImage(bgImage, -camera.x, -camera.y);
    }

    if (playerReady) {
        ctx.drawImage(playerImageB, player.x, player.y);
        ctx.drawImage(playerImage, player.x, player.y);
    }


    // Score
    ctx.fillStyle = "rgb(250, 250, 250)";
    ctx.font = "24px Helvetica";
    ctx.textAlign = "left";
    ctx.textBaseline = "top";
    var the_text="step:" + step +" x:"+player.x+" y:"+player.y+" CamX:"+get_cam().x+" CamY:"+get_cam().y;
    ctx.fillText(the_text, 32, 32);

};

// The main game loop
var main = function () {
    //var now = Date.now();
    //var delta = now - then;

    //update(metric);
    move();
    render();

//    then = now;

    // Request to do this again ASAP
    requestAnimationFrame(main);
};

// Cross-browser support for requestAnimationFrame
var w = window;
requestAnimationFrame = w.requestAnimationFrame || w.webkitRequestAnimationFrame || w.msRequestAnimationFrame || w.mozRequestAnimationFrame;

// Let's play this game!
//var then = Date.now();
reset();
main();
