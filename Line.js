//Assume that the two points are different
function Line(coordinate1, coordinate2){
	this.coordinate1 = coordinate1;
	this.coordinate2 = coordinate2;
	this.slope = slope;
	this.verticalLine = verticalLine;
	this.bottomToTopLine = bottomToTopLine;
	this.topToBottomLine = topToBottomLine;
	this.horizontalLine = horizontalLine;
	this.leftToRightLine = leftToRightLine;
	this.rightToLeftLine = rightToLeftLine;
	this.XFromY = XFromY;
	this.YFromX = YFromX;
	this.getSegment = getSegment;
	this.contains = containsLine;
	this.withinBoundingBox = Line_withinBoundingBox;
}
Line.slope = slope;

function Line_withinBoundingBox(coordinate){
	leftOrdinate = Math.min(this.coordinate1.x, this.coordinate2.x);
	rightOrdinate = Math.max(this.coordinate1.x, this.coordinate2.x);
	topOrdinate = Math.min(this.coordinate1.y, this.coordinate2.y);
	bottomOrdinate = Math.max(this.coordinate1.y, this.coordinate2.y);
	
	if (coordinate.x <= rightOrdinate && coordinate.x >= leftOrdinate && coordinate.y >= bottomOrdinate && coordinate.y <= topOrdinate){
		return true;
	}
	
	return false;
}

function containsLine(coordinate){
	if (this.getSegment(coordinate) == "line" && this.withinBoundingBox(coordinate)){
		return true;
	}
	return false;
}

//A line divides a 2d region into 3 parts:
//1: the points lying on the line itself
//2,3: the the regions on both sides of the line
function getSegment(coordinate){
	if (this.verticalLine()){
		if (coordinate.x == this.coordinate1.x){
			return "line";
		}
		
		if (this.bottomToTopLine()){
			if (coordinate.x > this.coordinate1.x){
				return "right";
			}
			else if (coordinate.x < this.coordinate1.x){
				return "left";
			}
		}
		else if (this.topToBottomLine()){
			if (coordinate.x > this.coordinate1.x){
				return "left";
			}
			else if (coordinate.x < this.coordinate1.x){
				return "right";
			}
		}
	}
	else if (this.horizontalLine()){
		if (coordinate.y == this.coordinate1.y){
			return "line";
		}
		
		if (this.leftToRightLine()){
			if (coordinate.y > this.coordinate1.y){
				return "right";
			}
			else if (coordinate.y < this.coordinate1.y){
				return "left";
			}
		}
		else if (this.rightToLeftLine()){
			if (coordinate.y > this.coordinate1.y){
				return "left";
			}
			else if (coordinate.y < this.coordinate1.y){
				return "right";
			}
		}
	}

	//every other line is not on the axis
	if ((Coordinate.same(coordinate, this.coordinate1))|| Coordinate.same(coordinate, this.coordinate2)){
		return "line";
	}

	if (Line.slope(coordinate, this.coordinate1) == Math.abs(Line.slope(coordinate, this.coordinate2))){
		return "line";
	}

	if (this.bottomToTopLine()){
		if (coordinate.x > this.XFromY(coordinate.y)){
			return "right";
		}
		else if (coordinate.x < this.XFromY(coordinate.y)){
			return "left";
		}
		else if (coordinate.x == this.XFromY(coordinate.y)){
			return "line";
		}
	}
	else if (this.topToBottomLine()){
		if (coordinate.x > this.XFromY(coordinate.y)){
			return "left";
		}
		else if (coordinate.x < this.XFromY(coordinate.y)){
			return "right";
		}
		else if (coordinate.x == this.XFromY(coordinate.y)){
			return "line";
		}
	}
}

function slope(coordinate1, coordinate2){
	return (coordinate2.y - coordinate1.y)/(coordinate2.x - coordinate1.x);
}

function verticalLine(){
	if (this.coordinate1.x == this.coordinate2.x){
		return true;
	}
	else{
		return false;
	}
}


//0,0------10,0
//
//0,10-----10,10
function bottomToTopLine(){
	if (this.coordinate1.y > this.coordinate2.y){
		return true;
	}
	return false;
}

function topToBottomLine(){
	if (this.coordinate1.y < this.coordinate2.y){
		return true;
	}
	return false;
}

function horizontalLine(){
	if (this.coordinate1.y == this.coordinate2.y){
		return true;
	}
	return false;
}

function leftToRightLine(){
	if (this.coordinate1.x < this.coordinate2.x){
		return true;
	}
	return false;
}

function rightToLeftLine(){
	if (this.coordinate1.x > this.coordinate2.x){
		return true;
	}
	return false;
}

function YFromX(x){
	y = this.coordinate1.y + this.slope(this.coordinate1, this.coordinate2) * (x - this.coordinate1.x);
	return y;
}

function XFromY(y){
	x = (y - this.coordinate1.y) / this.slope(this.coordinate1, this.coordinate2) + this.coordinate1.x;
	return x;
}
