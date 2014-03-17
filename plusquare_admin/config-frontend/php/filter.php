<?php

/*
 *	Makes filter menu html
 */
function plusquare_make_filter_menu($meta, $tax, $all){
	global $post;
	
	//$filter_horizontal = get_post_meta( $post->ID, "filter_horizontal", true );
	//$filter_vertical = get_post_meta( $post->ID, "filter_vertical", true );
	
	$cats = get_post_meta( $post->ID, $meta, true );
	
	
	if($cats == "all"){
		//Add all
		$args = array(
		  'orderby' => 'name',
		  'show_count' => 0,
		  'pad_counts' => 0,
		  'hierarchical' => 1,
		  'hide_empty'  => 0,
		  'taxonomy' => $tax
		);
		
		$categoriesArray = get_categories($args);	
		
		$categories = array();
		if(count($categoriesArray)>0){
			foreach($categoriesArray as $cat)
				array_push($categories, $cat->term_id);
		}
		//if(WP_DEBUG)fb::log($categories);
	}
	else{
		$categories = explode(",", $cats);
	}
		
	?>
	<div class="fitler_menu" style="display:none;">
		<a href="#" class="current" onclick="return false;"><i class="esza-filter"></i><p><?php echo $all; ?></p></a>
		<div class="available">
			<?php
			echo '<a href="#" class="active" onclick="return false;" data-cat="all"><div class="round_indicator"><div class="round_indicator_inner"></div></div><p>'.$all.'</p></a>';	
			foreach($categories as $category){
				$term = get_term( $category, $tax );
				if($term->parent == 0)
					echo '<a href="#" onclick="return false;" data-cat="'.$category.'"><div class="round_indicator"><div class="round_indicator_inner"></div></div><p>'.$term->name.'</p></a>';	
			}
			?>
		</div>
	</div>
	<?php
}


function plusquare_get_filter_menu_js(){
	global $post;
	
	$filter_horizontal = get_post_meta( $post->ID, "filter_horizontal", true );
	$filter_vertical = get_post_meta( $post->ID, "filter_vertical", true );
    $filter_always_open = get_post_meta( $post->ID, "filter_always_open", true);
	$border = get_option("esza_site_border_size");

    if($filter_always_open == ""){
        $filter_always_open = "false";
    }
	
	?>
    var horizontal = <?php echo $filter_horizontal; ?>/100;
    var vertical = <?php echo $filter_vertical; ?>/100;
    var always_open = <?php echo $filter_always_open ?>;
    var $pageWraperFull = $(".easyBackground");
    var $filterMenu = $(".fitler_menu");
    var $header = $("#header");
    var openButton = $filterMenu.find(">.current");
    var available = $filterMenu.find(">.available");
    var availables = available.find("a");
    var closeInterval;
    var currentCategory = "all";
    
    var opened = false;
    
    $filterMenu.css({
        "display": "",
        "width":"1000px"
    });
    var maxWidth = available.width() + 40; // 40 -> padding
    $filterMenu.css({
        "width":"auto"
    });
    available.hide();
    var normalHeight = $filterMenu.height();
    
    var left;
    var top;

    function update_category(change){
    	var to = currentCategory;

    	//Change display
        $works.each(function(i, work){
            var $work = $(work);
            if(to == "all"){
                $work.show();
            }
            else{
                //Check if it's included
                var str = $work.data("categories").toString();
                var categories = str.split(",");
                
                $work.hide();

                var found = false;
                for(var i = 0; i< categories.length; i++){
                    if(categories[i] === to){
                    	$work.show();
                    }
                }

            }
        });
        
        masonryGrid.changedCategory( change === false ? false : true );

        resize();
	}
    
    //Change category
    availables.click(function(){
        var $this = $(this);
        
        if($this.hasClass("active")){
            close();
            return false;
        }
        
        var to = $this.attr("data-cat");
        
        availables.removeClass("active");
        $this.addClass("active");
        
        openButton.find("p").text($this.find("p").text());
        close();
        
    	currentCategory = to;
        update_category();
    });
    
    
    //Open or Close filter
    function open(){
        opened = true;
        openButton.hide();
        available.show();
        
        $filterMenu.removeClass("mobile");
        
        var allowedWidth = $pageWraperFull.width();
        var currentLeft = left-<?php echo $border; ?>;
        var leftTo = currentLeft;
        var topTo = top;
        if(currentLeft + maxWidth > allowedWidth){
            //Would overflow change left
            var overflow = (currentLeft + maxWidth) - allowedWidth ;
            
            if(allowedWidth >= maxWidth) 
                leftTo = currentLeft - overflow;
            else{
                //Needs to mobile
                $filterMenu.addClass("mobile");
                topTo -= ($filterMenu.height() - normalHeight) ;
                var menuHeight = $header.height();
                
                if(topTo < menuHeight)
                    topTo = menuHeight;
            }
        }
        
        $filterMenu.stop().css({"padding-right": "0px", "top": topTo + "px"})
                    .animate({"padding-right": "20px", "left": leftTo+<?php echo $border; ?> + "px"}, 400, "easeOutExpo");
    }
    function close(){
        if(always_open){
            return;
        }
        clearInterval(closeInterval);
        opened = false;
        openButton.show();
        available.hide();

        resize();

        $filterMenu.stop().css({"padding-right": "45px", "top": top + "px"})
                    .animate({"padding-right": "20px", "left": (vertical < 1 ? left +"px" : "auto")}, 400, "easeOutExpo");
    }
    function openToggle(){
        if(	opened )
            close();
        else
            open();
    }
    openButton.click(openToggle);
    
    if(!always_open){
        $filterMenu.hover(function(){
            clearInterval(closeInterval);
        }, function(){
            if(opened)
            closeInterval = setInterval(close, 500);
        });
    }
    else{
        open();
    }
    
    
    function resize(){
    	var width = $filterMenu.outerWidth();
    	var height = $filterMenu.outerHeight();

        var allowedWidth = $pageWraperFull.width() - width;
        var allowedHeight = $pageWraperFull.height() - height ;

        if(horizontal < 1)
        	left = Math.round(allowedWidth*horizontal) + <?php echo $border; ?>;

    	if(vertical < 1)
        	top = Math.round(allowedHeight*vertical)+ $header.height();

        console.log("top:"+vertical);

        $filterMenu.css({
            "top": (vertical < 1 ? top +"px" : "auto"),
            "bottom": (vertical == 1 ? "0px" : "auto"),
            "left": (horizontal < 1 ? left +"px" : "auto"),
            "right": (horizontal == 1 ? "0px" : "auto")
        });
    }
    resize();
    $(window).resize(resize);
    $filterMenu.fadeTo(300, 1);
    <?php
}