

function Vector(coordinate){
	this.coordinate = coordinate;
	this.leftPerpendicular = leftPerpendicular;
}

Vector.dot = dotProduct;

function test(){
	alert();
}

function dotProduct(vector1, vector2){
	var result = vector1.coordinate.x * vector2.coordinate.x + vector1.coordinate.y * vector2.coordinate.y;
	return result;
}

function leftPerpendicular(){
	var test = new Coordinate(-this.coordinate.y, this.coordinate.x);
	return new Vector(new Coordinate(-this.coordinate.y, this.coordinate.x));
}

function flip(){
	this.coordinate.x = this.coordinate.x * -1;
	this.coordinate.y = this.coordinate.y * -1;
}