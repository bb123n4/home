var t;
var count =0;
var changedsong=false;
function timedCount()
{

	energy = energy -1;
	if(energy <50){
		day_or_night = 1;
		if(changedsong==false){
			document.getElementById("bgm").src="music/nightmusic.wav";
	        document.getElementById("backtrack").load();
	        changedsong=true;
		}
			
	}
	t = setTimeout(timedCount,500);
}
