var debug = 1;
var frame = 0;
var player1Name = 'player1';
var player1 = '#player1'; // ID of player1
var player1x = 300;
var player1y = 150;
var tankStop = 1; // stop tank movement
var tankBullet = []; // 3 bullets
var numBullet = 3;
for(i=0;i<numBullet;i++) tankBullet[i] = 0;
var tankBulletMoveInterval = 9; // pixel, how fast the bullet will move per
								// frame
var baseUnit = 64; // base unit base on max(width, height) of the tank
var areaWidth = 13*baseUnit;
var areaHeight = 9*baseUnit;
var refreshRate = 20; // millisecond
var tankMoveInterval = 3; // pixel, indicating how fast the tank will move
var tankHasMovement = 0; // user move the tank
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
							   className: ["block", "tank"],
							   mapId: "area"});

$(document).ready(function(){
	init();
	Collision.init();
	Collision.initDebug();
	$(document).keydown(function (event){movementHandling(event);});
	$(document).keyup(function (event){movementStoping(event)});
	renderList.push(start);
	renderList.push(bulletHandling);
	t = setInterval(render, refreshRate);
	if(debug){
		dt1 = setInterval(function(){
			$('#debug-fps').html(frame);
			frame = 0
		}, 1000);
	}
});

render = function render(){
	var func;
	for(i=0;i<renderList.length;i++){
		if(renderList[i] instanceof Object){
			func = renderList[i];
		} else {
			func = new Function(renderList[i]);
		}
		func();
	}
	frame++;		
}

