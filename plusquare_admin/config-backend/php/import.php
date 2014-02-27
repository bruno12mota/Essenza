<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" lang="en" xml:lang="en">
	<head> 
     
	</head>
	<body>

<?php
set_time_limit(0);

$url = "http://plusquare.pt/Essenza_images/sidebar.zip";

$zip_path = "../wp-content/uploads/media.zip";
$target_path = "../../../../../uploads/";

echo '<div class="ui_progress" style="height:40px; display:block; background-color: #efefef;">';
echo  '<div class="progress" id="load-progress-bar"></div>';
echo '</div>';

ob_flush();
flush();

$it = 0;
function progress_import_dummy($download_size, $downloaded, $upload_size, $uploaded = null){
	global $it;
    if($download_size > 0 && $it++ > 50){
    	$it = 0;
		$percentage = $downloaded/$download_size * 100;
		echo '<script>document.getElementById("load-progress-bar").setAttribute("style", "background-color:#0074A2; height: 40px; width:'.$percentage.'%;");</script>';
    }
         //echo $downloaded / $download_size  * 100;
}

$ch = curl_init();

$file = fopen('item.zip','w');
curl_setopt($ch, CURLOPT_FILE, $file); //auto write to file

curl_setopt($ch, CURLOPT_URL, $url);  
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_PROGRESSFUNCTION, 'progress_import_dummy');
curl_setopt($ch, CURLOPT_NOPROGRESS, false); // needed to make progress function work
curl_setopt($ch, CURLOPT_HEADER, 0);
curl_setopt($ch, CURLOPT_BINARYTRANSFER,true);
curl_setopt($ch, CURLOPT_USERAGENT, $_SERVER['HTTP_USER_AGENT']);
curl_setopt($ch, CURLOPT_TIMEOUT, 400);
 curl_setopt($ch, CURLOPT_FAILONERROR, true);
 curl_setopt ($ch, CURLOPT_SSL_VERIFYHOST, 0);  
 curl_setopt ($ch, CURLOPT_SSL_VERIFYPEER, 0);   

$page = curl_exec($ch);

if (!$page) {  
   echo "<br />cURL error number:" .curl_errno($ch);  
   echo "<br />cURL error:" . curl_error($ch);  
   exit;  
 }  

curl_close($ch);
fclose($file);

echo "UNZIPPING";

$zip = new ZipArchive();
if (! $zip) {  
  echo "<br>Could not make ZipArchive object.";  
  exit;  
}  

$x = $zip->open("$file");
if ($x === true) {
  $zip->extractTo($target_path);
  $zip->close();

  $message = "Your .zip file was unpacked.";
}
else { 
  $message = "There was a problem with the unpacking. Please try again.";
}

echo $message;

?>
	</body>
</html>