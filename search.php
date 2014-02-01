<?php get_header(); ?>

<?php
//Not For IE <8
global $essenza_is_old_ie;
if($essenza_is_old_ie !== true){
?>

<!-- START PAGE WRAPER -->
<div id="page-wraper">
	<div class="container simple_page_wraper">
        <div class="content_wraper">
            	<h1><?php echo get_option("esza_trans_search_headline"); ?></h1>
                <hr style="margin: 25px 0;"/>
        		<?php if ( have_posts() ){ ?>
                <div class="search_results">
					<?php 
                    while ( have_posts() ): the_post(); 
                        $target = "";
                        $postType = get_post_type();

                    	//Gallery item
                    	if($postType == "gallery"){
                            $item_type = get_post_meta($post->ID, "item_media_type", true);

                            //is link type
                            if($item_type == "link"){
                                $link = get_post_meta($post->ID, "item_external_link", true);
                                $target = get_post_meta($post->ID, "item_external_link_target", true);
                            }

                            //is not link type
                            else{
                                $categories = plusquare_get_the_category_bytax($post->ID, 'galleries');
                                $link = get_permalink(plusquare_get_page_to_back("gallery.php", $categories, "included_gallery_categories"));

                                if (strpos($link, '?') !== FALSE)
                                    $link .= '&item='.$post->ID;
                                else
                                    $link .= '?item='.$post->ID;

                            }
                    	}

                        else if($postType == "portfolio" && get_post_meta($post->ID, "item_external_link", true) != ""){
                            $link = get_post_meta($post->ID, "item_external_link", true);
                            $target = get_post_meta($post->ID, "item_external_link_target", true);
                        }
                    	
                    	//Other
                    	else 
                    		$link = get_permalink();


						?>
                        <a href="<?php echo $link; ?>" target="<?php echo $target; ?>" class="<?php echo $target == "" ? "dynamic_loading" : "" ?>"><?php the_title(); ?></a>
                        <?php
    				endwhile;
                    ?>
				</div>
                <?php
				}
				else{
					//no results
					$search_again = get_option("esza_trans_search_no_results");
					$search_again = str_replace("#search_link#", "<a href='#' id='search_again' onclick='return false;'>", $search_again);
					$search_again = str_replace("#search_link_end#", "</a>", $search_again);
					?>
                    <h4 class="exception_page"><?php echo $search_again; ?></h4>
                    <script>
						jQuery(document).ready(function($){
							$("#search_again").click(function(){
								$("#search_info").trigger("open");
							});
						});
					</script>
                    <?php
				}
			wp_reset_query();
			wp_reset_postdata();
			?>
        </div>
    </div>
</div>
<script>
	require(["jquery", "essenza/Cover"],function($){
        $(document).ready(function(){
            contentLoadingOut();
        });
    });
</script>

<?php
}
?>

<?php get_footer(); ?>