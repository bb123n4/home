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








//------------------------------------------------real thing------------------------------------------

//day_or_night should be a global variable:
//  0-day
//  1-night
var day_or_night=0;

// Player image
var playerReady = false;
var playerImage = new Image();
playerImage.onload = function () {
    playerReady = true;
};
//playerImage.src = "move_Anim/day/down/player_child_down_1.png";
//Player image buffer for reducing flickering
var playerReadyB = false;
var playerImageB = new Image();
playerImageB.onload = function () {
    playerReadyB = true;
};
//playerImageB.src = "move_Anim/day/down/player_child_down_1.png";


var player = {};
var metric=3;
//current and last facing directions
var manDir=-1;
var lastDir=-1;
//the status for selecting player image
var step=0;

var camera = {
    offset_X:30,
    offset_Y:30
};

//up position
var playerPic0_day=["move_Anim/day/up/player_child_up_1.png","move_Anim/day/up/player_child_up_2.png","move_Anim/day/up/player_child_up_3.png","move_Anim/day/up/player_child_up_4.png"];
//down position
var playerPic1_day=["move_Anim/day/down/player_child_down_1.png","move_Anim/day/down/player_child_down_2.png","move_Anim/day/down/player_child_down_3.png","move_Anim/day/down/player_child_down_4.png"];
//left position
var playerPic2_day=["move_Anim/day/left/player_child_left_1.png","move_Anim/day/left/player_child_left_2.png","move_Anim/day/left/player_child_left_3.png","move_Anim/day/left/player_child_left_4.png"];
//right position
var playerPic3_day=["move_Anim/day/right/player_child_right_1.png","move_Anim/day/right/player_child_right_2.png","move_Anim/day/right/player_child_right_3.png","move_Anim/day/right/player_child_right_4.png"];


//up position
var playerPic0_nite=["move_Anim/night/up/player_child_up_1.png","move_Anim/night/up/player_child_up_2.png","move_Anim/night/up/player_child_up_3.png","move_Anim/night/up/player_child_up_4.png"];
//down position
var playerPic1_nite=["move_Anim/night/down/player_child_down_1.png","move_Anim/night/down/player_child_down_2.png","move_Anim/night/down/player_child_down_3.png","move_Anim/night/down/player_child_down_4.png"];
//left position
var playerPic2_nite=["move_Anim/night/left/player_child_left_1.png","move_Anim/night/left/player_child_left_2.png","move_Anim/night/left/player_child_left_3.png","move_Anim/night/left/player_child_left_4.png"];
//right position
var playerPic3_nite=["move_Anim/night/right/player_child_right_1.png","move_Anim/night/right/player_child_right_2.png","move_Anim/night/right/player_child_right_3.png","move_Anim/night/right/player_child_right_4.png"];


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


// init the game: player position, camera position and the image path to be loaded
var reset = function () {
    player.x = canvas.width / 2;
    player.y = canvas.height / 2;
    set_day_night();
    playerImage.src = playerPic1[0];
    playerImageB.src = playerImage.src;
};
// the image paths to be loaded according to daytime or night
var set_day_night = function () {

    if (day_or_night==0){
        //up position
        playerPic0=playerPic0_day;
        //down position
        playerPic1=playerPic1_day;
        //left position
        playerPic2=playerPic2_day;
        //right position
        playerPic3=playerPic3_day;
    }
    else {
        //up position
        playerPic0=playerPic0_nite;
        //down position
        playerPic1=playerPic1_nite;
        //left position
        playerPic2=playerPic2_nite;
        //right position
        playerPic3=playerPic3_nite;
    }

};
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
    cam_pos();
};


var cam_pos = function(){
    camera.x=player.x-camera.offset_X;
    camera.y=player.y-camera.offset_Y;
};
// Update player object
var update = function (modifier) {
    switch(manDir){

        case 0: { // Player holding up
            player.y -= modifier;
            lastDir=manDir;
            manDir=-1;
            playerImage.src = playerPic0[step];
            break;
        }
        case 1: { // Player holding down
            player.y += modifier;
            lastDir=manDir;
            manDir=-1;
            playerImage.src = playerPic1[step];
            break;
            }
        case 2:{ // Player holding left
            player.x -= modifier;
            lastDir=manDir;
            manDir=-1;
            playerImage.src = playerPic2[step];
            break;
            }
        case 3: { // Player holding right
            player.x += modifier;
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
        ctx.drawImage(bgImage, 0, 0);
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

    move();
    render();
    // the main loop: Request to do this again ASAP
    requestAnimationFrame(main);
};

// Cross-browser support for requestAnimationFrame
var w = window;
requestAnimationFrame = w.requestAnimationFrame || w.webkitRequestAnimationFrame || w.msRequestAnimationFrame || w.mozRequestAnimationFrame;

// Let's play this game!
reset();
main();
