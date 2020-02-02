function Triangle(coordinateA, coordinateB, coordinateC){
	this.coordinateA = coordinateA;
	this.coordinateB = coordinateB;
	this.coordinateC = coordinateC;
	this.draw = drawTriangle;
	this.getHandedness = getHandedness;
	this.handedness = undefined;
	this.average = average;
	this.contains = triangleContains;
	this.initialize = initializeTriangle;
	this.lineAB = new Line(this.coordinateA, this.coordinateB);
	this.lineBC = new Line(this.coordinateB, this.coordinateC);
	this.lineCA = new Line(this.coordinateC, this.coordinateA);
}

function triangleContains(coordinate){	
	if (this.lineAB.getSegment(coordinate) == this.handedness
	&& this.lineBC.getSegment(coordinate) == this.handedness
	&& this.lineCA.getSegment(coordinate) == this.handedness){
		return true;
	}
	
	if (this.lineAB.contains(coordinate)||this.lineBC.contains(coordinate)||this.lineCA.contains(coordinate)){
		return true;
	}
	return false;
}

function initializeTriangle(){
	this.handedness = this.getHandedness();
}

function drawTriangle(context){
	context.lineWidth = 1;
	context.fillStyle="#ffffff";
	context.strokeStyle="#ff0000";
	context.beginPath();
	context.moveTo(this.coordinateA.x, this.coordinateA.y);
	context.lineTo(this.coordinateB.x, this.coordinateB.y);
	context.lineTo(this.coordinateC.x, this.coordinateC.y);
	context.lineTo(this.coordinateA.x, this.coordinateA.y);
	context.stroke();
}

function getHandedness(){
	averagePoint = new Coordinate(-1, -1);
	averagePoint.x = this.average([this.coordinateA.x, this.coordinateB.x, this.coordinateC.x]);
	averagePoint.y = this.average([this.coordinateA.y, this.coordinateB.y, this.coordinateC.y]);
	
	handedness = this.lineAB.getSegment(averagePoint);
	return handedness;
}

function average(array1){
	averageToBeReturned = 0;
	total = 0;
	for (i = 0; i < array1.length; i++){
		total = total + array1[i];
	}
	averageToBeReturned = total/array1.length;
	return averageToBeReturned;
}