function init(){
	$(player1).attr('src', 'img/tank_player-'+nav[currentTankDirection]+'.png');
	$(player1).css('left', player1x + 'px');
	$(player1).css('top', player1y + 'px');
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
	p = $(player1);
	pos = p.position();
				
	// Moving left-right
	if(currentTankDirection == nav.right || currentTankDirection == nav.left){
		newPos =  pos.left + tankMoveInterval * intervalDirection;
		
		currTankMoveInterval = tankMoveInterval; // by default, current move interval = configure interval
		if(newPos + p.width() >= areaWidth){ // if newPos is out of boundary checking, reset the position
			tempPos = areaWidth - 1 - p.width(); // width start from 0, so the last position in the map is not areaWidth but areaWidth - 1
			currTankMoveInterval = tankMoveInterval - (newPos - tempPos);
			newPos = tempPos;
		} else if (newPos < 0) {
			currTankMoveInterval = tankMoveInterval + newPos; // newPos is a nevative number
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
				if(fixTop < areaHeight - p.height()){
					checkCollision = true;
					if(fixTopInterval > 0) { // going up
						checkCollision = Collision.moveUp(player1Name, fixTopInterval);
					} else {
						if(fixTop + p.height() - fixTopInterval > areaHeight - 1)
							fixTopInterval = areaHeight - 1 - p.height() - fixTop;
						checkCollision = Collision.moveDown(player1Name, Math.abs(fixTopInterval));
					}
					if(checkCollision)
						p.css('top', fixTop + 'px');
					else {
						debug_log('encounterd at:'+Collision.lastEncounterX+','+Collision.lastEncounterY);
					}
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
				p.css('left', newPos + 'px');
			else {
				debug_log('encountered at:'+Collision.lastEncounterX+','+Collision.lastEncounterY);
			}
		}
	} else {		
		// Moving up-down
		newPos = pos.top + tankMoveInterval * intervalDirection;
		
		currTankMoveInterval = tankMoveInterval; // by default, current interval = configure interval
		if(newPos + p.height() >= areaHeight) {
			tempPos = areaHeight - 1 - p.height(); // the last index of the height is not areaHeight, but areaHeight - 1
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
				if(fixLeft < areaWidth - p.width()) {
					checkCollision = true;
					if(fixLeftInterval > 0) { // move left
						checkCollision = Collision.moveLeft(player1Name, fixLeftInterval);
					} else {
						if(fixLeft + p.width() < areaWidth - 1) {
							checkCollision = Collision.moveRight(player1Name, Math.abs(fixLeftInterval));
						}
					}
					if(checkCollision)
						p.css('left', fixLeft + 'px');
					else {
						debug_log('encountered at:'+Collision.lastEncounterX+','+Collision.lastEncounterY);
					}
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
				p.css('top', newPos + 'px');
			else {
				debug_log('encountered at:'+Collision.lastEncounterX+','+Collision.lastEncounterY);
			}
		}
	}
	
	if(debug){
		pos = p.position();
		player1x = pos.left;
		player1y = pos.top;
		$('#debug-tank1x').html(pos.left);
		$('#debug-tank1y').html(pos.top);
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
			debug_log('Change Direction (R): '+nav[currentTankDirection]+' -> '+nav[e.keyCode]);
			ignore = false;
		}
		
		// turn left & right
		else if(Math.abs(e.keyCode - currentTankDirection) == 1 ||
				Math.abs(e.keyCode - currentTankDirection) == 3) {
			if(e.keyCode <= 38) intervalDirection = -1;
			else intervalDirection = 1;
			debug_log('Change Direction (T): '+nav[currentTankDirection]+' -> '+nav[e.keyCode]);
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
				parent.append('<img class="bullet bullet' + i + '" src="img/bullet-'+nav[currentTankDirection]+'.png" alt="'+currentTankDirection+'"/>');
				bullet = parent.find('.bullet'+i);
									
				if (currentTankDirection == nav.right) {
					topPos = p.position().top + baseUnit / 2 - bullet.height() / 2;
					leftpos = p.position().left + baseUnit;
				} else if (currentTankDirection == nav.left) {
					topPos = p.position().top + (baseUnit / 2) - (bullet.height() / 2);
					leftpos = p.position().left - bullet.width();
				} else if (currentTankDirection == nav.up) {
					topPos = p.position().top - bullet.height();
					leftpos = p.position().left + (baseUnit / 2) - (bullet.width() / 2);
				} else {
					topPos = p.position().top + baseUnit;
					leftpos = p.position().left + (baseUnit / 2) - (bullet.width() / 2);
				}
				bullet.css('position','absolute');
				bullet.css('top', topPos + 'px');					
				bullet.css('left', leftpos + 'px');
				tankBullet[i] = 'bullet'+i;					
				debug_log('SHOOT');
				break;
			}
		}
	}
}

		
bulletHandling = function bulletHandling(){
	if(debug_pause_bullet_motion){
		return;
	}
	for(i=0; i<tankBullet.length; i++){
		if(tankBullet[i] != 0){
			bullet = $('.'+tankBullet[i]);
			pos = bullet.position();
			direction = bullet.attr('alt');
			switch(parseInt(direction)){
				case nav.left:
					newLeft = pos.left - tankBulletMoveInterval;
					if(newLeft >= 0){
						bullet.css('left', newLeft + 'px');
					} else {
						tankBullet[i] = 0;
						bullet.remove();							
					}
				break;
				case nav.right:
					newLeft = pos.left + tankBulletMoveInterval;
					if(newLeft + bullet.width() <= areaWidth){
						bullet.css('left', newLeft + 'px');
					} else {
						tankBullet[i] = 0;
						bullet.remove();
					}
				break;
				case nav.up:
					newTop = pos.top - tankBulletMoveInterval;
					if(newTop >= 0){
						bullet.css('top',newTop + 'px');
					} else {
						tankBullet[i] = 0;
						bullet.remove();
					}
				break;
				case nav.down:
					newTop = pos.top + tankBulletMoveInterval;
					if(newTop + bullet.height() <= areaHeight){
						bullet.css('top',newTop + 'px');
					} else {
						tankBullet[i] = 0;
						bullet.remove();
					}
				break;
			}
		}
	}
}

function movementStoping(e){
	if(e.keyCode <= nav.down && e.keyCode >= nav.left && e.keyCode == currentTankDirection){
		debug_log('STOP');
		Collision.drawDebug();
		pause();
	}		
}