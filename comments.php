<?php
if ( post_password_required() )
	return;
	
$comment_Str = get_option("esza_trans_comment");
$comments_Str = get_option("esza_trans_comments");
$no_comments_Str = get_option("esza_trans_no_comments");
$hide_Str = get_option("esza_trans_hide");
$show_Str = get_option("esza_trans_show");
$leave_comment_Str = get_option("esza_trans_leave_comment");

$name_Str = get_option("esza_trans_name");
$email_Str = get_option("esza_trans_email");
$website_Str = get_option("esza_trans_website");
$message_Str = get_option("esza_trans_message");

$or_facebook_Str = get_option("esza_trans_or_facebook");
$logged_as_Str = get_option("esza_trans_logged_as");
$log_out_Str = get_option("esza_trans_log_out");
$cancel_reply_Str = get_option("esza_trans_cancel_reply");
$reply_to_Str = get_option("esza_trans_reply_to");

$comment_error = get_option("esza_trans_comment_error");
$numberOfComments = get_comments_number($post->ID);

if(isset($_GET["rel"])){
	$essenza_page_dynamically_loaded = $_GET["rel"];
}

//Check if it's not page change dynamically loaded
if(!isset($essenza_page_dynamically_loaded) || (isset($essenza_page_dynamically_loaded) && $essenza_page_dynamically_loaded != "comments") ){    
?>


<!-- divider -->
<hr class="thin"/>

<!-- comments collapsed -->
<h4 class="show_comments">
    <span class="comment_number <?php if($numberOfComments==0) echo "no_comments"; ?>"><?php 
    //comments number
    comments_number( "0 ".$comments_Str, "1 ".$comment_Str, "% ".$comments_Str ); 
    ?></span><?php
	if($numberOfComments>0){
		?><a id="show_sub" class="" href="#" onclick="return false;">(<?php echo $show_Str; ?>)</a><?php
	}
	else{
		?><a id="show_sub" class="" href="#" onclick="return false;">(<?php echo $comment_Str; ?>)</a><?php
	}
	?>
</h4>

<!-- comments -->
<div id="comments_holder" class="comments" style="display:none;">
    <h4><span><?php 
    //comments number
    comments_number( "0 ".$comments_Str, "1 ".$comment_Str, "% ".$comments_Str ); 
    ?></span><a id="hide_comments" href="#">(<?php echo $hide_Str; ?>)</a></h4>
    
    
    <div id="comments_replace_after_this" class="clearfix"></div>

<?php
}
?>   
    <div id="comments_replace_content_wraper">
	    <?php
		if($numberOfComments > 0)
			wp_list_comments('type=comment&callback=pq_custom_comments');
		else
			echo $no_comments_Str;

		?>
	    <div class="clearfix"></div>
		<div class="paginate comments_paginate" style="text-align:right; "> 
			<?php
			paginate_comments_links( array(
				'echo' => true,
				'prev_text' => "<span class='inner'></span>",
				'next_text' => "<span class='inner'></span>"
			));
		    ?>
		</div>
	    <div class="clearfix"></div>

	    <script>
		    require(["jquery",
				"jquery/jquery.easing.1.3"], function($) {
				$(document).ready(function($){
	    			var cancel_reply = $("#cancel_reply");
					var formLabel = $("#form_label");
					var initialText = $("#form_label").text(); 
					var comment_parent = $("#comment_parent");
					comment_parent.val(0);
				
					//MAKE REPLY
					$(".comment_reply").click(function(){
						var rel = $(this).attr("data-commentId");
						var author = $(this).data("author");
						comment_parent.val(rel);
						
						formLabel.text("<?php echo $reply_to_Str; ?> "+author);
						
						cancel_reply.text("(<?php echo $cancel_reply_Str; ?> "+author+")");
						cancel_reply.css("display", "");
						
						//$(document).scrollTo("#form_label");
						$('html, body').animate({"scrollTop":formLabel.offset().top+"px"}, 500, "easeOutExpo");
						
						return false;
					});
					
					
					//CANCEL REPLY
					$("#cancel_reply").click(function(){
						formLabel.text(initialText);
						cancel_reply.css("display", "none");
						comment_parent.val(0);
						
						return false;
					});
				});
			
			});
	    </script>
	</div>
