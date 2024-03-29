<?php

function json_decode_has_error(){
   if(function_exists("json_last_error")){
      switch(json_last_error()) {
          case JSON_ERROR_DEPTH:
               return true;
          break;
          case JSON_ERROR_CTRL_CHAR:
               return true;
          break;
          case JSON_ERROR_SYNTAX:
               return true;
          break;
          case JSON_ERROR_NONE:
               return false;
          break;
      }
   }
   else{
      return false;
   }
   

   return true;
}


//Google Fonts
function get_google_fonts_link(){
   global $pq_shortname;
   
   $fontsJsonStr = get_option($pq_shortname."_google_fonts");
   $fontsSetJsonStr = get_option($pq_shortname."_google_fonts_set");

   if($fontsJsonStr === FALSE || $fontsJsonStr == ""){
      return null;
   }
   if($fontsSetJsonStr === FALSE || $fontsSetJsonStr == ""){
      $fontsSetJsonStr = '{"latin":"true","latin-ext":"false","greek-ex":"false","cyrillic":"false","cyrillic-ext":"false","greek":"false","greek-ext":"false"}';
   }
   
   $fontsJson = json_decode($fontsJsonStr);
   if(json_decode_has_error() || $fontsJson == null){
         return null;
   }

   $fontsSetJson = json_decode($fontsSetJsonStr);
   if(json_decode_has_error() || $fontsSetJson == null){
         return null;
   }

    
   $protocol = is_ssl() ? 'https' : 'http';
   
   if( $fontsJsonStr !== FALSE){
      $link = $protocol."://fonts.googleapis.com/css?family=";
   
      $mainCount = 0;
      foreach($fontsJson->items as $item){
         if($mainCount != 0)
            $link = $link."|";
         
         //Font family name
         $fontName = $item->family; 
         $fontName = str_replace("_", "+", $fontName);
         
         $link = $link.$fontName.":";
         
         //Variants
         $count = 0;
         foreach($item->variants as $variant){
            if($count != 0)
               $link = $link.",";
            
            //Add variant
            $link = $link.$variant; 
            
            $count++;
         }
         
         $mainCount++;
      }


      if($fontsSetJson !== FALSE){
         $link .= "&subset=";

         $count = 0;
         foreach($fontsSetJson as $key => $bol){
            if($bol === "true"){
               if($count != 0)
                  $link = $link.",";

               //Add variant
               $link = $link.$key; 

               $count++;
            }
         }
      }
      
      return $link;
   }

   return null;
}



// Returns a Google Font Object
function getGoogleFontObject($font){
   $obj = array();
   
   $parts = explode (":", $font, 2);

   $fontFamily = isset($parts[0]) ? $parts[0] : "Arial";
   $weight = isset($parts[1]) ? $parts[1] : "regular" ;

   $obj["font"] = str_replace("_", " ", $fontFamily);
   
   //weight
   $num = strpos($weight, "italic");
   
   if($num === false){
      if($weight == "regular")
         $obj["weight"] = "400";
      else
         $obj["weight"] = $weight;
      $obj["style"] = "normal";
   }
   else if($num == 0){
      $obj["weight"] = "400";
      $obj["style"] = "italic";
   }
   else{
      $obj["weight"] = substr($weight, 0, $num);
      $obj["style"] = "italic";

      if(WP_DEBUG)console.log("Weight: "+$obj["weight"]);
   }
   
   return $obj;
}



//Returns a Google Font css as String
function getFontCss($font){
   $obj = getGoogleFontObject($font);
   
   return "font-family:".$obj["font"]."; font-weight:".$obj["weight"].";";
}