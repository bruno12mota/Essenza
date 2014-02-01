<?php
	$type = $_GET["type"];
	
	$image_meta = "thumbnail";
	
	if(isset($_GET["image_meta"]))
		$image_meta = $_GET["image_meta"];

	//load wordpress into template. dont touch me!
	define('WP_USE_THEMES', false);
	require_once("../../../../../wp-load.php");
	//ah, wordpress is loaded. balance has been restored.
	$posts = new WP_Query( array( 	'post_type' => $type, 
									'post_status' => array('publish', 'draft', 'pending', 'future', 'private', 'inherit', 'auto-draft'),
									'orderby' => 'meta_value_num', 
									'meta_key' => 'position',
									'order' => 'ASC',
									'nopaging'=> true ));
?>
 
<div style="margin-top: 10px; overflow:hidden;">
    <h2 class="pq_style" style="float:left; padding-right:20px; margin:0; float:left; ">Current items</h2>
    <div class="save_grid" style="overflow:hidden;">
        <a href="#" class="pq_style save_button" style="float:left;" onclick="return false;">Click to save grid order</a>
        <p class="loading-gif loading_status" style="display:none; color:#AAAAAA; margin:0;">Saving <?php echo $type; ?> items grid, closing the window now might prevent your changes from saving!</p>
    </div>
</div>
<div id="queryContainer" style="clear:both;margin-top:20px;position:relative;">
    <?php if($posts->have_posts()): 
		while($posts->have_posts()):  $posts->the_post(); ?>
        	<div class="item" rel="<?php echo $post->ID; ?>">
    			<div class="item-inner">
                	<div class="img">
                    	<?php 
							echo wp_get_attachment_image( get_post_meta($post->ID, $image_meta, true), "thumbnail" ); 
						?>
                        <div class="dragArea"></div>
                        <div class="buttons">
                            <a class="edit" target="_blank" href="<?php echo get_edit_post_link( $post->ID ); ?>"></a>
                            <a class="trash" href="<?php echo get_delete_post_link( $id ); ?> "></a>
                        </div>
                    </div>
                	<div class="title"><?php the_title(); ?></div >
                    
                    <?php
					$status = get_post_status( $post->ID );
					
					$taxonomy = "category";
					if($type == "portfolio")
						$taxonomy = "portfolio_category";
					else if($type == "gallery")
						$taxonomy = "galleries";
					$categories = plusquare_get_the_category_bytax($post->ID, $taxonomy);
					if(count($categories) == 0)
						$status = "Uncategorized";
					
					if( $status == "publish" || $status == "private"){
						echo "<div class='sub online'>".($status == "publish" ? "published" : $status)."</div>";	
					}
					else{
						echo "<div class='sub offline'>".$status."</div>";	
					}
					?>
            	</div>
            </div>
    	<?php endwhile; ?>
    <?php endif; 
	// Restore original Query & Post Data
	wp_reset_query();
	wp_reset_postdata();?>
</div>

<?php				
	$trash = new WP_Query( array( 'post_type' => $type, 
								'post_status' => array('trash'),
								'nopaging'=> true,
								'orderby' => 'modified' ));
?>

<div class="clear"></div>

<h2 class="pq_style" style="color: #9b9a9b;">Trashed items</h2>
<?php 
if($trash->have_posts()){
    ?>
	<a class="pq_style" href="#" id="toogleTrash">Click to view trashed items</a>
    <?php
}
else{
	?>
	<p>There are no items in the trash bin!</p>
    <?php
}
?>
<div id="queryTrashContainer" class="items-grid-holder">
    <div class="items-grid">
        <?php if($trash->have_posts()): 
            while($trash->have_posts()):  $trash->the_post(); ?>
                <div class="item">
                    <div class="item-inner">
                        <div class="img">
                            <?php echo wp_get_attachment_image( get_post_meta($post->ID, "thumbnail", true), "thumbnail" ); ?>
                            <div class="buttons">
                                <a class="restore" href="<?php echo wp_nonce_url( home_url() . "/wp-admin/post.php?action=untrash&amp;post=" . $post->ID, 'untrash-post_' . $post->ID) ?>"></a>
                                <a class="remove" href="<?php echo wp_nonce_url( home_url() . "/wp-admin/post.php?action=delete&amp;post=" . $post->ID, 'delete-post_' . $post->ID) ?>"></a>
                            </div>
                        </div>
                        <div class="title"><?php the_title(); ?></div >
                        
                        <?php
                        $status = get_post_status( $post->ID );
                        if( $status == "publish" || $status == "private"){
                            echo "<div class='sub online'>".$status."</div>";	
                        }
                        else{
                            echo "<div class='sub offline'>".$status."</div>";	
                        }
                        ?>
                    </div>
                </div>
            <?php endwhile; ?>
        <?php endif; 
        // Restore original Query & Post Data
        wp_reset_query();
        wp_reset_postdata();?>
    </div>
</div>
	