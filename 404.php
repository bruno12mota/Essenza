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
            <h1>Page Not Found</h1>
            <hr style="margin: 25px 0;"/>
            <h4 class="exception_page"><?php echo "The page you're trying to reach does not exist, or has been moved.".
							"<br/>Please use the menu or the <a href='#' id='search_again' onclick='return false;'>search menu</a> to find what you are looking for."; ?></h4>
            <script>
                jQuery(document).ready(function($){
                    $("#search_again").click(function(){
                        $("#search_info").trigger("open");
                    });
                });
                require(["jquery", "essenza/Cover"],function($){
                    $(document).ready(function(){
                        contentLoadingOut();
                    });
                });
            </script>
        </div>
    </div>
</div>

<?php
}
?>

<?php get_footer(); ?>