<?php
//Check if it's not page change dynamically loaded
if(!isset($essenza_page_dynamically_loaded) || (isset($essenza_page_dynamically_loaded) && $essenza_page_dynamically_loaded != "comments") ){    
?>   
    <!-- Leave Comment -->
    <hr class="thin"/>
    <h4 style="margin-bottom: 20px; margin-top: 25px;"><span id="form_label"><?php echo $leave_comment_Str; ?></span><a href="#" id="cancel_reply" style="display:none;">(cancel reply to)</a></h4>
    
    
    
    <form action="<?php echo get_option('siteurl'); ?>/wp-comments-post.php" method="post" id="commentform">
        
        <div class="row-fluid">
            <div class="span2">
                <p><?php echo $name_Str;?> *</p>
            </div>
            <div id="not_logged_holder" class="span10">
                <input type="text" name="author" id="author" value="" size="22" tabindex="1" />
                <div class="connect_facebook_holder">
                	<p><?php echo $or_facebook_Str; ?> </p><a href="#" class="facebook_login_button" onclick="return false;"></a>
                </div>
            </div>
            <div id="logged_holder" class="span10" style="display:none;">
                <div class="thumbnail_comment small"></div>
                <div class="holder" style="max-width:313px;">
                    <p><?php echo $logged_as_Str; ?> <span>Plusquare</span>. <a href="#" class="logout_button" onclick="return false;"><?php echo $log_out_Str; ?></a>.</p>
                </div>
            </div>
        </div>
        
        <div class="row-fluid">
            <div class="span2">
                <p><?php echo $email_Str;?></p>
            </div>
            <div class="span10">
                <input type="text" name="email" id="email" value="" size="22" tabindex="2"  /> 
            </div>
        </div>
        
        <div class="row-fluid">
            <div class="span2">
                <p><?php echo $website_Str;?></p>
            </div>
            <div class="span10">
                <input type="text" name="website" id="website" value="" size="22" tabindex="2"  /> 
            </div>
        </div>
        
        <div class="row-fluid">
            <div class="span2">
                <p><?php echo $message_Str;?> *</p>
            </div>
            <div class="span10">
                <textarea name="comment" id="comment" rows="10" tabindex="4" onFocus="clearText(this)" onBlur="clearText(this)" ></textarea>
            </div>
        </div> 

        <div class="row-fluid on_error" style="display:none;"><div class="span10 offset2" style="max-width:320px;"><?php echo do_shortcode("[message_box type='error']".$comment_error."[/message_box]"); ?></div></div>
				
        
        <div class="row-fluid">
            <div class="span10 offset2">
            	<?php echo do_shortcode("[button]".get_option("esza_comment_submit_button")."[/button]"); ?>
            </div>
        </div> 
        <?php comment_id_fields(); ?>
        
        <?php do_action('comment_form', $post->ID); ?>
    </form>
    
    <script>
	require(["jquery",
			"jquery/jquery.easing.1.3"], function($) {
			$(document).ready(function($){
				var $not_logged_holder = $("#not_logged_holder");
				var $logged_holder = $("#logged_holder");
				//FACEBOOK
				function facebookInitiated() {
					// Additional initialization code such as adding Event Listeners goes here
					FB.getLoginStatus(function(response) {
						if (response.status === 'connected') {
							// connected
							loggedIn();
						} else if (response.status === 'not_authorized') {
							// not_authorized
							$("#author").val("");
						} else {
							// not_logged_in
							$("#author").val("");
						}
					});
					
					$(".facebook_comment").each(function(){
						var authorId = $(this).find(".comment_author").text();
					});
				};
				
				if($("body").hasClass("FacebookLoaded"))
					facebookInitiated();
				else
					$("body").bind("FacebookLoaded", facebookInitiated);
				
				function loggedIn(){
					FB.api('/me?fields=name,picture,id', function(response) {
						$logged_holder.find("p span").text(response.name);
						if(!response.picture.data.is_silhouette)
							$logged_holder.find(".thumbnail_comment").css("background-image", "url("+response.picture.data.url+")");
						else
							$logged_holder.find(".thumbnail_comment").css("background-image", "");
							
						$not_logged_holder.css("display", "none");
						$logged_holder.css("display", "");
						
						$("#author").val("facebook:"+response.id);
					});	
				}
				function login() {
					FB.login(function(response) {
						if (response.authResponse) {
							// connected
							loggedIn();
						} else {
							// cancelled
						}
					});
				}
				function logout() {
					FB.logout(function(response) {
						$not_logged_holder.css("display", "");
						$logged_holder.css("display", "none");
						$("#author").val("");
					});
				}
				$(".facebook_login_button").click(function(){
					login();
					return false;
				});
				$(".logout_button").click(function(){
					logout();
					return false;
				});
			
			
				var form = $("#commentform");
				var subButton = $("#commentform").find(".button").click(function(){
					form.submit();
					return false;
				});

				var $error = form.find(".on_error");
				form.submit(function(){
					var name = $("#author").val();
					var com = $("#comment").val();

					if(name == "" || com == ""){
						$error.slideDown(250);
						return false;
					}
				});
			
			
				
				
				//SHOW COMMENTS
				var $show_comments = $(".show_comments");
				var $hide_comments = $("#hide_comments");
				var $comments_holder = $("#comments_holder");
				
				function showComments(){
					$comments_holder.css("display", "block");
					$show_comments.css("display", "none");
					return false;
				}
				
				$show_comments.click(showComments);
				
				//HIDE COMMENTS
				$hide_comments.click(function(){
					$show_comments.css("display", "");
					$comments_holder.css("display", "none");
					return false;
				});
				
				if(!(typeof TO_COMMENTS === 'undefined'))
					if(TO_COMMENTS){
						var tp = $show_comments.offset().top;
						TO_COMMENTS = false;
						showComments();
						$('html, body').animate({"scrollTop":tp-40+"px"}, 1000, "easeOutExpo");
					}
			});
		});
    </script>
</div>
<?php
}
?> 