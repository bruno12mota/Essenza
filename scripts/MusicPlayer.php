<?php

function makeMusicPlayer($type, $url, $title, $artist){
	return '
	<div class="music_player" id="'.$id.'" data-type="'.$type.'" data-url="'.$url.'">
		<div class="player">
			<a href="#" class="component tooglePlay left"></a>
			<div class="component right">'.
				(($type == "soundcloud") ? '<a href="'.$url.'" target="_blank" class="soundcloud"></a>':" ").
				
				'<a href="#" class="component toogleMute" onclick="return false;">
					<div class="volume_bar1"></div>
					<div class="volume_bar2"></div>
					<div class="no_volume"></div>
				</a>
				<a href="#" class="volume_bar_holder">
					<div class="active_bar"></div>
				</a>
				
			</div>
			<div class="component fatten">
				<div class="info_wraper">
					<div class="song_artist"><div class="sliding_text">'.$artist.'</div></div>
					<div class="song_title"><div class="sliding_text">'.$title.'</div></div>
				
					<!-- Progress Bar -->
					<div class="progress_holder none">
						<div class="current_position left">00:00</div>
						<div class="duration right">00:00</div>
						<div class="progress_bars">
							<a href="#" class="stream_bar"></a>
							<a href="#" class="active_bar"></a>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>';
}