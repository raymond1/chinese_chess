function Coordinate(x,y){
    this.x = x;
    this.y = y;
	Coordinate.same = same;
	Coordinate.distance = distance;
}

function same(coordinate1, coordinate2){
	if (coordinate1.x == coordinate2.x && coordinate1.y == coordinate2.y){
		return true;
	}
	return false;
}

function distance(coordinate1, coordinate2){
	return Math.sqrt(Math.pow((coordinate1.x - coordinate2.x), 2) + Math.pow((coordinate1.y - coordinate2.y),2));
}