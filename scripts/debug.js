function debug_log(string){
	html = $('#debug-log').html();
	$('#debug-log').html(string + "\n" + html);
}
var debug_pause_bullet_motion = false;
$(document).ready(function(){
	$('#debug-pause-bullet-motion').change(function(){
		if($(this).is(':checked')){
			debug_pause_bullet_motion = true;
		} else {
			debug_pause_bullet_motion = false;
		}
	});
});