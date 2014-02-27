jQuery(document).ready(function($) {
    $(".ui-accordion").each(function(){
        var $accordion = $(this);
        
        $("li", $accordion).each(function(){
            var $li = $(this);
            var $content = $(".content", $li);
            var $img = $(".img", $li);
                
            if ($content.is(':hidden'))
                $img.removeClass("active");
            else 
                $img.addClass("active");
            
            $(".head", $li).click(function(e){
                e.preventDefault();
                
                $content.not(':animated').slideToggle(150, $.proxy(function(){
                    if ($content.is(':hidden'))
                        $img.removeClass("active");
                    else 
                        $img.addClass("active");
                    
                    return false;
                }, this));
                
                return false;
            });
        });
    });
});