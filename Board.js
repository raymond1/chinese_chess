function Board(){
    this.context = null;
	this.backgroundImage = null;

    this.draw = drawBoard;
    this.registeredObjects = [];
    this.register = registerBoard;
    this.initialize = initializeBoard;
    this.focusIndex = -1;
    this.focusManager = new FocusManager();
}

function drawBoard(context){
    globalCanvas.width = globalCanvas.width;
	context.drawImage(this.backgroundImage, 0, 0);


    for (var i = 0; i < this.registeredObjects.length; i++){
        this.registeredObjects[i].draw(context);
    }
    
}

function registerBoard(object){
    this.registeredObjects.push(object);
}

function initializeBoard(context, backgroundImage, boardSetupObject){
    this.context = context;
	if (backgroundImage) this.backgroundImage = backgroundImage;
	pieces = boardSetupObject.pieces;
	for (var i = 0; i < pieces.length; i++){
		tempPiece = new Piece(images[pieces[i].name])
		tempPiece.position.x = pieces[i].position.x;
		tempPiece.position.y = pieces[i].position.y;
		if (pieces[i].baseAngle){
			//assume input is in degrees
			tempPiece.baseAngle = pieces[i].baseAngle * (Math.PI/180);
		}
		this.register(tempPiece);
	}
}