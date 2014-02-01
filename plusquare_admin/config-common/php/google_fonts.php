<?php

//Google Fonts
function get_google_fonts_link(){
   global $pq_shortname;
   
   $fontsJsonStr = get_option($pq_shortname."_google_fonts");
   
   $fontsJson = json_decode($fontsJsonStr);
    $protocol = is_ssl() ? 'https' : 'http';
   
   if($fontsJsonStr != FALSE){
      $link = "$protocol://fonts.googleapis.com/css?family=";
   
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
      
      return $link;
   }

   return null;
}