<?php


/*
 *	Get resize image from attachment
*/
add_action( 'wp_ajax_nopriv_pq_get_attachment', 'pq_get_attachment_fun' );
add_action( 'wp_ajax_pq_get_attachment', 'pq_get_attachment_fun' );
function pq_get_attachment_fun() {
	// get the submitted parameters
	$attachmentID = $_POST['attachmentID'];	

	$retina = isset($_POST['retina']) ? ($_POST['retina']=="true"?true:false) : true;
	$width = isset($_POST['width']) ? $_POST['width'] : NULL;
	$height = isset($_POST['height']) ? $_POST['height'] : NULL;
	$crop = isset($_POST['crop']) ? ($_POST['crop']=="true"?true:false) : false;
	$snap = isset($_POST['snap']) ? ($_POST['snap']=="true"?true:false) : false;
	$snapValue = isset($_POST['snap_value']) ? intval($_POST['snap_value']) : 100;
	$align = isset($_POST['align']) ? $_POST['align'] : 'c';
	$adjust = isset($_POST['adjust']) ? ($_POST['adjust']=="true"?true:false) : false;

	$image = wp_get_attachment_image_src( $attachmentID, "full" );
	
	$url = $image[0];
	$original_width = intval($image[1]);
	$original_height = intval($image[2]);
	
	$json = pq_calculate_resized_url(array($url, $width, $height, $original_width, $original_height, $crop, $retina, $snap, $snapValue, $align, $adjust));

	// response output
	//if ( ! $attachment = wp_prepare_attachment_for_js( $attachmentID ) )
		//wp_send_json_error();
	$editUrl = get_edit_post_link( $attachmentID , '&');
	$json["editLink"] = $editUrl;

	wp_send_json_success( $json );

	exit;
}



/*
 *	Calculates if image needs to be resized, resizes and returns info
*/
function pq_calculate_resized_url($args){
	list($url, $width, $height, $original_width, $original_height, $crop, $retina, $snap, $snapValue, $align, $adjust) = $args;
	$needsResize = false;

	//Size with retina multiplier
	$width = $width * ($retina ? 2 : 1);
	$height = $height * ($retina ? 2 : 1);

	//get width and height minimum values if no crop
	if(!$crop && $original_width > $width && $original_height > $height){
		if($width == NULL)
			$ratio = $height/$original_height;
		else if($height == NULL)
			$ratio = $width/$original_width;
		else if($adjust)
			$ratio = min($width/$original_width, $height/$original_height);
		else
			$ratio = max($width/$original_width, $height/$original_height);

		$width = ceil($original_width * $ratio);
		$height = ceil($original_height * $ratio);

		$needsResize = true;
	}

	//Snapping images sizes
	if($needsResize && $snap){

		//Snap vars
		$widthSnap = $original_width;
		$heightSnap = $original_height;
		$ratio = $widthSnap / $heightSnap;

		while(true){
			if($ratio >= 1){
				//landscape image
				$tempWidth = $widthSnap-$snapValue;
				$tempHeight = round($tempWidth / $ratio);
			}
			else{
				//portrait image
				$tempHeight = $heightSnap-$snapValue;
				$tempWidth = round($tempHeight * $ratio);
			}

			//Check breaking point
			if($tempWidth < $width || $tempHeight < $height)
				break;

			$widthSnap = $tempWidth;
			$heightSnap = $tempHeight;
		}

		$width = $widthSnap;
		$height = $heightSnap;
	}

	$width = round($width);
	$height = round($height);

	//Resize or crop if needed
	if($needsResize || $crop)
		$url = mr_image_resize($url, $width, $height, $crop, $align, false);
	else{
		$width = $original_width;
		$height = $original_height;
	}

	return array(
		"url"=> $url,
		"width"=> $width,
		"height"=> $height
	);
}


function pq_get_image_resized_fun($url, $width, $height, $crop, $retina, $snap, $snapValue, $align, $adjust){

	// Get the image file path
	$urlinfo = parse_url($url);
	$wp_upload_dir = wp_upload_dir();

	if (preg_match('/\/[0-9]{4}\/[0-9]{2}\/.+$/', $urlinfo['path'], $matches)) {
		$file_path = $wp_upload_dir['basedir'] . $matches[0];
	} else {
		return $url;
	}

	//Get image original size
	$size = @getimagesize($file_path);

	// If no size data obtained, return error or null
	if ($size === FALSE) {
		if(WP_DEBUG)fb::log("Error getting image size: "+$url);
		return array(
			"url"=> $url,
			"width"=> NULL,
			"height"=> NULL
		);
	}

	// Set original width and height
	list($original_width, $original_height, $orig_type) = $size;

	$json = pq_calculate_resized_url(array($url, $width, $height, $original_width, $original_height, $crop, $retina, $snap, $snapValue, $align, $adjust));
}


/*
 *	Get an url image resized
*/
add_action( 'wp_ajax_nopriv_pq_get_resized', 'pq_get_resized_fun' );
add_action( 'wp_ajax_pq_get_resized', 'pq_get_resized_fun' );
function pq_get_resized_fun() {
	$url = $_POST['url'];	
	$retina = isset($_POST['retina']) ? ($_POST['retina']=="true"?true:false) : true;
	$width = isset($_POST['width']) ? $_POST['width'] : NULL;
	$height = isset($_POST['height']) ? $_POST['height'] : NULL;
	$crop = isset($_POST['crop']) ? ($_POST['crop']=="true"?true:false) : false;
	$snap = isset($_POST['snap']) ? ($_POST['snap']=="true"?true:false) : false;
	$snapValue = isset($_POST['snap_value']) ? intval($_POST['snap_value']) : 100;
	$align = isset($_POST['align']) ? $_POST['align'] : 'c';
	$adjust = isset($_POST['adjust']) ? ($_POST['adjust']=="true"?true:false) : false;

	// Get the image file path
	$urlinfo = parse_url($url);
	$wp_upload_dir = wp_upload_dir();

	if (preg_match('/\/[0-9]{4}\/[0-9]{2}\/.+$/', $urlinfo['path'], $matches)) {
		$file_path = $wp_upload_dir['basedir'] . $matches[0];
	} else {
		return $url;
	}

	//Get image original size
	$size = @getimagesize($file_path);

	// If no size data obtained, return error or null
	if (!$size) {
		if(WP_DEBUG)fb::log("Error getting image size: ".$file_path);
		return is_user_logged_in() ? "getimagesize_error_common" : null;
	}

	// Set original width and height
	list($original_width, $original_height, $orig_type) = $size;

	$json = pq_calculate_resized_url(array($url, $width, $height, $original_width, $original_height, $crop, $retina, $snap, $snapValue, $align, $adjust));

	wp_send_json_success( $json );

	exit;
}