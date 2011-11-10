/**
 * Design to check any collision can happen between 2 objects
 * every movements of object must use the checking function
 * of this class before physically move the object.
 */
function Collision(option) {
	this.mapWidth = option.width;
	this.mapHeight = option.height;
	this.className = option.className;
	this.obj = new Array();
	this.currObjId;		 // current object id that are using to check collision with object on the map
	this.safeBorder = 0; // when checking for colision, we add the border to ensure the correctness of the checking
	this.impactId; 		// id of impact object
	/**
	 * Init all block in the map
	 */
	this.init = function() {
		// Get all object in the map
		for(var i=0;i<this.className.length;i++)
			this.className[i] = '.' + this.className[i];
		var obj = $(this.className.join(','));
		for (i=0;i<obj.length;i++) {
			o = $(obj[i]);
			id = o.attr('id');
			this.obj[id] = i;
			this.obj.push(id);
		}
	}
	
	this.addObj = function(objectId){
		this.obj[objectId] = this.obj.length;
		this.obj.push(objectId);
	}
	
	this.removeObj = function(objectId){
		for(var i=0,len=this.obj.length;i<len;i++){
			if(this.obj[i] == objectId){
				delete this.obj[objectId];
				this.obj.splice(i,1);
				return 1;
			}
		}
	}
	/**
	 * Check value of an rectangle to see if an object already there
	 */
	this.checkRect = function(top, left, width, height){
		// coordinate of main object
		var x1 = left,			y1 = top,				// first corner (top,left)
			x2 = left+width,	y2 = top,				// 2nd corner (top,right)
			x3 = left,		y3 = top+height,   		// bottom,left corner
			x4 = x2,		y4 = y3;				// bottom,right corner
		
		for(i=0,len=this.obj.length;i<len;i++){
			id = this.obj[i];
			if(id != this.currObjId){
				obj = $('#'+id);
				p = obj.position();
				// coordinate of object in the map to check
				X1 = p.left;
				Y1 = p.top;
				X2 = X1 + obj.width();
				Y2 = Y1 + obj.height();
				if(X1 <= x1 && x1 <= X2 &&
				Y1 <= y1 && y1 <= Y2) {// check top,left corner with this object
					this.impactId = id;
					return false;
				} else if
				(X1 <= x2 && x2 <= X2 &&
				Y1 <= y2 && y2 <= Y2) {// check top,right corner with this object
					this.impactId = id;
					return false;
				} else if
				(X1 <= x3 && x3 <= X2 &&
				Y1 <= y3 && y3 <= Y2) {// check bottom,left corner with this object
					this.impactId = id;
					return false;
				} else if
				(X1 <= x4 && x4 <= X2 &&
				Y1 <= y4 && y4 <= Y2) { // check bottom,right corner with this object
					this.impactId = id;
					return false;
				} else if
				(x1 <= X1 && X1 <= x4 &&
				y1 <= Y1 && Y1 <= y4){// check top,left corner with this object
					this.impactId = id;
					return false;
				} else if
				(x1 <= X2 && X2 <= x4 &&
				y1 <= Y1 && Y1 <= y4) {// check top,right corner with this object
					this.impactId = id;
					return false;
				} else if
				(x1 <= X1 && X1 <= x4 &&
				y1 <= Y2 && Y2 <= y4) {// check bottom,left corner with this object
					this.impactId = id;
					return false;
				} else if
				(x1 <= X2 && X2 <= x4 &&
				y1 <= Y2 && Y2 <= y4) { // check bottom,right corner with this object
					this.impactId = id;
					return false;
				}
			}
		}
		return true;
	}
	
	this.moveLeft = function(objectId, distance) {
		var pos = Position.obj[objectId],
			objTop = pos.top,
			objLeft = pos.left,
			objWidth = pos.width,
			objHeight = pos.height;
		
		this.currObjId = objectId;
		if(!this.checkRect(objTop, objLeft-distance, distance,objHeight)) // distance - 1 to exclude the current line of this obj
			return false;
		return true;
	}
	
	this.moveRight = function(objectId, distance) {
		var pos = Position.obj[objectId],
			objTop = pos.top,
			objLeft = pos.left,
			objWidth = pos.width,
			objHeight = pos.height;
		this.currObjId = objectId;
		
		if(!this.checkRect(objTop, objLeft+objWidth+1, distance, objHeight)) // distance - 1 to exclude the current line of this obj
			return false;
		return true;
	}
	
	this.moveDown = function(objectId, distance) {
		var pos = Position.obj[objectId],
			objTop = pos.top,
			objLeft = pos.left,
			objWidth = pos.width,
			objHeight = pos.height;
		
		this.currObjId = objectId;
		
		if(!this.checkRect(objTop+objHeight+1, objLeft, objWidth, distance)) // distance - 1 to exclude the current line of this obj
			return false;
		return true;
	}
	this.moveUp = function(objectId, distance) {
		var pos = Position.obj[objectId],
			objTop = pos.top,
			objLeft = pos.left,
			objWidth = pos.width,
			objHeight = pos.height;
		this.currObjId = objectId;
		if(!this.checkRect(objTop-distance, objLeft, objWidth, distance)) // distance - 1 to exclude the current line of this obj
			return false;
		return true;
	}
}
