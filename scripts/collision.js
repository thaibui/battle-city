function Collision(option) {
	this.mapWidth = option.width;
	this.mapHeight = option.height;
	this.className = option.className;
	this.mapId = option.mapId;
	this.debug = '#debug .collision';
	this.obj = new Array();
	this.map = new Array();
	// use for checking last encounter
	this.lastEncounterX;
	this.lastEncounterY;
	this.safeBorder = 2; // when checking for colision, we add the border to ensure the correctness of the checking
	/**
	 * Init all block in the map
	 */
	this.init = function() {
		// Init the map to zero
		this.map = new Array(this.mapWidth);
		this.map[0] = new Array(this.mapHeight);
		for (i = 0; i < this.mapHeight; i++)
			this.map[0][i] = 0;
		for (i = 1; i < this.mapWidth; i++)
			this.map[i] = this.map[0].slice(0);
			
		// Get all object in the map
		for(i=0;i<this.className.length;i++)
			this.className[i] = '.' + this.className[i];
		this.obj = $(this.className.join(','));
		for (i = 0; i < this.obj.length; i++) {
			obj = $(this.obj[i]);
			// get class of this obj, then get its id
			className = obj.attr('class');
			id = this.getClassId(className);
			// create a barrier for each object
			objTop = obj.position().top;
			objLeft = obj.position().left;
			objWidth = obj.width();
			objHeight = obj.height();
			/**
			 * paint the top and bottom border, but the loop only goes on the
			 * first half of the top border, the second haft and the bottom will
			 * be filled by calculate the symetrical
			 */
			halfWidth = Math.floor(objWidth / 2);
			fullHeight = objTop + objHeight;
			// fill the top and bottom border
			for (j = objLeft, k = 1; k <= halfWidth; k++, j++) {
				sh = j + halfWidth;
				this.map[j][objTop] = id; // the first half of the top border
				this.map[sh][objTop] = id; // the second half of the top border
				this.map[j][fullHeight] = id; // the first half of the bottom border
				this.map[sh][fullHeight] = id; // second half of bottom border
			}

			halfHeight = Math.floor(objHeight / 2);
			fullWidth = objLeft + objWidth;
			// fill the left and right border
			for (j = objTop, k = 1; k <= halfHeight; k++, j++) {
				sh = j + halfHeight;
				this.map[objLeft][j] = id; // first half of left border
				this.map[objLeft][sh] = id; // second half of left border
				this.map[fullWidth][j] = id; // first half of right border
				this.map[fullWidth][sh] = id; // second half of right border
			}
		}
	}

	this.moveLeft = function(objectId, distance) {
		obj = $('#' + objectId);
		objTop = obj.position().top;
		objLeft = obj.position().left;
		objWidth = obj.width();
		objHeight = obj.height();
		
		if(!this.checkRect(objTop-(this.safeBorder/2), 
							objLeft-distance-this.safeBorder, 
							distance+this.safeBorder, 
							objHeight+this.safeBorder)) // distance - 1 to exclude the current line of this obj
			return false;
			
		for (x = objLeft, k = 1; k <= distance; x--, k++) {
			this.map[x][objTop] = 1;
			this.map[x][objTop + objHeight] = 1;
			this.map[x + objWidth][objTop] = 0;
			this.map[x + objWidth][objTop + objHeight] = 0;
		}
		for (y = objTop, k = 1; k <= objHeight; y++, k++) {
			this.map[objLeft][y] = 0;
			this.map[objLeft + objWidth][y] = 0;
			this.map[objLeft - distance][y] = 1;
			this.map[objLeft + objWidth - distance][y] = 1;
		}
		
		return true;
	}
	
	/**
	 * Check value of an rectangle to see if an object already there
	 */
	var i,j,k,l; // temp vars
	this.checkRect = function(top, left, width, height){
		top = (top >= 0) ? top : 0;
		left = (left >= 0) ? left : 0;
		for(i=left,k=1;k<=width;i++,k++)
			for(j=top,l=1;l<=height;j++,l++)
				if(this.map[i][j] != 0){
					this.lastEncounterX = i;
					this.lastEncounterY = j;
					return false;
				}
		return true;
	}
	
	this.moveRight = function(objectId, distance) {
		obj = $('#' + objectId);
		objTop = obj.position().top;
		objLeft = obj.position().left;
		objWidth = obj.width();
		objHeight = obj.height();
		
		if(!this.checkRect(objTop-(this.safeBorder/2), 
							objLeft+objWidth+1, 
							distance+this.safeBorder, 
							objHeight+this.safeBorder)) // distance - 1 to exclude the current line of this obj
			return false;
			
		for (x = objLeft, k = 1; k <= distance; x++, k++) {
			this.map[x][objTop] = 0; // remove old edge
			this.map[x][objTop + objHeight] = 0;
			this.map[x + objWidth][objTop] = 1; // add new edge
			this.map[x + objWidth][objTop + objHeight] = 1;
		}
		for (y = objTop, k = 1; k <= objHeight; y++, k++) {
			this.map[objLeft][y] = 0;
			this.map[objLeft + objWidth][y] = 0;
			this.map[objLeft + distance][y] = 1;
			this.map[objLeft + objWidth + distance][y] = 1;
		}
		
		return true;
	}
	
	this.moveDown = function(objectId, distance) {
		obj = $('#' + objectId);
		objTop = obj.position().top;
		objLeft = obj.position().left;
		objWidth = obj.width();
		objHeight = obj.height();
		
		if(!this.checkRect(objTop+objHeight+1, 
							objLeft-(this.safeBorder/2), 
							objWidth+this.safeBorder, 
							distance+this.safeBorder)) // distance - 1 to exclude the current line of this obj
			return false;
			
		for (x = objLeft, k = 1; k <= objWidth; x++, k++) {
			this.map[x][objTop] = 0; // remove old edge
			this.map[x][objTop + objHeight] = 0;
			this.map[x][objTop + distance] = 1; // add new edge
			this.map[x][objTop + objHeight + distance] = 1;
		}
		for (y = objTop, k = 1; k <= distance; y++, k++) {
			this.map[objLeft][y] = 0;
			this.map[objLeft + objWidth][y] = 0;
			this.map[objLeft][y + objHeight] = 1;
			this.map[objLeft + objWidth][y + objHeight] = 1;
		}
		return true;
	}
	this.moveUp = function(objectId, distance) {
		obj = $('#' + objectId);
		objTop = obj.position().top;
		objLeft = obj.position().left;
		objWidth = obj.width();
		objHeight = obj.height();
		
		if(!this.checkRect(objTop-distance-this.safeBorder, 
							objLeft-(this.safeBorder/2), 
							objWidth+this.safeBorder, 
							distance+this.safeBorder)) // distance - 1 to exclude the current line of this obj
			return false;
			
		for (x = objLeft, k = 1; k <= objWidth; x++, k++) {
			this.map[x][objTop] = 0; // remove old edge
			this.map[x][objTop + objHeight] = 0;
			this.map[x][objTop - distance] = 1; // add new edge
			this.map[x][objTop + objHeight - distance] = 1;
		}
		for (y = objTop, k = 1; k <= distance; y--, k++) {
			this.map[objLeft][y] = 1;
			this.map[objLeft + objWidth][y] = 1;
			this.map[objLeft][y + objHeight] = 0;
			this.map[objLeft + objWidth][y + objHeight] = 0;
		}
		return true;
	}
	
	this.initDebug = function() {
		context = $(this.debug).loadCanvas();
		var img = new Image();
		img.src = 'img/grid16.png';
		img.onload = function(){
			var pattern = context.createPattern(img, 'repeat');
			context.fillStyle = pattern;
			context.fillRect(0,0,areaWidth,areaHeight);
		}
		this.drawDebug();
	}
	
	this.drawDebug = function() {
		context = $(this.debug).loadCanvas();
		context.clearRect(0, 0, this.mapWidth, this.mapHeight);
		
		// create gird pattern for map
		var img = new Image();
		img.src = 'img/grid16.png';
		img.onload = function(){
			var pattern = context.createPattern(img, 'repeat');
			context.fillStyle = pattern;
			context.fillRect(0,0,areaWidth,areaHeight);
		}
		
		// color each object on the map
		for (i = 0; i < this.map.length; i++) {
			for (j = 0; j < this.map[i].length; j++) {
				if (this.map[i][j] > 0) {
					$(this.debug).drawLine({
						strokeStyle : this.getClassColor(this.map[i][j]),
						strokeWidth : 1,
						y1 : j,
						x1 : i,
						y2 : j,
						x2 : i + 1
					});
				}
			}
		}
	}
	
	this.getClassId = function(name){
		switch(name){
			case 'tank': return 1;
			case 'block': return 2;
			default: return 9;
		}
	}
	
	this.getClassColor = function(id){
		switch(id){
			case 1: return '#ff0000';
			case 2: return '#0000ff';
			default: return '#000000';
		}
	}
}