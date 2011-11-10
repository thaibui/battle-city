var debug = 1;
var frame = 0;
var player1Name = 'player1';
var player1 = '#player1'; // ID of player1
var player1x = 0;
var player1y = 128;
var tankStop = 1; // stop tank movement
var tankBullet = []; // contains the name of the bullet (html id)
var numBullet = 4;
for(i=0;i<numBullet;i++) tankBullet[i] = 0;
								// frame
var baseUnit = 64; // base unit base on max(width, height) of the tank
var areaWidth = 13*baseUnit;
var areaHeight = 9*baseUnit;
// 16 is equivalent to 60hz monitor refresh rate
var refreshRate = 16; // millisecond (1000/50) * x = 128 / (1000/50)
var bulletRereshRate = 25; // only update the new position of the bullet every x miliseconds		
var tankSpeed = 120; // pixel per second
var tankMoveInterval = (refreshRate * tankSpeed)  / 1000; // pixel, indicating how fast the tank will move
var tankBulletRelativeSpeed = 5; // speed of the bullet proportion to the speed of the tank
var tankBulletMoveInterval = tankMoveInterval * tankBulletRelativeSpeed; // pixel, how fast the bullet will move per
var tankHasMovement = 0; // user move the tank, or the tank will just keep moving forward!
var previousTankDirection = false; // face to the right by default
var intervalDirection = 1; // currentTankDirection need to pixel to be
							// increased
var gridDensity	= 8; 		// need to be a divisor of baseUnit, will decide
							// the number of grid in the map
var nav = {					// use for logic and navigating in the map, also
							// the keyCode for arrow keys, need to be in
							// order of increasing from left,up,right,down.
							// And must increase by 1 unit only
	west: 37,	left:37, 	37: 'left',
	north: 38,	up:38,		38: 'up',
	east: 39,	right:39,	39: 'right',
	south: 40,	down:40,	40: 'down'
};
var moveKey = {shoot: 32}; // keycode for shooting
var currentTankDirection = nav.right; // face to the right by default
var renderList = []; // list of function need to be rendered
var t;
var Collision = new Collision({width: areaWidth, 
							   height:areaHeight,
							   className: ["block", "tank"]});
var Impact = new Impact();
var Block = new Block();
var Position = new Position();
var debugFPS;
	
$(document).ready(function(){
	init();
	Collision.init();
	Position.Init();
	$(document).keydown(function (event){movementHandling(event);});
	$(document).keyup(function (event){movementStoping(event)});
	renderList.push(start);
	renderList.push(bulletHandling);
	t = setInterval(render, refreshRate);
	if(debug){
		debugFPS = $('#debug-fps');
		setInterval(debugFPSFunc, 1000);
	}
});

function debugFPSFunc(){
	debugFPS.html(frame);
	refreshRate = 1000/frame;
	tankMoveInterval = Math.round((refreshRate * tankSpeed)  / 1000); // pixel, indicating how fast the tank will move
	tankBulletMoveInterval = Math.round(tankMoveInterval * tankBulletRelativeSpeed); // pixel, how fast the bullet will move per
	frame = 0;
}

function render(){
	var i,len; // temp vars
	for(i=0,len=renderList.length;i<len;i++){
		renderList[i]();
	}
	frame++;		
}

function init(){
	var p = $(player1);
	p.attr('src', 'img/tank_player-'+nav[currentTankDirection]+'.png');
	p.css('left', player1x + 'px');
	p.css('top', player1y + 'px');
	$('#area').width(areaWidth).height(areaHeight);
}

start = function start(){
	if(!tankStop){
		move();
	}
}

function pause(){
	tankStop = 1;
}

