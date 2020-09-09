jQuery( document ).ready(function() {
    var cw = jQuery('.kartra_portfolio_item').width();
    jQuery('.kartra_portfolio_item').css({'height':cw+'px'});

    var dw = jQuery('.custom_modal .modal-dialog .img').width();
    jQuery(document).on("click", ".kartra_portfolio_item__portfolio-link", function () {
        var thisimg = jQuery(this).children(".background-item").css("background-image");
        jQuery("#portfolioModal").find(".modal-body").children(".img").css("background-image",thisimg);

    });

    if (jQuery(".js_portfolio5")[0]){
        jQuery( document ).ready(function() {
            var cw = jQuery('.kartra_portfolio_item--large').width();
            jQuery('.kartra_portfolio_item--large').css({'height':cw+'px'});

             var cw2 = jQuery('.kartra_portfolio_item--small').width();
            jQuery('.kartra_portfolio_item--small').css({'height':cw2+'px'});

            var dw = jQuery('.custom_modal .modal-dialog .img').width();
            jQuery(document).on("click", ".kartra_portfolio_item__portfolio-link", function () {
                var thisimg = jQuery(this).children(".background-item").css("background-image");
                jQuery("#portfolioModal").find(".modal-body").children(".img").css("background-image",thisimg);

            });

        });

        jQuery( window ).resize(function() {
            var cw = jQuery('.kartra_portfolio_item--large').width();
            jQuery('.kartra_portfolio_item--large').css({'height':cw+'px'});
        });

         jQuery( window ).resize(function() {
            var cw2 = jQuery('.kartra_portfolio_item--small').width();
            jQuery('.kartra_portfolio_item--small').css({'height':cw2+'px'});
        });
    }

    if (jQuery(".js_portfolio7")[0]){
        jQuery( document ).ready(function() {
                
            jQuery('.kartra_portfolio_item--large').css({'height': 490+'px'});
            jQuery('.kartra_portfolio_item--small').css({'height': 202+'px'});

            var dw = jQuery('.custom_modal .modal-dialog .img').width();
            jQuery(document).on("click", ".kartra_portfolio_item__portfolio-link", function () {
                var thisimg = jQuery(this).children(".background-item").css("background-image");
                jQuery("#portfolioModal").find(".modal-body").children(".img").css("background-image",thisimg);

            });

        });
    }

});

jQuery( window ).resize(function() {
    var cw = jQuery('.kartra_portfolio_item').width();
    jQuery('.kartra_portfolio_item').css({'height':cw+'px'});
});