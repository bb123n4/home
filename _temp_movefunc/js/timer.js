var t;
var count =0;

function timedCount()
{
	energy = energy -1;
	if(energy <50)
		day_or_night = 1;
	t = setTimeout(timedCount,500);
}
