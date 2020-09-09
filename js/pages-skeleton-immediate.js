(function (jQuery, window) {

    /**
     * If webp is supported in the browser, change background images extension to .webp
     */

    var lazyloadTriggered = false;

    // First we test for the Modernizr object for support, because it's faster

    if (Modernizr['webp']) {

        convertToWebp();
        enableImageLazyload();
        enableBackgroundLazyload();

        lazyloadTriggered = true;

    }

    // If the object doesn't exist yet, we need to wait for the test event to fire

    Modernizr.on('webp', function(result) {

        if (result) {

            // If the browser supports webp, and the lazyload was not applied
            // we convert the background images and we apply the lazyload

            if (!lazyloadTriggered) {
                convertToWebp();
                enableImageLazyload();
                enableBackgroundLazyload();
            }

        } else {

            // If the browser doesn't support webp, we apply lazyload straigtaway

            enableImageLazyload();
            enableBackgroundLazyload();

        }
    });

    /**
     * Convert background images to .webp if supported by browser
     */

    function convertToWebp() {
        var $elements = jQuery('.js-bg-next-gen');

        if ($elements.length) {
            $elements.each(function (i, el) {
                var $backgroundImage    = jQuery(el),
                    backgroundImagePath = $backgroundImage.attr('data-bg');

                if ('undefined' !== typeof backgroundImagePath) {
                    backgroundImagePath = backgroundImagePath.replace(/\.[^.]+$/i, '.webp');
                }

                $backgroundImage.attr('data-bg', backgroundImagePath);
            });
        }
    }

    /**
     * Apply lazyload to images
     */
    function enableImageLazyload() {
        var imagesLazyload = new LazyLoad({
            threshold: 500,
            data_src : 'original'
        });
    }

    /**
     * Apply lazyload
     */

    function enableBackgroundLazyload() {

        /**
         * Lazyloading backgrounds
         */

        var backgroundsLazyload = new LazyLoad({
            threshold        : 500,
            elements_selector: '.background_changer, .background-item',
            callback_reveal  : function (el) {
                var $backgroundImage = jQuery(el);

                if ($backgroundImage.hasClass('kartra_parallax_background') &&
                    'undefined' !== typeof window['kartra'] &&
                    'undefined' !== typeof window['kartra']['customParallax']) {

                    window['kartra']['customParallax'].applyCustomParallax($backgroundImage);
                }
            }
        });

        /**
         * Lazyloading Carousel items
         */

        var carouselLazyload = new LazyLoad({
            threshold        : 500,
            elements_selector: '.kartra_carousel .item',
            callback_reveal  : function (el) {
                var $backgroundImage = jQuery(el),
                    $carouselItems   = $backgroundImage.siblings('.item');

                $carouselItems.each(function (i, carouselItem) {

                    if ('undefined' === typeof jQuery(carouselItem).attr('data-was-processed')) {
                        carouselLazyload.load(carouselItem);
                    }

                });
            }
        });
    }

}(jQuery, window));
