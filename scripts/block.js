/**
 * This class is to validate and have necessary handle for blocks
 * For example when it is collided with a bullet we will remove
 * the block if the bullet finally destroy it.
 */
function Block(){
	this.handleBulletCollision = function(obj){
		if(obj.width() == 0 || obj.height() == 0){
			Collision.removeObj(obj.attr('id'));
			obj.remove();
		}
	}
}
