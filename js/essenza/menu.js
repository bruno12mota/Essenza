var esza_submenu_alignment = directory["esza_submenu_alignment"];
var esza_submenu_start_opacity = parseFloat(directory["esza_submenu_start_opacity"], 10);
var esza_submenu_start_vertical_offset = parseFloat(directory["esza_submenu_start_vertical_offset"], 10);
var esza_submenu_animation_duration = parseFloat(directory["esza_submenu_animation_duration"], 10) * 1000;
var esza_submenu_indication = directory["esza_submenu_indication"];
var esza_submenu_indication_icon = directory["esza_submenu_indication_icon"];
var esza_menu_min_margin = parseInt(directory["esza_menu_min_margin"], 10);

var $ = jQuery;
var Dragable = require("../other/Dragable.js");
var Cover = require("./Cover.js");


//STATE 0 -> normal stance
//STATE 1 -> mobile stance
var menuState = -1;

//Holders
var $normalWraper, $mobileWraper, $normalMenu, $mobileMenu, $subMenus, $header, $subMenus, $footer;
var $mobileComp, $normalComp, $logo;


//Variables
var opened = false;		//true if menu is opened
var logoWidth, menuNotMobileWidth, isTouch, openedHeight, closedHeigth;
var previousTopPosition = 0;
var normalMenuHeight = 0;
var noSubmenu = true;

var submenusIndividual = false;


//Initiate Menu function (called after jquery ready event)
function initiateMenu(){
	//Holders
	$normalWraper = $(".menu_wraper").eq(0);
	$mobileWraper = $(".menu_wraper.mobile");

	$footer = $("#footer");

	$normalMenu = $("#menu");
	$mobileMenu = $("#menu_mobile");
    $subMenus = $normalMenu.find(".sub-menu");

    $header = $("#header");
    $mobileComp = $(".menuMobile"); 
    $normalComp = $(".menuNotMobile");

    $subMenus = $normalMenu.find(".sub-menu");

	//Variables
    $logo = $("#logo");
	logoWidth = $logo.width() + parseInt( $logo.css("margin-left") , 10);
    menuNotMobileWidth = $normalComp.length > 0 ? $normalComp.width() : 0;
    isTouch = $("html").hasClass("touch");
    openedHeight = $normalMenu.height()+25;
    closedHeigth = $header.height();
    submenusIndividual = $header.hasClass("submenus_individual");

	//Arrange
    arrangeMenu();

	//Initial settings
    if(!submenusIndividual)
	   $subMenus.stop().fadeTo(0, 0);
    onResize();

	//Bindings
    $(window).resize(onResize);

    $("#menu a").bind(clickBind, closeMenu);
    $("#menu_mobile a").bind(clickBind, closeMenu);
    $(".toogleMenuMobile").bind(clickBind, toogleMenu);

    if(menuState == 0)
        $normalWraper.fadeTo(300, 1);
}


//Arrange Menu Spacings
function arrangeMenu(){
    var $lis = $normalMenu.find(">li");

    if(esza_submenu_indication == "true")
        $lis.each(function(){
            var $this = $(this);
            var $u = $this.find(">ul");

            if($u.length > 0){
                $this.find(">a").append("<i class='"+esza_submenu_indication_icon+"'></i>");
            }
        });

    

    if(submenusIndividual){
        var numLis = $lis.length;
        $lis.each(function(index){
            var $this = $(this);
            var $u = $this.find(">ul");
            var $a = $this.find(">a");

            var aWidth = $a.width();
            var uWidth = $u.length == 0 ? 0 : $u.width();

            if($u.length != 0)
                noSubmenu = false;

            if(index == numLis-1)
                $this.css("width", aWidth+"px");
            else
                $this.css("width", aWidth+esza_menu_min_margin+"px");

            if($u.length > 0){
                var left = esza_submenu_alignment == "left" ? 0 : (esza_submenu_alignment == "center" ? Math.round((aWidth-uWidth)/2) : aWidth-uWidth);

                $u.css({"opacity": 0, "width": uWidth+"px", "left":left+"px"}).hide();
            }

            if(index == numLis-1)
                normalMenuHeight += aWidth;
            else
                normalMenuHeight += aWidth+esza_menu_min_margin;
        });
        normalMenuHeight += parseInt($normalMenu.css("margin-left"), 10);
        normalMenuHeight += parseInt($normalMenu.css("margin-right"), 10);
    }
    else{
        //Normal Menu Arrange
        var objects = new Array();

        //Get max width
        $lis.each(function(){
            var $this = $(this);
            var $u = $this.find("ul");
            var $a = $this.find("a");

            var uWidth = $u.length == 0 ? 0 : $u.width();
            var aWidth = $a.width();

            if($u.length != 0)
                noSubmenu = false;

            objects.push({
                "u": $u,
                "a": $a,
                "uw": uWidth,
                "aw": aWidth
            });
        });

        //Get max gap
        var maxGap = 20;    //Minimum gap
        $.each(
            objects,
            function(index, obj){
                var gap = Math.max(obj.uw - obj.aw, 0);
                if(gap > maxGap)
                    maxGap = gap;
            }
        );

        //Arrange
        $.each(
            objects,
            function(index, obj){
                var w = obj.aw + maxGap;

                if(obj.u.length != 0)
                    obj.u.css("width", w+"px");
                obj.a.parent(".menu-item").css("width", w+"px");
                var margin = parseInt(obj.a.parent(".menu-item").css("margin-right"), 10);

                normalMenuHeight += w+margin;
            }
        );
    }
	
}



//Toogle Menu
function toogleMenu(){
	if(opened)
        //close menu
        closeMenu();
    else
        //open menu
        openMenu();
}



