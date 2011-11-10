/**
 * This class is designed for block in the game.
 * When a bullet hit a block, it will change the background
 * and remove certain pixel on the side to create damaged 
 * effect.
 */
function Impact(){
	var unit = 16; // impact will erase this much of pixel
	this.left = function(id){ // impact on the left side of this object id
		if(!id) return;
		var obj = $('#'+id);
		var left = obj.position().left;
		var width = obj.width();
		if(obj.hasClass('block')){
			obj.css('left', left+unit);
			obj.width(width - unit + 'px');
			Block.handleBulletCollision(obj);
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
		if(!id) return;
		var obj = $('#'+id);
		var width = obj.width();
		if(obj.hasClass('block')){
			obj.width(width - unit + 'px');
			Block.handleBulletCollision(obj);
		}
	}
	
	this.top = function(id){
		if(!id) return;
		var obj = $('#'+id);
		var top = obj.position().top;
		var height = obj.height();
		if(obj.hasClass('block')){
			obj.css('top', top+unit);
			obj.height(height- unit + 'px');
			Block.handleBulletCollision(obj);
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
		if(!id) return;
		var obj = $('#'+id);
		var height = obj.height();
		if(obj.hasClass('block')){
			obj.height(height - unit + 'px');
			Block.handleBulletCollision(obj);
		}
	}
}
