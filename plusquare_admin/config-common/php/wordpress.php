<?php


/*
 *	Gets the categories of post by taxonomy
 */
function plusquare_get_the_category_bytax( $id = false, $tcat = 'category' ) {
    $categories = get_the_terms( $id, $tcat );
    if ( ! $categories )
        $categories = array();
		
    $categories = array_values( $categories );

    foreach ( array_keys( $categories ) as $key ) {
        _make_cat_compat( $categories[$key] );
    }
	
    // Filter name is plural because we return alot of categories (possibly more than #13237) not just one
    return apply_filters( 'get_the_categories', $categories );
}


/*
 *  Gets the categories in string of post by taxonomy
 */
function plusquare_get_categories_str($categories, $option = "portfolio_category"){
    $parents = array();
    foreach($categories as $category){
        //push current
        array_push($parents, $category->term_id);
        
        //push all parents
        if($category->parent != 0){
            $term = $category;
            do{
                //Get parent
                $term = get_term( $term->parent, $option );
                array_push($parents, $term->term_id);
            }while($term->parent != 0);
        }
    }
    
    $parentsStr = "";
    foreach($parents as $index=>$parent){
        if($index != 0)
            $parentsStr .= ",";
        
        $parentsStr .= $parent;
    }   
    return $parentsStr;
}