//Open Menu
function openMenu(){
    opened = true;
    
    //If not the mobile
    if(menuState == 0 && !noSubmenu){
        //Individual submenu
        if(submenusIndividual){
            var $li = $(this);
            var $submenu = $li.find("ul");

            if($submenu.length > 0)
                $submenu.stop().show().css({"opacity": esza_submenu_start_opacity, "top": esza_submenu_start_vertical_offset+"px"}).animate({
                        "opacity": 1,
                        "top": "0px"
                    }, esza_submenu_animation_duration, "easeOutExpo");
        }
        else{
            $subMenus.show();
            openedHeight = 25 + $normalMenu.height();

            //Submenus vertical offset position
            var del = 0;
            $subMenus.each(function(i, subMenu){
                var $subMenu = $(subMenu);
                $subMenu.stop().css({"opacity": 0, "top": "15px"}).delay(del).animate({
                    "opacity": 1,
                    "top": "0px"
                }, 600, "easeOutExpo");
                del += 70;
            });

            $header.stop().css("height", (openedHeight-15 > closedHeigth) ? openedHeight-15 : closedHeigth).animate({
                "height":openedHeight+"px"
            }, 900, "easeOutExpo");

    
            //Content cover in
            if(esza_cover_menu)
                Cover.contentCoverIn();
        }
    }
    
    //If mobile
    else if(menuState == 1){
    	previousTopPosition = $(document).scrollTop();

    	//Restrain page size
    	var height = $mobileWraper.show().height();

        //var available = $(".easyBackground").height();

        //if(height > available){
        $("#page-wraper").css({"height": height+"px", "overflow": "hidden"});
        $("#page-wraper-full").css({"height": height+"px", "overflow": "hidden"});
        //}

    	//Show menu
    	$mobileMenu.stop().css("top", "-20px").animate({"top": "0px"}, 300, "easeOutExpo");

    	//Show hr
    	$("#footer, .menu_wraper.mobile").find("hr").show();

    	//Footer
    	$footer.css("display", "block");

    	//scroll top
    	$('html, body').animate({"scrollTop":0}, 400, "easeOutExpo");
    
        //Content cover in
        if(esza_cover_menu)
            Cover.contentCoverIn();
    }
}



//Close Menu
function closeMenu(){
    opened = false;
    
    //If not the mobile
    if(menuState == 0 && !noSubmenu){
        if(submenusIndividual){
            var $li = $(this);
            var $submenu = $li.find("ul");

            if($submenu.length > 0)
                $submenu.hide();
        }
        else{
            $subMenus.hide();

            $header.stop().css("height", (closedHeigth+15 < openedHeight) ? closedHeigth+15 : openedHeight).animate({
                    "height":closedHeigth+"px"
            }, 900, "easeOutExpo");
    
            //Content cover out
            if(esza_cover_menu)
                Cover.contentCoverOut();
        }
	}
	else if(menuState == 1){
		$mobileWraper.hide();

		$("#page-wraper").css({"height": "", "overflow": ""});
		$("#page-wraper-full").css({"height": "", "overflow": ""});

    	$("#footer, .menu_wraper.mobile").find("hr").hide();
    	$footer.css("display", "");

    	$('html, body').animate({"scrollTop":previousTopPosition+"px"}, 400, "easeOutExpo");
    
        //Content cover out
        if(esza_cover_menu)
            Cover.contentCoverOut();
	}
}



//Normal Menu config
function normalMenu(){
    if(menuState == 0)
        return;
    
    if(opened)
        closeMenu();
    
    smallMenuOut();

    $normalWraper.show();

    if(submenusIndividual){
        var $lis = $normalMenu.find(">li");
        $lis.hover(openMenu, closeMenu);

        if(esza_cover_menu)
            $normalMenu.hover(Cover.contentCoverIn, Cover.contentCoverOut);
    }
    else{
        $subMenus.show();
        openedHeight = $normalMenu.height()+25;
        $normalMenu.hover(openMenu, closeMenu);
        $subMenus.hide();
    }


    menuState = 0;
}

function normalMenuOut(){
    $normalMenu.unbind("hover");
    $normalWraper.hide();
}

//Mobile Menu config
function smallMenu(){
    $mobileComp.css("display", "");
    var dif = ($logo.offset().left + logoWidth) - $mobileComp.offset().left;
    if(dif > 0){
        var w = (logoWidth - dif) / logoWidth;
        $logo.setTransform("scale("+w+", "+w+")");
    }
    else{
        $logo.setTransform("scale(1, 1)");
    }


    if(menuState == 1)
        return;
    
    if(opened)
        //close menu
        closeMenu();
    
    //Leave previous state
    normalMenuOut();
        

    $header.addClass("mobile");
    
    //Hide non mobile components
    $normalComp.css("display", "none");
    
    //Show mobile components
    $mobileComp.css("display", "");
    
    //If current state is opened, open menu
    if(opened)
        openMenu();
    
    //Change state
    menuState = 1;
        
}
function smallMenuOut(){
    $header.removeClass("mobile");
    
    $mobileWraper.css("display", "none");
    $normalComp.css("display", "");
    $mobileComp.css("display", "none");
    $normalWraper.css("height", "");
}


    
    
//On Resize Event Handler
function onResize(){
	var windowWidth = $(window).width();
	
	var bigWidth = windowWidth - (33*2) - logoWidth - menuNotMobileWidth - 30;
	
    if(isTouch || normalMenuHeight >= bigWidth)
        smallMenu();
    else
        normalMenu();
}
    


//On jquery ready initiate menu
jQuery(document).ready(initiateMenu);

