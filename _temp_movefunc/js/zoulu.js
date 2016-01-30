// Create the canvas
// Resizes the new window
var canvas = document.createElement("canvas");
var ctx = canvas.getContext("2d");
canvas.style.marginTop= "100px";
canvas.width = 640;
canvas.height = 640;
document.body.appendChild(canvas);

// Background image
var bgReady = false;
var bgImage = new Image();
bgImage.onload = function () {
    bgReady = true;
};
bgImage.src = "images/bigBG.png";

// Background cover for night vision
var bgReady_nite = false;
var bgImage_nite = new Image();
bgImage_nite.onload = function () {
    bgReady_nite = false;
};
bgImage_nite.src = "images/night_cover.png";

//gift image
var gfReady = false;
var gfImage = new Image();
gfImage.onload = function () {
    gfReady = true;
};
gfImage.src = "images/gf.png";

//camera
var camera = {
    x:610,
    y:700
    //offset_X:30,
    //offset_Y:30
};

//------------------------------------------------real thing------------------------------------------

//day_or_night should be a global variable:
//  0-day
//  1-night
var day_or_night=0;
var darken_timer=0;



//score
var score =0;

//Energy

var energy = 300;
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

//the location of people-center, to be updated in the main loop
var realX = 0 ;
var realY = 0;

var player = {};
var metric=6;
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
    if(e.keyCode == 40){
        manDir=1;
		document.getElementById("stepSound").play();
	}
    if(e.keyCode == 38){
		document.getElementById("stepSound").play();
        manDir=0;
	}
    if(e.keyCode == 37){
		document.getElementById("stepSound").play();
        manDir=2;
	}
    if(e.keyCode == 39){
        manDir=3;
		document.getElementById("stepSound").play();
	}
	giftPicked = false;
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
	resetGift();
};

//reset the gift after pickup

function resetGift()
{
	gift_x = Math.pow(-1,Math.round((Math.random()*10%2)))*Math.round((Math.random()*1000%638));
	gift_y = Math.pow(-1,Math.round((Math.random()*10%2)))*Math.round((Math.random()*1000%638));
}

var darken_effect = function(){
    if(darken_timer<5){
        darken_timer++;
    }
    ctx.fillStyle = "rgba(0,0,0,0.2)";
    ctx.fillRect(0,0,640,640);
};

// the image paths to be loaded according to daytime or night
var set_day_night = function () {

    if (day_or_night==0){

        bgReady_nite = false;
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
        bgReady_nite = true;
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
    //if (manDir!=lastDir){
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
    //}
    update(metric);
    //cam_pos();
};
var noObstacle = 37;
var obstacleX = [759,840,1560,1323,597,525,594,675,1473,1233,594,1404,1473,1557,1473,378,450,516,588,1236,378,378,1083,1155,1005,381,381,453,519,591,1005,1005,1005,1485,1554,840,960];
var obstacleY = [366,366,432,432,516,600,600,600,681,681,681,765,765,765,849,1011,1011,1011,1011,1077,1077,1161,1140,1149,1236,1236,1326,1326,1326,1326,1326,1398,1479,1554,1554,1083,960];
var obstacleR=new Array(noObstacle);


for (var i = 0; i < noObstacle -1; i++) {
    obstacleR[i] = 25;
}
obstacleR[36] = 38; // the house

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
/*function draw_obstacles(){
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
}*/

function finish()
{
	//finish image
	var fiImage = new Image();
	fiImage.onload = function () {
		ctx.drawImage(fiImage, 0, 0);
		//document.findElementById("bgm").remove();
	};
	fiImage.src = "images/finish.png";

}

//------------------------------------------------EEEEEEEEEnd: real thing------------------------------------------

// Draw everything
var render = function () {


    if (bgReady) {
        ctx.drawImage(bgImage, -camera.x, -camera.y);
    }

if (playerReady && playerReadyB) {
        ctx.drawImage(playerImageB, player.x, player.y);
        ctx.drawImage(playerImage, player.x, player.y); //doule Buffer
    }

    if (day_or_night==1){
        darken_effect();
    }

    //this is for testing obstacle
    //draw_obstacles();

    //the cover for night vision
    if (bgReady_nite) {
        ctx.drawImage(bgImage_nite, 0, 0);
    }
	
	if(gfReady){
	    if((Math.sqrt((d.x - gift_x)*(d.x - gift_x) + (d.y - gift_y)*(d.y - gift_y) ) > 30))
		ctx.drawImage(gfImage, -d.x+260+gift_x, -d.y+260+gift_y); 
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
		
	if (enReady) 
		
        ctx.drawImage(enImage, 100, 64);
	
    ctx.fillStyle = "rgb(250, 250, 250)";
    ctx.font = "24px Helvetica";
    ctx.textAlign = "left";
    ctx.textBaseline = "top";
    var the_text="step:" + step +" x:"+realX+" y:"+realY+" CamX:"+get_cam().x+" CamY:"+get_cam().y + "score:"+score;
	ctx.fillStyle = "blue";
    ctx.fillText(the_text, 32, 32);
	var the_text="Energy:" + energy;
	ctx.fillStyle = "while";
    ctx.fillText(the_text, 32, 64);
	//canvas_arrow();//draw arrow
	var headlen = 10;   // length of head in pixels
	var fromx = 500;
	var fromy = 500;
	var arrowL= 50;
	var pointX =890+gift_x;
	var pointY =980+gift_y;
		  //pointX = 960;
		  //pointY = 960;
    var angle = Math.atan2(realY-pointY,realX-pointX);
	var tox = fromx - arrowL * Math.cos(angle);
	var toy = fromy - arrowL * Math.sin(angle);
	    ctx.strokeStyle = "red";
		ctx.lineWidth = 3;
		ctx.beginPath();
		ctx.moveTo(fromx, fromy);
		ctx.lineTo(tox, toy);
		ctx.lineTo(tox+headlen*Math.cos(angle-Math.PI/4),toy+headlen*Math.sin(angle-Math.PI/4));
		ctx.moveTo(tox, toy);
		ctx.lineTo(tox+headlen*Math.cos(angle+Math.PI/4),toy+headlen*Math.sin(angle+Math.PI/4));
		ctx.stroke();
};

// The main game loop
var main = function () {
    if(energy == 0)
	{
		finish();
		return;
	}
	set_day_night();
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
