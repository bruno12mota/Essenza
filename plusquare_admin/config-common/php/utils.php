<?php





/*
 *
 *  Get Social Video URL 
 *
 *  @description: Return the social video url according to the parameters
 *
 */
function plusquare_get_social_video_url($type, $id, $autoplay = "0"){
  if($type == "vimeo"){
    //Vimeo options
    $options = array(
      "title" => get_option("vimeo_title"),
      "byline" => get_option("vimeo_byline"),
      "portrait" => get_option("vimeo_portrait"),
      "color" => get_option("vimeo_color"),
      "autoplay" => $autoplay
    );
    
    $parameters="";
    $count = 0;
    foreach($options as $key => $value){        
      if($value !== FALSE){
        if($count++ != 0)
          $parameters = $parameters."&";

        if($key == "color")
          $value = substr($value, 1);
        $parameters = $parameters.$key."=".$value;
      }
    }
    
    //Make vimeo iframe
    return 'http://player.vimeo.com/video/'.$id.'?'.$parameters;
  }
  
  
  //YOUTUBE
  else if($type == "youtube"){
    //Youtube options
    $options = array(
      "autohide" => get_option("youtube_autohide"),
      "cc_load_policy" => get_option("youtube_cc_load_policy"),
      "color" => get_option("youtube_color"),
      "theme" => get_option("youtube_theme"),
      "controls" => get_option("youtube_controls"),
      "iv_load_policy" => get_option("youtube_iv_load_policy"),
      "modestbranding" => get_option("youtube_modestbranding"),
      "rel" => get_option("youtube_rel"),
      "autoplay" => $autoplay
    );
    
    //Make youtube iframe
    $parameters="";
    foreach($options as $key => $value){
      if($value !== FALSE)
        $parameters = $parameters."&".$key."=".$value;  
    }
    
    return 'http://www.youtube.com/embed/'.$id.'?wmode=transparent'.$parameters;
  }
  
  
  //DAILYMOTION
  else if($type == "dailymotion"){
    //Vimeo options
    $options = array(
      "foreground" => get_option("dailymotion_foreground"),
      "background" => get_option("dailymotion_background"),
      "highlight" => get_option("dailymotion_highlight"),
      "related" => get_option("dailymotion_related"),
      "logo" => get_option("dailymotion_logo"),
      "info" => get_option("dailymotion_info"),
      "autoplay" => $autoplay
    );
    
    //Make vimeo iframe
    $parameters="";
    $count = 0;
    foreach($options as $key => $value){
      if($count++ != 0)
        $parameters = $parameters."&";
        
      if($value !== FALSE)
        $parameters = $parameters.$key."=".$value;
    }
    return 'http://www.dailymotion.com/embed/video/'.$id.'?'.$parameters;
  }
}



/*
 *  Returns true if user's browser is unsupported
*/
function is_unsupported_browser(){
  preg_match('/MSIE (.*?);/', $_SERVER['HTTP_USER_AGENT'], $matches);
  
  if (count($matches)>1){
    //Then we're using IE
    $version = $matches[1];
    if($version<9){
      return true;
    }
  }

  return false;
}




/*
 *  Sanitize Strings
*/
function plusquare_single_quotes_html($str){
  return str_replace("'", "&#39;", $str);
}





/*
 *  Gets the pixel ratio
*/
function plusquare_get_pixel_ratio(){
  if( isset($_COOKIE["pixel_ratio"]) )
    $pixel_ratio = $_COOKIE["pixel_ratio"];
  else
    $pixel_ratio = 2;

  return $pixel_ratio;
}




/*
 * Converts a hex color string to a rgb array
 */
function hex2rgb($hex) {
   $hex = str_replace("#", "", $hex);

   if(strlen($hex) == 3) {
      $r = hexdec(substr($hex,0,1).substr($hex,0,1));
      $g = hexdec(substr($hex,1,1).substr($hex,1,1));
      $b = hexdec(substr($hex,2,1).substr($hex,2,1));
   } else {
      $r = hexdec(substr($hex,0,2));
      $g = hexdec(substr($hex,2,2));
      $b = hexdec(substr($hex,4,2));
   }
   $rgb = array($r, $g, $b);
   //return implode(",", $rgb); // returns the rgb values separated by commas
   return $rgb; // returns an array with the rgb values
}
  



/*
 *	Curl follow function
*/
function curl_exec_follow($ch, &$maxredirect = null) {
  
  // we emulate a browser here since some websites detect
  // us as a bot and don't let us do our job
  $user_agent = "Mozilla/5.0 (Windows; U; Windows NT 5.1; en-US; rv:1.7.5)".
                " Gecko/20041107 Firefox/1.0";
  curl_setopt($ch, CURLOPT_USERAGENT, $user_agent );

  $mr = $maxredirect === null ? 5 : intval($maxredirect);

  if (ini_get('open_basedir') == '' && ini_get('safe_mode') == 'Off') {

    curl_setopt($ch, CURLOPT_FOLLOWLOCATION, $mr > 0);
    curl_setopt($ch, CURLOPT_MAXREDIRS, $mr);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);

  } else {
    
    curl_setopt($ch, CURLOPT_FOLLOWLOCATION, false);

    if ($mr > 0)
    {
      $original_url = curl_getinfo($ch, CURLINFO_EFFECTIVE_URL);
      $newurl = $original_url;
      
      $rch = curl_copy_handle($ch);
      
      curl_setopt($rch, CURLOPT_HEADER, true);
      curl_setopt($rch, CURLOPT_NOBODY, true);
      curl_setopt($rch, CURLOPT_FORBID_REUSE, false);
      do
      {
        curl_setopt($rch, CURLOPT_URL, $newurl);
        $header = curl_exec($rch);
        if (curl_errno($rch)) {
          $code = 0;
        } else {
          $code = curl_getinfo($rch, CURLINFO_HTTP_CODE);
          if ($code == 301 || $code == 302) {
            preg_match('/Location:(.*?)\n/', $header, $matches);
            $newurl = trim(array_pop($matches));
            
            // if no scheme is present then the new url is a
            // relative path and thus needs some extra care
            if(!preg_match("/^https?:/i", $newurl)){
              $newurl = $original_url . $newurl;
            }   
          } else {
            $code = 0;
          }
        }
      } while ($code && --$mr);
      
      curl_close($rch);
      
      if (!$mr)
      {
        if ($maxredirect === null)
        trigger_error('Too many redirects.', E_USER_WARNING);
        else
        $maxredirect = 0;
        
        return false;
      }
      curl_setopt($ch, CURLOPT_URL, $newurl);
    }
  }
  return curl_exec($ch);
}



/*
 *  Curl fetch data function
*/
function curlFetchData($url){
  if(function_exists('curl_init')){
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, $url);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
        curl_setopt($ch, CURLOPT_HEADER, 0);
        curl_setopt ($ch, CURLOPT_SSL_VERIFYHOST, 0);
        curl_setopt ($ch, CURLOPT_SSL_VERIFYPEER, 0); 
        $output = curl_exec($ch);
        echo curl_error($ch);
        curl_close($ch);
        return $output;
    }else{
        return file_get_contents($url);
    }
}