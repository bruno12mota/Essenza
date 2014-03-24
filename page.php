<?php get_header(); 

//Not For IE <8
global $essenza_is_old_ie;
if($essenza_is_old_ie !== true){
?>

<?php 
  
  if(isset($_GET["rel"])){
    $essenza_page_dynamically_loaded = $_GET["rel"];
  }

  //Check if it's not page change dynamically loaded
  if(isset($essenza_page_dynamically_loaded) && $essenza_page_dynamically_loaded == "comments" ){
    if(comments_open())
      comments_template('', true);
    ?>
    <script>
        require(["jquery", "essenza/Cover"],function($){
            $(document).ready(function(){
                contentLoadingOut();
            });
        });
    </script>
    <?php
  }
  else{


  //Check if it's not page change dynamically loaded
  if(!isset($essenza_page_dynamically_loaded) || (isset($essenza_page_dynamically_loaded) && $essenza_page_dynamically_loaded != "page") ){

	$useSidebar = get_post_meta( $post->ID, "use_sidebar", true ) == "true"; 

  //options
  $page_align = get_post_meta($post->ID, "page_align", true);

  $title_display = get_post_meta($post->ID, "title_display", true);
  $title_align = get_post_meta($post->ID, "title_align", true);

  $titleStyle = $title_align == "center" ? "text-align: center;" : ($title_align == "right" ? "text-align: right;" : "");

?>

<!-- START PAGE WRAPER -->
<div id="page-wraper">

  <?php plusquare_get_page_css(); ?>

	<div id="page_<?php echo $post->ID; ?>" class="container simple_page_wraper <?php echo $useSidebar ?  "with_sidebar" : ""; ?> <?php echo $page_align; ?>" >
      <div class="content_wraper dynamic_layout <?php echo ($title_display === "true" || $title_display === "") ? "has_title" : ""; ?>">
               
        <?php 
        if($title_display === "true" || $title_display === ""){
          ?>
          <div class="page_padded" style="<?php echo $titleStyle; ?>">
         	  <h1 id="post-<?php the_ID(); ?>" ><?php the_title();?></h1>
            <hr id="page_replace_after_this" style="display: inline-block;"/>
          </div>
          <?php
        }
   }
   ?>
         <div id="page_replace_content_wraper" style="<?php echo !comments_open() ? "margin-bottom:30px;" : ""; ?>">
            <?php if (have_posts()) : while (have_posts()) : the_post(); ?>

            <?php the_content(); ?>

            
             <?php

             wp_link_pages( array(
             'before'           => '<div class="paginate page_paginate">',
             'after'            => '</div>',
             'link_before'      => '<span>',
             'link_after'       => '</span>',
             'next_or_number'   => 'number',
             'nextpagelink'     => 'Next page',
             'previouspagelink' => 'Previous page',
             'pagelink'         => '%',
             'echo'             => 1
             ) );

             ?>
            

            <?php endwhile; endif; ?>
            
            <script>
                 require(["jquery", "essenza/Cover"],function($){
                      $(document).ready(function(){
                          contentLoadingOut();
                      });
                  });
            </script>
         </div>
   <?php
   //Check if it's not page change dynamically loaded
  if(!isset($essenza_page_dynamically_loaded) || (isset($essenza_page_dynamically_loaded) && $essenza_page_dynamically_loaded != "page") ){    
   ?>


         <?php 
          if(comments_open()){
            ?><div class="page_padded last"><?php
            comments_template('', true); 
            ?></div><?php
          }
        ?>


         <?php
         if($useSidebar){
            //SIDEBAR
            ?>
            <div class="sidebar">
            <?php echo plusquare_make_sidebar( get_post_meta( $post->ID, "sidebar", true ) ); ?>
            </div>
            <?php
		    }
         ?>  
     </div>
  </div>
</div>
   <?php
   }
 }
}
?>


<?php get_footer(); ?>