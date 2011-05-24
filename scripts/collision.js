function CollisionPos(option) {
	this.mapWidth = option.width;
	this.mapHeight = option.height;
	this.className = option.className;
	this.mapId = option.mapId;
	this.debug = '#debug .collision';
	this.obj = new Array();
	this.currObjId;		 // current object id that are using to check collision with object on the map
	this.safeBorder = 0; // when checking for colision, we add the border to ensure the correctness of the checking
	/**
	 * Init all block in the map
	 */
	this.init = function() {
		// Get all object in the map
		for(i=0;i<this.className.length;i++)
			this.className[i] = '.' + this.className[i];
		this.obj = $(this.className.join(','));
		
		for (i = 0; i < this.obj.length; i++) {
			obj = $(this.obj[i]);
			// get class of this obj, then get its id
			className = obj.attr('class');
			id = obj.attr('id');
			this.obj[id] = obj;
			this.obj[i] = id;
		}
	}
	
	this.moveLeft = function(objectId, distance) {
		obj = $('#'+objectId);
		this.currObjId = objectId;
		objTop = obj.position().top;
		objLeft = obj.position().left;
		objWidth = obj.width();
		objHeight = obj.height();
		
		if(!this.checkRect(objTop-(this.safeBorder/2), 
							objLeft-distance-this.safeBorder, 
							distance+this.safeBorder, 
							objHeight+this.safeBorder)) // distance - 1 to exclude the current line of this obj
			return false;
		return true;
	}
	
	/**
	 * Check value of an rectangle to see if an object already there
	 */
	var i,obj,id,p,len,x1,y1,x2,y2,x3,y3,x4,y4,X1,X2,Y1,Y2; // temp vars
	this.checkRect = function(top, left, width, height){
		// coordinate of main object
		x1 = left;			y1 = top;				// first corner (top,left)
		x2 = left+width;	y2 = top;				// 2nd corner (top,right)
		x3 = left;			y3 = top+height;   		// bottom,left corner
		x4 = x2;			y4 = y3;				// bottom,right corner
		
		for(i=0,len=this.obj.length;i<len;i++){
			id = this.obj[i];
			if(id != this.currObjId){
				obj = this.obj[id];
				p = obj.position();
				// coordinate of object in the map to check
				X1 = p.left;
				Y1 = p.top;
				X2 = X1 + obj.width();
				Y2 = Y1 + obj.height();
				if((X1 <= x1 && x1 <= X2 &&
				Y1 <= y1 && y1 <= Y2) ||// check top,left corner with this object

				(X1 <= x2 && x2 <= X2 &&
				Y1 <= y2 && y2 <= Y2) ||// check top,right corner with this object

				(X1 <= x3 && x3 <= X2 &&
				Y1 <= y3 && y3 <= Y2) ||// check bottom,left corner with this object

				(X1 <= x4 && x4 <= X2 &&
				Y1 <= y4 && y4 <= Y2)) { // check bottom,right corner with this object
					return false;
				}
			}
		}
		return true;
	}
	
	this.moveRight = function(objectId, distance) {
		obj = $('#' + objectId);
		this.currObjId = objectId;
		objTop = obj.position().top;
		objLeft = obj.position().left;
		objWidth = obj.width();
		objHeight = obj.height();
		
		if(!this.checkRect(objTop-(this.safeBorder/2), 
							objLeft+objWidth+1, 
							distance+this.safeBorder, 
							objHeight+this.safeBorder)) // distance - 1 to exclude the current line of this obj
			return false;
		return true;
	}
	
	this.moveDown = function(objectId, distance) {
		obj = $('#' + objectId);
		this.currObjId = objectId;
		objTop = obj.position().top;
		objLeft = obj.position().left;
		objWidth = obj.width();
		objHeight = obj.height();
		
		if(!this.checkRect(objTop+objHeight+1, 
							objLeft-(this.safeBorder/2), 
							objWidth+this.safeBorder, 
							distance+this.safeBorder)) // distance - 1 to exclude the current line of this obj
			return false;
		return true;
	}
	this.moveUp = function(objectId, distance) {
		obj = $('#' + objectId);
		this.currObjId = objectId;
		objTop = obj.position().top;
		objLeft = obj.position().left;
		objWidth = obj.width();
		objHeight = obj.height();
		
		if(!this.checkRect(objTop-distance-this.safeBorder, 
							objLeft-(this.safeBorder/2), 
							objWidth+this.safeBorder, 
							distance+this.safeBorder)) // distance - 1 to exclude the current line of this obj
			return false;
		return true;
	}
}