function move(){
	// Init player position
	var pos = Position.Get(player1Name),
		width = pos.width,
		height = pos.height,
		left = pos.left,
		top = pos.top,
		newPos,tempPos;
	// Moving left-right
	if(currentTankDirection == nav.right || currentTankDirection == nav.left){
		newPos =  pos.left + tankMoveInterval * intervalDirection;
		
		currTankMoveInterval = tankMoveInterval; // by default, current move interval = configure interval
		if(newPos + width >= areaWidth){ // if newPos is out of boundary checking, reset the position
			tempPos = areaWidth - 1 - width; // width start from 0, so the last position in the map is not areaWidth but areaWidth - 1
			currTankMoveInterval = tankMoveInterval - (newPos - tempPos);
			newPos = tempPos;
		} else if (newPos < 0) {
			currTankMoveInterval = tankMoveInterval + newPos; // newPos is a negative number
			newPos = 0;
		}
		
		if(newPos != pos.left){
			if(previousTankDirection == nav.up || previousTankDirection == nav.down){
				// direction was changed recently, need to calculate binding
				// to grid
				// before changing to the new position, bind the tank to the
				// grid (restrict to move freely)
				fixTop = movementBindToGrid(pos.top);
				fixTopInterval = pos.top - fixTop;
				if(fixTop < areaHeight - height){
					checkCollision = true;
					if(fixTopInterval > 0) { // going up
						checkCollision = Collision.moveUp(player1Name, fixTopInterval);
					} else {
						if(fixTop + height - fixTopInterval > areaHeight - 1)
							fixTopInterval = areaHeight - 1 - height - fixTop;
						checkCollision = Collision.moveDown(player1Name, Math.abs(fixTopInterval));
					}
					if(checkCollision)
						top = fixTop;
				}
			}
			
			checkCollision = true;	
			// change collision map if the newPos different from current pos
			if(currentTankDirection == nav.right) {
				checkCollision = Collision.moveRight(player1Name, currTankMoveInterval);
			} else {
				checkCollision = Collision.moveLeft(player1Name, currTankMoveInterval);
			}
			if(checkCollision)
				left = newPos;
		}
	} else {		
		// Moving up-down
		newPos = pos.top + tankMoveInterval * intervalDirection;
		
		currTankMoveInterval = tankMoveInterval; // by default, current interval = configure interval
		if(newPos + height >= areaHeight) {
			tempPos = areaHeight - 1 - height; // the last index of the height is not areaHeight, but areaHeight - 1
			currTankMoveInterval = tankMoveInterval - (newPos - tempPos);
			newPos = tempPos;
		} else if (newPos < 0) {
			currTankMoveInterval = tankMoveInterval + newPos; // new pos is a nevative number
			newPos = 0;
		}
			
		// up-down boundary checking
		if(newPos != pos.top){
			if(previousTankDirection == nav.right || previousTankDirection == nav.left){
				// direction was changed recently, need to calculate binding
				// to grid
				fixLeft = movementBindToGrid(pos.left);
				fixLeftInterval = pos.left - fixLeft;
				if(fixLeft < areaWidth - width) {
					checkCollision = true;
					if(fixLeftInterval > 0) { // move left
						checkCollision = Collision.moveLeft(player1Name, fixLeftInterval);
					} else {
						if(fixLeft + width < areaWidth - 1) {
							checkCollision = Collision.moveRight(player1Name, Math.abs(fixLeftInterval));
						}
					}
					if(checkCollision)
						left = fixLeft;
				}
			}
			// changing collision param
			checkCollision = true;
			if(currentTankDirection == nav.down){
				checkCollision = Collision.moveDown(player1Name, currTankMoveInterval);
			} else {
				checkCollision = Collision.moveUp(player1Name, currTankMoveInterval);
			}
			if(checkCollision)
				top = newPos;
		}
	}
	
	Position.Update(player1Name, left, top);
	
	if(debug){
		$('#debug-tank1x').html(left);
		$('#debug-tank1y').html(top);
	}
}

/**
 * Bind the tank to the grid by rounding the x or y (top,left) of the tank with
 * respect to the baseUnit
 * 
 * @param int
 *            newPos is either the x or y, is indicated in movementHandling
 */
function movementBindToGrid(newPos){
	//return newPos;
	unit = baseUnit / gridDensity;
	mod = newPos % unit;
	gridNum = Math.floor(newPos / unit);
	if(mod > (unit / 2)){
		return (gridNum + 1) * unit;
	} else {
		return gridNum * unit;
	}
	
	return newPos;
}

/**
 * Handle moving, stoping of the tank
 * 
 * @param Event
 *            e
 */
