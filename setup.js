function setupGame(container, boardSetupObject){
	//globals
	window.debug = false;
	window.downCount = 0;

	window.globalCanvas = null;
	window.mouseState = "up";
	window.mouseCoordinate = new Coordinate(-1,-1);
	window.previousmouseCoordinate = new Coordinate(-1,-1);

	window.mouseUpCoordinate = new Coordinate(-1,-1);
	window.mouseDownCoordinate = new Coordinate(-1,-1);

	window.board = new Board();
	
	//eventsSwitch toggles whether or not events are enabled
	window.eventsSwitch = true;
	window.lastDownClickedObject = null;
	window.images = [];
	
	document.onkeypress = keyDownHandler;
	
	
	var totalNumberOfImages = 0;
	if (boardSetupObject.board) totalNumberOfImages++;
	totalNumberOfImages += boardSetupObject.pieces.length;
	var callback = countNumberOfImagesLoaded(totalNumberOfImages,container, boardSetupObject);
	loadImages(boardSetupObject, callback);
}


function loadImages(boardSetupObject, callback){
	images['board'] = new Image;
	images['board'].src = boardSetupObject.board.filename;
	images['board'].onload = callback;
	for (var i = 0; i < boardSetupObject.pieces.length; i++){
		var pieceName = boardSetupObject.pieces[i].name;
		images[pieceName] = new Image;
		images[pieceName].src = boardSetupObject.pieces[i].filename;
		images[pieceName].onload = callback;
	}
}

function countNumberOfImagesLoaded(totalNumberOfImages, container, boardSetupObject){
	var numberOfImagesLoaded = 0;
	function innerFunction(){
		numberOfImagesLoaded++;
		if (numberOfImagesLoaded == totalNumberOfImages){
			imagesLoaded(container, boardSetupObject);
		}
	}
	return innerFunction;
}


function imagesLoaded(container, boardSetupObject){
	setupGameContinued(container, boardSetupObject);
}


function setupGameContinued(container, boardSetupObject){
	canvas = document.createElement('canvas');
	canvas.setAttribute('id', 'canvas');
	canvas.width = images['board'].width;
	canvas.height = images['board'].height;
		
	container.appendChild(canvas);
	
	
	var boardWidth = images['board'].width;
	var boardHeight = images['board'].height;
	container.setAttribute('style', 'height:' + boardHeight + 'px;' + 'width:' + boardWidth + 'px;');
	window.container = container; //used by the debugger
	
	canvas.addEventListener('mousemove', mouseMoveHandler, false);
	canvas.addEventListener('mousedown', mouseDownHandler, false);
	canvas.addEventListener('mouseup', mouseUpHandler, false);

	globalCanvas = canvas;
	context = canvas.getContext('2d');
	globalContext = context;

	board.initialize(context, images['board'], boardSetupObject);
	board.draw(context);
}