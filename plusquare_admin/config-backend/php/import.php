<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" lang="en" xml:lang="en">
	<head> 
     
	</head>
	<body>

<?php
set_time_limit(0);

$url = "http://plusquare.pt/Essenza_images/creative.zip";
$target_file = "media.zip";
$target_path = "../../../../../uploads/";

ob_flush();
flush();

$it = 0;
function progress_import_dummy($download_size, $downloaded, $upload_size, $uploaded = null){
	global $it;
  $it++;
  if($it > 200 || $download_size == $downloaded){
    if($download_size > 0){
      $it = 0;
      $percentage = $downloaded/$download_size * 100;
      echo '<script>window.parent.progressOptions('.$percentage.');</script>';
      
      ob_flush();
      flush();
    }
  }
}


$file = fopen($target_file, 'w');

$ch = curl_init($url);
curl_setopt($ch, CURLOPT_FILE, $file); //auto write to file

curl_setopt($ch, CURLOPT_PROGRESSFUNCTION, 'progress_import_dummy');
curl_setopt($ch, CURLOPT_NOPROGRESS, false); // needed to make progress function work

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

$x = $zip->open($target_file);
if ($x === true) {
  $zip->extractTo($target_path);
  $zip->close();

  $message = "Your .zip file was unpacked.";
}
else { 
  $message = "There was a problem with the unpacking. Please try again.";
}

echo $message;

echo "<script>
    // we're deeper than one down
    window.parent.loadOptions();
</script>";

ob_flush();
flush();

unlink($target_file);

?>
	</body>
</html>