function movementHandling(e){
	if(e.keyCode <= nav.down && e.keyCode >= nav.left && e.keyCode != currentTankDirection){ // user change direction
		e.preventDefault();
		tankStop = 0; // signal that tank is moving, so that can keep rendering the tank
		ignore = true; // will ignore the tunrining action of the tank (don't have to change tank image)
		// turn around, 39 -> 37 or 37 -> 39, 38 -> 40 or 40 -> 38
		if(Math.abs(e.keyCode - currentTankDirection) == 2){								
			intervalDirection = (e.keyCode - currentTankDirection) / 2; // change
																		// direction
			// or intervalDirection = 1 - intervalDirection;
			ignore = false;
		}
		
		// turn left & right
		else if(Math.abs(e.keyCode - currentTankDirection) == 1 ||
				Math.abs(e.keyCode - currentTankDirection) == 3) {
			if(e.keyCode <= 38) intervalDirection = -1;
			else intervalDirection = 1;
			ignore = false;
		}
		
		// acknowledge the turn, change image, direction
		if (!ignore) {
			$(player1).attr("src", 'img/tank_player-'+nav[e.keyCode]+'.png'); // change
																				// image
			previousTankDirection = currentTankDirection;
			currentTankDirection = e.keyCode;
		}
	} else if (e.keyCode == currentTankDirection) { // using to start the
													// tank on the same
													// direction
		e.preventDefault();
		tankStop = 0;
	}
	
	// special character
	if(e.keyCode == moveKey.shoot){ // spacebar - shoot!
		e.preventDefault();
		for(i=0;i<tankBullet.length;i++){
			if(tankBullet[i] == 0){
				p = $(player1);				
				parent = p.parent();
				bulletName = 'b_'+player1Name+i;
				parent.append('<img id="'+bulletName+'" class="bullet '+ bulletName + '" src="img/bullet-'+nav[currentTankDirection]+'.png" alt="'+currentTankDirection+'"/>');
				bullet = $('#'+bulletName, parent);
				height = bullet.height();
				width = bullet.width();
				pos = Position.Get(player1Name);
				
				// Calculating initial direction of the buttlet
				if (currentTankDirection == nav.right) {
					topPos = pos.top + baseUnit / 2 - height / 2;
					leftPos = pos.left + baseUnit;
				} else if (currentTankDirection == nav.left) {
					topPos = pos.top + (baseUnit / 2) - (height / 2);
					leftPos = pos.left - width;
				} else if (currentTankDirection == nav.up) {
					topPos = pos.top - height;
					leftPos = pos.left + (baseUnit / 2) - (width / 2);
				} else {
					topPos = pos.top + baseUnit;
					leftPos = pos.left + (baseUnit / 2) - (width / 2);
				}
				bullet.css('cssText', 'position:absolute; top:'+topPos+'px;left:'+leftPos+'px;');
				tankBullet[i] = bulletName;					
				Collision.addObj(bulletName);
				Position.InitObj(bulletName);
				debug_log('SHOOT');
				break;
			}
		}
	}
}

var bulletRateCounter = 0;
bulletHandling = function bulletHandling(){
	if(debug_pause_bullet_motion){
		return;
	}
	// handler for bullet refresh rate
	bulletRateCounter += refreshRate;
	if((bulletRateCounter / bulletRereshRate) >= 1){
		bulletRateCounter = bulletRateCounter % bulletRereshRate;
		movement();
	}
	
	movement = function(){
		for(var i=0, len = tankBullet.length; i<len; i++){
			var bulletId = tankBullet[i];
			if(bulletId != 0){
				pos = Position.Get(bulletId);
				direction = pos.direction;
				width = pos.width;
				height = pos.height;
				switch(parseInt(direction)){
					case nav.left:
						newLeft = pos.left - tankBulletMoveInterval;
						if(newLeft + width >= 0 && // bullet will go through the border until it's completely gone
							Collision.moveLeft(bulletId, tankBulletMoveInterval)){
							Position.Update(bulletId, newLeft, pos.top);
						} else {
							tankBullet[i] = 0;
							bullet = $('#'+bulletId);
							bullet.remove();							
							Impact.right(Collision.impactId);
							Collision.impactId = null;
							Collision.removeObj(bulletId);
							Position.Remove(bulletId);
						}
					break;
					case nav.right:
						newLeft = pos.left + tankBulletMoveInterval;
						if(newLeft <= areaWidth &&
							Collision.moveRight(bulletId, tankBulletMoveInterval)){
							Position.Update(bulletId, newLeft, pos.top);
						} else {
							tankBullet[i] = 0;
							bullet = $('#'+bulletId);
							bullet.remove();
							Impact.left(Collision.impactId);
							Collision.impactId = null;
							Collision.removeObj(bulletId);
							Position.Remove(bulletId);
						}
					break;
					case nav.up:
						newTop = pos.top - tankBulletMoveInterval;
						if(newTop >= 0 &&
							Collision.moveUp(bulletId, tankBulletMoveInterval)){
							Position.Update(bulletId, pos.left, newTop);
						} else {
							tankBullet[i] = 0;
							bullet = $('#'+bulletId);
							bullet.remove();
							Impact.down(Collision.impactId);
							Collision.impactId = null;
							Collision.removeObj(bulletId);
							Position.Remove(bulletId);
						}
					break;
					case nav.down:
						newTop = pos.top + tankBulletMoveInterval;
						if(newTop + height <= areaHeight &&
							Collision.moveDown(bulletId, tankBulletMoveInterval)){
							Position.Update(bulletId, pos.left, newTop);
						} else {
							tankBullet[i] = 0;
							bullet = $('#'+bulletId);
							bullet.remove();
							Impact.top(Collision.impactId);
							Collision.impactId = null;
							Collision.removeObj(bulletId);
							Position.Remove(bulletId);
						}
					break;
				}
			}
		}
	}
}

function movementStoping(e){
	if(e.keyCode <= nav.down && e.keyCode >= nav.left && e.keyCode == currentTankDirection){
		debug_log('STOP');
		pause();
	}		
}
