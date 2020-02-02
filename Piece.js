function Piece(image){
	this.baseAngle = 0;
	this.offsetAngle = 0;
	this.displayAngle = 0;
	
	this.rotate = rotate;
	this.state = "neutral";
	this.mouseMoveDetectEnabled = false;
	this.image = image;
	
    this.game = game;
    this.focusManager = this.game.focusManager;
    this.position = new Coordinate(290,140);
    this.radius = 5;
    this.width = image.width;
    this.height = image.height;
	this.pieceCentreOffset = new Coordinate(this.width / 2, this.height / 2);

    this.draw = drawPiece;
    this.contains = containsPiece;
    this.hasFocus = false;
    this.moveTo = pieceMoveTo;
    this.onMouseDown = pieceOnMouseDown;
    this.onMouseUp = pieceOnMouseUp;
    this.onMouseMove = pieceOnMouseMove;
    this.setFocus = pieceSetFocus;
    this.onClick = function (){};
    this.putPieceOnTop = putPieceOnTop;
    this.stopEventBubbling = stopEventBubbling;
    this.disabled = false;
    this.disableAllOtherPieces = disableAllOtherPieces;
    this.enableAllPieces = enableAllPieces;
    this.type = "piece";
	this.withinBoundingBox = withinBoundingBox;
}

function withinBoundingBox(coordinate){
	if (coordinate.x >= this.position.x && coordinate.x <= this.position.x + this.width
		&& coordinate.y >= this.position.y && coordinate.y <= this.position.y + this.width){
		return true;
	}
	return false;
}

function rotate(angle){
	this.offsetAngle = angle;
	this.offSetAngle %= (Math.PI * 2);
}

function disableAllOtherPieces(){
    for (var i = 0; i < this.board.registeredObjects.length; i++){
        if (this.board.registeredObjects[i] != this){
            this.board.registeredObjects[i].disabled = true;
        }
    }
}

function enableAllPieces(){
    for (var i = 0; i < this.board.registeredObjects.length; i++){
        this.board.registeredObjects[i].disabled = false;
    }
}

function putPieceOnTop(){
    var temp = -1;
    for (var i = 0; i < this.game.registeredObjects.length; i++){
        if (this.game.registeredObjects[i] == this){
            temp = i;
        }
    }
    
    this.game.registeredObjects.splice(temp,1);
    this.game.registeredObjects.push(this);
}

function pieceOnMouseDown(){
	var distanceToPieceCentre = Coordinate.distance(mouseCoordinate, new Coordinate(this.pieceCentreOffset.x + this.position.x, this.pieceCentreOffset.y + this.position.y));

	if (distanceToPieceCentre >= 25 && distanceToPieceCentre <= 30){
		this.state = "being rotated";
	}
	else if (distanceToPieceCentre < 25){
		this.state = "being moved";
	}else{
		this.state = "neutral";
	}
	
	lastDownClickedObject = this;
	this.setFocus();
	this.putPieceOnTop();
	this.game.draw(this.game.context);
	if (this.state != "neutral") this.stopEventBubbling();
	this.mouseMoveDetectEnabled = true;
}

function pieceOnMouseUp(context){
    this.hasFocus = false;
    this.game.draw(context);
    if (this === lastDownClickedObject){
      this.onClick();
    }
	this.mouseMoveDetectEnabled = false;
	this.baseAngle = this.baseAngle + this.offsetAngle;
	this.offsetAngle = 0;
}

function pieceOnMouseMove(context){
	if (this.state == "being rotated"){
		var radiusVector = new Vector(new Coordinate(mouseDownCoordinate.x - (this.position.x + this.pieceCentreOffset.x), mouseDownCoordinate.y - (this.position.y + this.pieceCentreOffset.y)));
		//           .   ............
		//        .                      .
		//     .                           .
		//    .                              .
		//  .                                  .
		// .                                    .
		// . \             /                      .
		//  .  \         /                         .
		//   .   \    /                             .
		//    .    _                                .
		//      .                                  .
		//         .                              .
		//            .                         .
		//                .                 .
		//                      .     .
		//
		//
		//
		var radiusLine = new Line(new Coordinate(this.position.x + this.pieceCentreOffset.x, this.position.y + this.pieceCentreOffset.y), mouseDownCoordinate);
		var tangent = radiusVector.leftPerpendicular();
		
		var segment = radiusLine.getSegment(mouseCoordinate);
		var rimToCurrentMousePosition = new Vector(new Coordinate(mouseCoordinate.x - mouseDownCoordinate.x, mouseCoordinate.y - mouseDownCoordinate.y));
		var angleToRotate = Vector.dot(tangent, rimToCurrentMousePosition) / 180;//30 = number of pixels per radian
		this.rotate(angleToRotate);
		this.game.draw(context);
		this.stopEventBubbling();
	}
	else if (this.state == "being moved"){
		if ((this == lastDownClickedObject) && mouseState == "down" && this.hasFocus){
			delta = new Coordinate(mouseCoordinate.x - previousmouseCoordinate.x, mouseCoordinate.y - previousmouseCoordinate.y);
			newCoordinate = new Coordinate(this.position.x + delta.x, this.position.y + delta.y);
			this.moveTo(newCoordinate);
			this.game.draw(context);
			this.stopEventBubbling();
		}
	}
}

function pieceSetFocus(){
    this.focusManager.registerFocus(this);
}

function drawPiece(context){
	context.save();
	context.translate(this.position.x + this.pieceCentreOffset.x, this.position.y + this.pieceCentreOffset.y);
	context.save();
	context.rotate(this.offsetAngle + this.baseAngle);
	context.save();
	context.drawImage(this.image, -this.pieceCentreOffset.x,-this.pieceCentreOffset.y);
	context.restore();
	context.restore();
	context.restore();
}

function containsPiece(coordinates){
	if (coordinates.x >= this.position.x && coordinates.x <= this.position.x + this.width &&
		coordinates.y >= this.position.y && coordinates.y <= this.position.y + this.height){
		return true;
	}
	return false;
}

function pieceMoveTo(coordinates){
	this.position.x = coordinates.x;
	this.position.y = coordinates.y;
}

function stopEventBubbling(){
    eventsSwitch = false;
}