function Game(){
    this.context = null;
	this.backgroundImage = null;

    this.draw = draw;
    this.registeredObjects = [];
    this.register = register;
    this.initialize = initialize;
    this.focusIndex = -1;
    this.focusManager = new FocusManager();
	
	this.setupGame = setupGame;
	this.loadImages = loadImages;
	this.countNumberOfImagesLoaded = countNumberOfImagesLoaded;
	this.imagesLoaded = imagesLoaded;
	this.setupGameContinued = setupGameContinued;
	this.mouseDownHandler = mouseDownHandler;
	this.mouseUpHandler = mouseUpHandler;
	this.mouseMoveHandler = mouseMoveHandler;
	this.calculateRelativeXY = calculateRelativeXY;
	this.keyDownHandler = keyDownHandler;
	
	//this function exists to associate the event handler with the Game object instead of making the event handler a global function
	this.registerHandler = registerHandler;

	function keyDownHandler(event){
		if ('d' == String.fromCharCode(event.keyCode)){		
			if (!debug){//debug was previously false, now being turned on.
				if (window.runned == undefined){
					window.runned = true;
					var debugContainer = document.createElement('div');
					debugContainer.setAttribute('id', 'debugContainer');
					var mouseState = document.createElement('div');
					mouseState.setAttribute('id', 'mouseState');
					var mousePosition = document.createElement('div');
					mousePosition.setAttribute('id', 'mousePosition');
					
					var mouseCount = document.createElement('div');
					mouseCount.setAttribute('id', 'mouseCount');
					
					debugContainer.appendChild(mouseState);
					debugContainer.appendChild(mousePosition);
					debugContainer.appendChild(mouseCount);
					container.appendChild(debugContainer);
				}
				var debugContainer = document.getElementById('debugContainer');
				debugContainer.setAttribute('style', 'position: fixed; top: 0; left: 0; visibility: visible;');
				debug = true;
			}
			else{
				debug = false;
				var debugContainer = document.getElementById('debugContainer');
				debugContainer.setAttribute('style', 'visibility: hidden;');
			}
		}
	}


	
	function mouseMoveHandler(eventInfo){
		previousmouseCoordinate = mouseCoordinate;
		var pageX = eventInfo.pageX;
		var pageY = eventInfo.pageY;
		var clientX = eventInfo.clientX;
		var clientY = eventInfo.clientY;
		var scrollLeft = document.documentElement.scrollLeft;
		var scrollTop = document.documentElement.scrollTop;
		mouseCoordinate = this.calculateRelativeXY(pageX||(eventInfo.clientX - scrollLeft), pageY||(eventInfo.clientY - scrollTop));
		
		if (debug){
			mousePosition = document.getElementById('mousePosition');
			document.getElementById('mousePosition').innerHTML = 'x:' + mouseCoordinate.x + "y:" + mouseCoordinate.y;
		}
		
		window.eventsSwitch = true;
		numberOfListeners = this.registeredObjects.length;
		for(var i = 0; i < numberOfListeners && window.eventsSwitch; i++){
			if (this.registeredObjects[numberOfListeners -1 - i].mouseMoveDetectEnabled){
				this.registeredObjects[numberOfListeners -1 - i].onMouseMove(this.context);
			}
		}
	}	

	function mouseUpHandler(event){
		mouseState = "up";
		if (window.debug){
			document.getElementById('mouseState').innerHTML = 'mouseState:' + mouseState;
			downCount--;
			document.getElementById('mouseCount').innerHTML = "downCount:" + downCount;
		}
		mouseUpCoordinate = new Coordinate(mouseCoordinate.x, mouseCoordinate.y);
		eventsSwitch = true;
		numberOfListeners = this.registeredObjects.length;
		for(var i = 0; i < numberOfListeners && window.eventsSwitch; i++){
			if (this.registeredObjects[numberOfListeners - 1 - i].disabled == false){
				this.registeredObjects[numberOfListeners - 1 - i].onMouseUp(this.context);
			}
		}
	}
	
	
	function mouseDownHandler(event){
		mouseState = "down";
		mouseDownCoordinate = new Coordinate(mouseCoordinate.x, mouseCoordinate.y);
		if (debug){
			document.getElementById('mouseState').innerHTML = 'mouseState:' + mouseState;
			downCount++;
			document.getElementById('mouseCount').innerHTML = "downCount:" + downCount;
		}
		eventsSwitch = true;
		var numberOfListeners = this.registeredObjects.length;
		for(var i = 0; i < numberOfListeners && window.eventsSwitch; i++){
			if (this.registeredObjects[numberOfListeners - 1 - i].contains(mouseCoordinate)){
				this.registeredObjects[numberOfListeners - 1 - i].onMouseDown();
			}
		}
	}

	function registerHandler(functionName, object){
		function innerFunction(e){
			object[functionName](e);
		}
		return innerFunction;
	}



	function calculateRelativeXY(x,y){
		var newX = x - globalCanvas.offsetLeft;
		var newY = y - globalCanvas.offsetTop;
		return new Coordinate(newX,newY);
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
		
		//Add handlers here
		canvas.addEventListener('mousemove', registerHandler('mouseMoveHandler', this), false);
		canvas.addEventListener('mousedown', registerHandler('mouseDownHandler', this), false);
		canvas.addEventListener('mouseup', registerHandler('mouseUpHandler', this), false);
		document.onkeypress = registerHandler('keyDownHandler', this);

		
		globalCanvas = canvas;
		context = canvas.getContext('2d');
		globalContext = context;

		game.initialize(context, images['board'], boardSetupObject);
		game.draw(context);
	}
	
	function imagesLoaded(container, boardSetupObject){
		this.setupGameContinued(container, boardSetupObject);
	}
	
	function draw(context){
		globalCanvas.width = globalCanvas.width;
		context.drawImage(this.backgroundImage, 0, 0);

		for (var i = 0; i < this.registeredObjects.length; i++){
			this.registeredObjects[i].draw(context);
		}
	}
	
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

		window.game = new Game();
		
		//eventsSwitch toggles whether or not events are enabled
		window.eventsSwitch = true;
		window.lastDownClickedObject = null;
		window.images = [];
		
		
		
		var totalNumberOfImages = 0;
		if (boardSetupObject.board) totalNumberOfImages++;
		totalNumberOfImages += boardSetupObject.pieces.length;
		var callback = this.countNumberOfImagesLoaded(totalNumberOfImages,container, boardSetupObject);
		this.loadImages(boardSetupObject, callback);
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
				game.imagesLoaded(container, boardSetupObject);
			}
		}
		return innerFunction;
	}
	
	function register(object){
		this.registeredObjects.push(object);
	}

	function initialize(context, backgroundImage, boardSetupObject){
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

}







