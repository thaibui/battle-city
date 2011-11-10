/**
 * This class is designed to store and to track possition of
 * all objects in the games, every movement will change the
 * according attribute of this object.
 */
function Position() {
	this.obj = []; // array to hold all object position data

	this.Remove = function(id) { // remove object id from position collection
		delete this.obj[id];
	}

	this.Init = function() {
		objects = $('.tank');
		for(var i=0,len = objects.length;i<len;i++){
			this.InitObj($(objects[i]).attr('id'));
		}
	}

	this.InitObj = function(id) {
		var p = $('#'+id), pos = p.position();
		obj = new PositionObj();
		obj.left = pos.left;
		obj.top = pos.top;
		obj.width = p.width();
		obj.height = p.height();
		obj.direction = p.attr('alt'); // for bullet
		this.obj[id] = obj;
	}
	
	this.Get = function(id){
		return this.obj[id];
	}

	this.Update = function(id, left, top) {
		this.obj[id].left = left;
		this.obj[id].top = top;
		css = 	'top: '+top+
		'px;left: '+left+
		'px;width: '+this.obj[id].width+
		'px;height: '+this.obj[id].height+
		'px;position:absolute;';
		p = $('#' + id);
		p.css('cssText', css);
	}
}

function PositionObj () {  // object to store object information
	var left,top,width,height,direction;
}