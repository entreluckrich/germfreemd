jQuery(function(){
	
	jQuery('.portfolio a.over').each(function(){
		
		overlay = jQuery('<span class="overlay"><span class="fui-eye"></span></span>');
		
		jQuery(this).append( overlay );
		
	})
	
})