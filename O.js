function O(focusManager){
    this.focusManager = focusManager;
    this.position = new Coordinate(280,340);
    this.draw = drawO;
    this.width = 80;
    this.height = 80;
    this.lineWidth = 30;
    this.innerRadius = this.width / 2 - this.lineWidth / 2;
	this.outerRadius = this.width / 2;
    this.circleCentre = new Coordinate(this.width/2, this.width/2);
	this.contains = containsO;
}

function drawO(context){
    if (this.hasFocus == true){
        hasFocusForSwitch = 1;
    }
    else{
        hasFocusForSwitch = 0;
    }
    
    switch(hasFocusForSwitch){
        case 0: //doesn't have focus
            context.fillStyle = "rgba(0,255,0,1)";
            context.strokeStyle = "#00ff00";
            break;
        case 1:
            context.fillStyle = "rgba(255,255,0,1)";
            context.strokeStyle = "#ffff00";
            break;
    }
    context.lineWidth = 1;
	
    context.beginPath();
    context.arc(this.position.x + this.circleCentre.x, this.position.y + this.circleCentre.y, this.outerRadius, 0, Math.PI, true);
	context.lineTo(this.position.x + this.outerRadius - this.innerRadius, this.position.y + this.circleCentre.y);
    context.arc(this.position.x + this.circleCentre.x, this.position.y + this.circleCentre.y, this.innerRadius, Math.PI, 2 * Math.PI, false);
	context.closePath();
	context.fill();
    context.stroke();
	
	context.beginPath();
	context.arc(this.position.x + this.circleCentre.x, this.position.y + this.circleCentre.y, this.outerRadius, Math.PI, Math.PI * 2, true);
	context.arc(this.position.x + this.circleCentre.x, this.position.y + this.circleCentre.y, this.innerRadius, Math.PI * 2, Math.PI, false);
	context.fill();
	context.stroke();
}

function containsO(coordinate){
	if (this.withinBoundingBox(coordinate)){
		var distanceToCircleCentre = Math.sqrt(Math.pow(coordinate.x - (this.position.x + this.circleCentre.x), 2) + Math.pow(coordinate.y - (this.position.y + this.circleCentre.y), 2));
		if (distanceToCircleCentre >= this.innerRadius && distanceToCircleCentre <= this.outerRadius){
			return true;
		}
	}
	return false;
}

