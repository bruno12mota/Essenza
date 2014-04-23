<?php


//Ajax functions
include_once('php/ajax.php');

//Ajax functions
include_once('config-templatecustomizer/template_customizer.php');

//Enqueues
include_once('php/enqueues.php');

//Metabox
include_once('php/pq_options.php');
include_once('php/pq_meta_box.php');

include_once("config-pages/pages.php");



//Prevent user from rich editing
//add_filter ( 'user_can_richedit' , create_function ( '$a' , 'return false;' ) , 50 );

//Before rich editor builds
add_filter('tiny_mce_before_init', 'myformatTinyMCE' );
add_filter( 'wp_default_editor', create_function('', 'return "html";') );
function myformatTinyMCE($in){
    if($in["selector"] == "#content"){
        $in["wpautop"] = 0;
    }
    else{
        $style_formats = get_google_fonts_list();
        $in['style_formats'] = json_encode( $style_formats );
    }
    return $in;
}


//Add styles dropdown
add_filter( 'mce_buttons_2', 'my_mce_buttons_2' );
function my_mce_buttons_2( $buttons ) {
    array_unshift( $buttons, 'styleselect' );
    return $buttons;
}

//Add styles to editors
add_action( 'init', 'pq_add_editor_styles' );
function pq_add_editor_styles() {
    $font_url = get_google_fonts_link();
    add_editor_style( str_replace( ',', '%2C', $font_url ) );
    add_editor_style( get_template_directory_uri().'/css/text_styles.css' );

}





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

    if($fontsJsonStr != FALSE && $fontsJsonStr != ""){
        $list = array();
        foreach($fontsJson->items as $item){

            $fontName = $item->family; 
            $fontName = str_replace("_", " ", $fontName);

            foreach($item->variants as $variant){
                $variant = (string)$variant;

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

                //Create object
                $obj = array(
                    'title' => $fontName ." (".$variant.")",
                    'inline' => 'span',
                    'styles' => array(
                        'fontFamily' => '"'.$fontName.'"',
                        'fontWeight' => $weight,
                        'fontStyle' => $style
                    )
                );
                
                $list[] = $obj;
             }
        }

        return $list;
    }

    return array();
}




