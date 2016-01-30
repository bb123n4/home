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

//gift image
var gfReady = false;
var gfImage = new Image();
gfImage.onload = function () {
    gfReady = true;
};
gfImage.src = "images/gf.png";

//camera
var camera = {
    x:640,
    y:640
    //offset_X:30,
    //offset_Y:30
};

//------------------------------------------------real thing------------------------------------------

//day_or_night should be a global variable:
//  0-day
//  1-night
var day_or_night=0;



//score
var score =0;

//Energy

var energy = 100;
var enReady = false;
var enImage = new Image();
enImage.onload = function () {
    enReady = true;
};
var energyImg = ["move_Anim/Energy/timeBar_06.png","move_Anim/Energy/timeBar_05.png",
					"move_Anim/Energy/timeBar_04.png","move_Anim/Energy/timeBar_03.png","move_Anim/Energy/timeBar_02.png","move_Anim/Energy/timeBar_01.png"];



//gift Math.Radom offset
var gift_x =0;
var gift_y =0;
var giftPicked = true;

// Player image
var playerReady = false;
var playerImage = new Image();
playerImage.onload = function () {
    playerReady = true;
};
//Player image buffer for reducing flickering
var playerReadyB = false;
var playerImageB = new Image();
playerImageB.onload = function () {
    playerReadyB = true;
};


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
	
	giftPicked = false;
	
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
	resetGift();
};

//reset the gift after pickup

function resetGift()
{
	gift_x = Math.pow(-1,Math.round((Math.random()*10%2)))*Math.round((Math.random()*1000%638));
	gift_y = Math.pow(-1,Math.round((Math.random()*10%2)))*Math.round((Math.random()*1000%638));
}

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
    //cam_pos();
};


// Update player object
var update = function (modifier) {
    switch(manDir){
        case 0: { // Player holding up
            //player.y -= modifier;
			 var nextUp = d.y - modifier;
			if (nextUp> upBorder) {
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
			if(nextDown < downBorder) {
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
			if (nextLeft> leftBorder) {
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
			if (nextRight < rightBorder) {
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


//------------------------------------------------EEEEEEEEEnd: real thing------------------------------------------


// Draw everything
var render = function () {
    if (bgReady) {
        ctx.drawImage(bgImage, -camera.x, -camera.y);
    }

    if (playerReady) {
        ctx.drawImage(playerImageB, player.x- 40, player.y- 40);
        ctx.drawImage(playerImage, player.x-40, player.y- 40); //double buffer
    }
	
	if(gfReady){
	    if((Math.sqrt((d.x - gift_x)*(d.x - gift_x) + (d.y - gift_y)*(d.y - gift_y) ) > 30))
		ctx.drawImage(gfImage, -d.x+240+gift_x, -d.y+240+gift_y); 
		else
		{
			if(giftPicked == false)
			{
				resetGift();
				score ++
			}
			giftPicked == true;
		}
	}
	
	if(energy == 0)
			enImage.src = energyImg[0];
	else{
			enImage.src = energyImg[Math.floor(energy/20)+1];
	}
		
	if (enReady) {
		
        ctx.drawImage(enImage, 80, 64);
    }

    // Score
    ctx.fillStyle = "rgb(250, 250, 250)";
    ctx.font = "24px Helvetica";
    ctx.textAlign = "left";
    ctx.textBaseline = "top";
    var the_text="step:" + step +" x:"+d.x+" y:"+d.y+" CamX:"+get_cam().x+" CamY:"+get_cam().y + "score:"+score;
	ctx.fillStyle = "blue";
    ctx.fillText(the_text, 32, 32);
	var the_text="Energy:" + energy;
	ctx.fillStyle = "black";
    ctx.fillText(the_text, 32, 64);
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
