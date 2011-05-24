<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=ISO-8859-1">
<title>Battle City</title>
</head>
<script src="scripts/jquery-1.5.2.min.js"></script>
<script src="scripts/jcanvas.min.js"></script>
<script src="scripts/collision.js"></script>
<script src="scripts/main.js"></script>
<script src="scripts/debug.js"></script>
<style>
	body {
		background-color:black;
	}
	#area {
		background-image:url("img/grid64.png");
		background-color:white;
		border:solid 5px red;
		width:832px;
		height:640px;
		margin:40px auto;
		position:relative;
	}
	#block1 {
		position:absolute;
		top:156px;
		left:384px;
	}
	#player1 {
		position:relative;		
	}
	
	.bullet-h .bullet-v {
		postion:absolute;
	}
</style>
<style>
	#debug {
		padding:5px;
		background-color:red;
		float:left;
		color:white;
		border:1px dashed white;		
	}
	#debug label {
		font-weight:bolder;
	}
	#debug ul {
		padding:0;
		margin:0;
		list-style:none;
	}
	#debug textarea {
		background:#000;
		color:white;
		width:200px;
		height:350px;
	}
	#debug .top-panel {
		position:absolute;
		top:0;
		right:0;
		padding:5px;
		background:red;
		border: 1px dashed white;
		border-top:none;
		color:white;
	}
	#debug .collision {
		position:absolute;
		top:640px;
		left:255px;
		background: yellow;
	}
</style>
<body>
	<div id="debug">
		<div class="top-panel">
			<span>Reset</span><input type="checkbox" id="debug-reset" />
			<span>Pause Bullet Motion</span><input type="checkbox" id="debug-pause-bullet-motion" />
		</div>		
		<ul>
			<li><label>FPS:</label><span id="debug-fps"></span></li>
			<li><label>Tank1-x:</label><span id="debug-tank1x"></span></li>
			<li><label>Tank1-y:</label><span id="debug-tank1y"></span></li>
		</ul>	
		<ul>
			<li>
				<textarea id="debug-log"></textarea>
			</li>
		</ul>
	</div>	
	<div id="area">
		<img src="" id="player1" class="tank" style="width:64px; height:64px;"/>
		<img src="img/brown-clay-64.jpg" id="block1" class="block" style="width:64px; height:64px;"/>
	</div>
</body>
</html>