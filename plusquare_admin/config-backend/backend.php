<?php

//Metabox
include_once('php/pq_meta_box.php');

//Ajax functions
include_once('php/ajax.php');

//Ajax functions
include_once('config-templatecustomizer/template_customizer.php');




//Prevent user from rich editing
add_filter ( 'user_can_richedit' , create_function ( '$a' , 'return false;' ) , 50 );



/*
 *
 *  Google fonts helping functions
 *
 *  @description: Functions to handle google fonts related operations
 *
 */

// Returns a List of Google Fonts Choosen by the User
function get_google_fonts_list(){
    global $pq_shortname;
   
    $fontsJsonStr = get_option($pq_shortname."_google_fonts");
    $fontsJson = json_decode($fontsJsonStr);

    if($fontsJsonStr != FALSE){
        $mainCount = 0;
        $list = "[";
        foreach($fontsJson->items as $item){
            fb::log($item);

            $fontName = $item->family; 
            $fontName = str_replace("_", " ", $fontName);

            if($mainCount != 0)
               $list .= ",";

            $count = 0;
            foreach($item->variants as $variant){
                $variant = (string)$variant;
                if($count != 0)
                   $list .= ",";

                $list .= "{name: '".$fontName." (".$variant.")', element: 'span', styles : { ";
                
                //Font family
                $list .= "'font-family': '\"".$fontName."\"',";

                //Weight and style
                $num = strpos($variant, "italic");
                $weight = "400";
                $style = "normal";
                if($num === false){
                    if($variant == "regular")
                        $weight = "400";
                    else
                        $weight = $variant;

                    $style = "normal";
                }
                else if($num == 0){
                    $weight = "400";
                    $style = "italic";
                }
                else{
                    $weight = substr($variant, -$num);
                    $style = "italic";
                }
                $list .= "'font-weight': '".$weight."',";
                $list .= "'font-style': '".$style."'";

                //Close styles
                $list .= "}"; 

                //Close element
                $list .= "}"; 
                
                $count++;
             }
       
            $mainCount ++;
        }

        return $list."]";
    }

    return "[]";
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

      console.log("Weight: "+$obj["weight"]);
   }
   
   return $obj;
}

//Returns a Google Font css as String
function getFontCss($font){
   $obj = getGoogleFontObject($font);
   
   return "font-family:".$obj["font"]."; font-weight:".$obj["weight"].";";
}





