<?php

$optionId = $_GET["id"];
$optionValue = $_GET["value"];

//Load wordpress
define('WP_USE_THEMES', false);
require_once("../../../../../wp-load.php");

echo update_option( $optionId, $optionValue );