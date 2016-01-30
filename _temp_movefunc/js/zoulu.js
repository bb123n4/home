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
bgImage.src = "images/bg.jpg";

// Background image
var bgReady_nite = false;
var bgImage_nite = new Image();
bgImage_nite.onload = function () {
    bgReady_nite = false;
};
bgImage_nite.src = "images/night_cover.png";

var camera = {
    x:640,
    y:640,
    offset_X:30,
    offset_Y:30
};

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

//the location of people-center, to be updated in the main loop
var realX = 0 ;
var realY = 0;

var player = {};
var metric=3;
//current and last facing directions
var manDir=-1;
var lastDir=-1;
//the status for selecting player image
var step=0;
var d = {x:0,y:0};
var upBorder,downBorder,leftBorder,rightBorder;
upBorder = -canvas.height; 
downBorder = canvas.height;
leftBorder = -canvas.width;
rightBorder = canvas.width;  // Border Collision

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
    player.x = canvas.width / 2 - 40;
    player.y = canvas.height / 2 - 40;
    set_day_night();
    playerImage.src = playerPic1[0];
    playerImageB.src = playerImage.src;
};
// the image paths to be loaded according to daytime or night
var set_day_night = function () {

    if (day_or_night==0){

        bgReady_nite = true;
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

        bgReady_nite = false;
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
    realX = player.x + camera.x + 40;
    realY = player.y + camera.y + 40;
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
var noObstacle = 2;
var obstacleX=new Array(noObstacle);
var obstacleY=new Array(noObstacle);
var obstacleR=new Array(noObstacle);
obstacleX[0] = 720;
obstacleY[0] = 720;
obstacleX[1] = 800;
obstacleY[1] = 800;
obstacleR[0] = 30;
obstacleR[1] = 30;

function isInCir(xx,yy,cx,cy,radius) {
	var distance = Math.sqrt((xx-cx)*(xx-cx) + (yy-cy)*(yy-cy));
	if (distance > radius*1.5) return false;
	else return true;
}
var fuck;
// compare with all obstacle
function allObstacle() {
	var closetOb = -1;
	var minD = 20000;
	for (var i = 0; i  < noObstacle; i++) {
		var distance = Math.sqrt((obstacleX[i] - realX)*(obstacleX[i] - realX) + (obstacleY[i]- realY)*(obstacleY[i] - realY));
		if (distance < minD) {
			minD = distance;
			closetOb = i;
		}
	}
	fuck = minD;
	return closetOb;
}

// Update player object
var update = function (modifier) {
	var co = allObstacle(); //closetObstacle
	var cox = obstacleX[co];
	var coy = obstacleY[co];
	var cor = obstacleR[co];
    switch(manDir){
        case 0: { // Player holding up
            //player.y -= modifier;
			 var nextUp = d.y - modifier;
			 var collision = false; 
			 if (co != -1){
				collision = isInCir(realX,realY-modifier,cox,coy,cor);
			 } 
			if ((nextUp> upBorder) && (!collision)) {
            camera.y -= modifier;
			d.y -= modifier;
			}
            lastDir=manDir;
            manDir=-1;
            playerImage.src = playerPic0[step];
            break;
        }
        case 1: { // Player holding down
            //player.y += modifier;
			var nextDown = d.y + modifier;
			var collision = false;
			if (co!= -1){
		     collision = isInCir(realX,realY+modifier,cox,coy,cor);
		   } 
			if ((nextDown < downBorder)&&(!collision)) {
            camera.y +=modifier;
			d.y+=modifier;
			}
            lastDir=manDir;
            manDir=-1;
            playerImage.src = playerPic1[step];
            break;
            }
        case 2:{ // Player holding left
            //player.x -= modifier;
			var nextLeft = d.x - modifier;
			var collision = false;
			if (co!= -1){
				collision = isInCir(realX-modifier,realY,cox,coy,cor);
			} 
			if ((nextLeft> leftBorder) &&(!collision)){
            camera.x-= modifier;
            d.x-=modifier;
			}
            lastDir=manDir;
            manDir=-1;
            playerImage.src = playerPic2[step];
            break;
            }
        case 3: { // Player holding right
            //player.x += modifier;
			var nextRight = d.x + modifier;
			var collision = false;
			if (co!= -1) {	
				collision = isInCir(realX+modifier,realY,cox,coy,cor);
			}
			if ((nextRight < rightBorder) &&(!collision)) {
            camera.x+=modifier;
			d.x+=modifier;
			}
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
function draw_obstacles(){
    for (var i = 0; i< noObstacle; i++) {
        ctx.beginPath();
        ctx.arc(obstacleX[i] - camera.x, obstacleY[i] - camera.y,obstacleR[i] , 0, 2 * Math.PI, false);
        ctx.fillStyle = 'red';
        if (i == 0)
            ctx.fillStyle = 'green';
        ctx.fill();
        ctx.lineWidth = 5;
        ctx.strokeStyle = '#003300';
        ctx.stroke();
    }
}

//------------------------------------------------EEEEEEEEEnd: real thing------------------------------------------

// Draw everything
var render = function () {



    if (bgReady) {
        ctx.drawImage(bgImage, -camera.x, -camera.y);
    }

    if (playerReady && playerReadyB) {
        ctx.drawImage(playerImageB, player.x, player.y);
        ctx.drawImage(playerImage, player.x, player.y); //why 2
    }

    draw_obstacles();

    //the cover for night vision
    if (bgReady_nite) {
        ctx.drawImage(bgImage_nite, 0, 0);
    }

    // Score
    ctx.fillStyle = "rgb(250, 250, 250)";
    ctx.font = "24px Helvetica";
    ctx.textAlign = "left";
    ctx.textBaseline = "top";
    var the_text="cl:" + fuck+" " +allObstacle();
	ctx.fillStyle = "blue";
    ctx.fillText(the_text, 32, 32);
};

// The main game loop
var main = function () {
	move();
    render();
    requestAnimationFrame(main);
};

// Cross-browser support for requestAnimationFrame
var w = window;
requestAnimationFrame = w.requestAnimationFrame || w.webkitRequestAnimationFrame || w.msRequestAnimationFrame || w.mozRequestAnimationFrame;

// Let's play this game!
reset();
main();
