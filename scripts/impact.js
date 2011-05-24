/**
 * @author Thai
 */
function Impact(){
	var unit = 16; // impact will erase this much of pixel
	this.left = function(id){ // impact left of this object id
		var obj = $('#'+id);
		var left = obj.position().left;
		var width = obj.width();
		if(obj.hasClass('block')){
			obj.css('left', left+unit);
			obj.width(width - unit + 'px');
			if(obj.hasClass('even')){
				obj.removeClass('even');
				obj.addClass('odd');
			} else if(obj.hasClass('odd')){
				obj.removeClass('odd');
				obj.addClass('even');
			}
		}
	}
	
	this.right = function(id){
		var obj = $('#'+id);
		var width = obj.width();
		if(obj.hasClass('block')){
			obj.width(width - unit + 'px');
		}
	}
	
	this.top = function(id){
		var obj = $('#'+id);
		var top = obj.position().top;
		var height = obj.height();
		if(obj.hasClass('block')){
			obj.css('top', top+unit);
			obj.height(height- unit + 'px');
			if(obj.hasClass('even')){
				obj.removeClass('even');
				obj.addClass('odd');
			} else if(obj.hasClass('odd')){
				obj.removeClass('odd');
				obj.addClass('even');
			}
		}
	}
	
	this.down = function(id){
		var obj = $('#'+id);
		var height = obj.height();
		if(obj.hasClass('block')){
			obj.height(height - unit + 'px');
		}
	}
}
