<?php

//include_once "MusicPlayer.php";
include_once "../../../../wp-config.php";

$type = $_GET["type"];
$url = $_GET["url"];
$title = $_GET["title"];
$artist = $_GET["artist"];

//$rand = rand();
//$id = 'music_player_'.$rand;

echo do_shortcode('[music_player title="'.$title.'" artist="'.$artist.'" type="'.$type.'"]'.$url.'[/music_player]');
//echo makeMusicPlayer($type, $url, $title, $artist);