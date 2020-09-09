jQuery(document).ready(function () {
    var $       = jQuery,
        $body   = $('body'),
        $window = $(window);

    // We need to append a hash to the checkout frame src to indetify each individual checkout frame
    $('[id^="checkout_frame_"], [id^="checkoutform_frame_"]').each(function(i, el){
        var $checkoutFrame = $(el),
            frameSrc       = $checkoutFrame.attr('src'),
            uniqueId       = 'function' === typeof uniqueString ? uniqueString() : i;

        $checkoutFrame.addClass('js_checkout_' + uniqueId);

        if ('' === frameSrc) {
            var delaySrc = $checkoutFrame.attr('delay-replace-src');

            if ('undefined' !== typeof delaySrc) {
                $checkoutFrame.attr('delay-replace-src', delaySrc + '#' + 'js_checkout_' + uniqueId);
            }
        } else {
            $checkoutFrame.attr('src', frameSrc + '#' + 'js_checkout_' + uniqueId);
        }
    });

    if (typeof window['onMessage_frame'] !== 'function') {
        window['onMessage_frame'] = function (messageEvent) {
            if (typeof (messageEvent.data) !== 'undefined' && messageEvent.data["func"] === 'close') {
                if (messageEvent.data["pop"] === undefined) {
                    jQuery('[id^="checkoutform_"]').hide();
                }
            }

            if (typeof (messageEvent.data) !== 'undefined' && messageEvent.data["redirect"] === 'on') {
                window.parent.location = messageEvent.data["url"];
            }

            if (typeof (messageEvent.data) !== 'undefined' && messageEvent.data["func"] == 'resize') {

                if ('' !== messageEvent.data['unique-id']) {

                    var $checkoutFrame = $('.' + messageEvent.data['unique-id']);

                    if ($checkoutFrame.length) {
                        $checkoutFrame.css('height', messageEvent.data['height'] + 'px');
                        $checkoutFrame.parent().css('height', messageEvent.data['height'] + 'px');
                    }

                }

            }
        }
    }

    if ('undefined' !== typeof Porthole && 'undefined' !== typeof windowProxy) {
        setTimeout(function () {
            windowProxy.addEventListener(window['onMessage_frame']);
        }, 0);
    }

    /**
     * HIDE/SHOW SECTION based on Hide, Delay or Sticky
     */

    // The hide/show functionality based on behavior (subscriptions, tags, lists) has the highest priority.
    // If there is such behavior set by the user on at least one section, then hiddensections.js will be present in the page
    // In this case, we will run all the other hide/show logic (based on delay, sticky, etc) only once the hiddensections.js
    // will finish its query, on 'hidden-query-complete'.
    // If hiddensections.js is not included, we're triggering 'hidden-query-complete' manually

    $.PubSub('hidden-query-complete').subscribe(function() {

        stickyAction();

        $('.content').each(function(index, el) {
            var $self = $(el);

            if (!$self.attr('is-hidden-section')) {

                if ($self.attr('is-delayed-section')) {

                    delayedAction($self);

                } else {
                    $self.show();
                }
            }

        });
    });

    if (!$('script[src$="hiddensections.js"]').length) {
        $.PubSub('hidden-query-complete').publish();
    }

    // STICKY
    function stickyAction() {

        var $stickedMenus = $('.kartra-sticking-topmenu');

        $window.on('scroll', function() {

            $stickedMenus.each(function(index, stickedMenu) {

                var $stickedMenu = $(stickedMenu);

                if (!$stickedMenu.attr('is-hidden-section') && !$stickedMenu.attr('is-delayed-section')) {
                    if ($window.scrollTop() > 300 && !$stickedMenu.hasClass('kartra-floating-topmenu')) {
                        $body.css('top', $stickedMenu.height());
                        $body.css('position', 'relative');
                        $stickedMenu.addClass('kartra-floating-topmenu');
                        $stickedMenu.hide();
                        $stickedMenu.fadeIn();
                    } else if ($window.scrollTop() < 300 && $stickedMenu.hasClass('kartra-floating-topmenu')) {
                        $stickedMenu.removeClass('kartra-floating-topmenu');
                        $body.css('top', 0);
                    }
                }

            });
        });
    }

    // DELAY
    function delayedAction($self) {
        var delay     = parseInt($self.attr('data-delay-duration'), 10)*1000,
            visitedBefore = isFirstVisit();

        var postDelayActions = function($el) {
            $el.addClass('js_delay_loaded');
            $el[0].dispatchEvent(new Event('kartra_show_hidden_asset'));

            $el.find('.js_delayed').each(function(i, el) {
                var $el = jQuery(el);
                try {
                    window['kartra']['pages']['init'][$el.attr('data-delayed-type')]($el);
                } catch(error) { }
            });

            $el.find('*[delay-replace-src]').each(function(i, el) {
                var $el = jQuery(el);
                $el.attr('src', $el.attr('delay-replace-src'));
                $el.attr('delay-replace-src', '');
            });
        };

        if (visitedBefore && $self.attr('data-delay-reocur') === 'first') {
            $self.show();
            $self.removeAttr('is-delayed-section');
            postDelayActions($self);
        } else {
            setTimeout(function () {
                $self.fadeIn(500);
                $self.removeAttr('is-delayed-section');
                postDelayActions($self);
            }, delay);
        }
    }
    // END HIDE/SHOW

    var $mapElements = $('.google-map');

    if ($mapElements.length) {
        $.getScript('https://maps.googleapis.com/maps/api/js?key=AIzaSyDYjdSAABTWrA6WoV9wG_70JpW9tchXFHU', function() {
            $mapElements.each(function(i, el) {

                var $el = $(el),
                    $map = $el.find('#map'),
                    mapElement = $el.find('#map')[0];

                var lat, lng;
                var geocoder = new google.maps.Geocoder();
                geocoder.geocode({'address': $map.attr('location')}, function(result){
                    lat = result[0].geometry.location.lat();
                    lng = result[0].geometry.location.lng();

                    var location = {lat: lat, lng: lng};

                    var map = new google.maps.Map(mapElement, {
                        zoom: 17,
                        center: location
                    });
                    var marker = new google.maps.Marker({
                        position: location,
                        map: map
                    });
                });
            });

        });
    }

    jQuery('.js_payment_method').parent().on('click', function() {
        jQuery(this).find('.js_payment_method')[0].click();
    });

    // Disqus comments
    var $disqus = jQuery('#disqus');

    if ($disqus.length) {
        $disqus.append(decodeURI($disqus.attr('data-code')));
    }

    // Facebook comments
    var $facebook = jQuery('#facebook');

    if ($facebook.length) {
        $facebook.find('.fb-comments').attr('data-href', window.location.href);

        (function(d, s, id) {
            var js, fjs = d.getElementsByTagName(s)[0];
            if (d.getElementById(id)) return;
            js = d.createElement(s); js.id = id;
            js.src = 'https://connect.facebook.net/en_US/sdk.js#xfbml=1&version=v3.3';
            fjs.parentNode.insertBefore(js, fjs);
        }(document, 'script', 'facebook-jssdk'));

    }

    // Social sharing
    jQuery(document).on('click','.facebook_share, .twitter_share, .pinterest_share, .google_share, .linkedin_share', function (e) {
        e.preventDefault();
        var shareType = getShareType(this);
        openSharePopup(shareType);
    });

    function getShareType(elem) {
        return elem.className.split(' ').filter(function(item) {
            return item.indexOf('_share') !== -1;
        })[0];
    }

    function openSharePopup(type) {
        var types = {
                facebook_share: {
                    winHeight: 400,
                    winWidth: 555,
                    link: 'http://www.facebook.com/sharer/sharer.php?u='
                },
                twitter_share: {
                    winHeight: 350,
                    winWidth: 520,
                    link: 'http://twitter.com/intent/tweet?text='
                },
                pinterest_share: {
                    winHeight: 450,
                    winWidth: 770,
                    link: 'http://pinterest.com/pin/create/button?url='
                },
                google_share: {
                    winHeight: 500,
                    winWidth: 400,
                    link: 'https://plus.google.com/share?url='
                },
                linkedin_share: {
                    winHeight: 460,
                    winWidth: 550,
                    link: 'http://www.linkedin.com/shareArticle?mini=true&url='
                }
            },
            social = types[type],
            winTop = (screen.height / 2) - (social.winHeight / 2),
            winLeft = (screen.width / 2) - (social.winWidth / 2);

        window.open(
            social.link+window.location.href,
            'sharer',
            'top=' + winTop + ',left=' + winLeft + ',toolbar=0,status=0,width=' + social.winWidth + ',height=' + social.winHeight
        );
    }

    var setNotificationBarPadding = function() {
        if (jQuery('.js-notification-bar').length > 0) {
            var barHeight = jQuery('.js-notification-bar').height();
            barHeight += parseInt(jQuery('.js-notification-bar').css('padding-top'),10);
            barHeight += parseInt(jQuery('.js-notification-bar').css('padding-bottom'),10);
            jQuery('body').css({'padding-bottom': barHeight+'px'});
        }
    };

    setNotificationBarPadding();

    jQuery(window).resize(function(){
        setTimeout(setNotificationBarPadding, 100);
    });

    jQuery('[data-dismiss="modal"], [data-dismiss="popup-video"]').click(function(event) {
        //perform check on click as opposed to on load, to give frame proxy time to init
        jQuery(this).closest('.modal').find('.kartra_video').each(function(index, el) {
            var frameDOM = jQuery(this).find('iframe')[0];
            var frameWindow = frameDOM.contentWindow? frameDOM.contentWindow : frameDOM.contentDocument.defaultView;
            frameWindow.postMessage({"func":"pause"}, '*');
        });
    });

    jQuery('.dg_optin').on('click', function () {
        if (jQuery('.show_modal_' + jQuery(this).attr('data-optin-pop')).length > 0) window['jquery_'+jQuery(this).attr('data-optin-pop')]('.show_modal_'+jQuery(this).attr('data-optin-pop')).trigger('click');

        if (jQuery('.show_modal_own_' + jQuery(this).attr('data-optin-pop')).length > 0) window['jquery_'+jQuery(this).attr('data-optin-pop')]('.show_modal_own_'+jQuery(this).attr('data-optin-pop')).trigger('click');

    });

    var jQueryvideoWrapper = jQuery('.videoWrapper');

    if (jQueryvideoWrapper.length && jQueryvideoWrapper.find('iframe').attr('src').indexOf('playlist') !== -1) {

        var iframe = jQueryvideoWrapper.find('iframe');
        var src = iframe.attr('src');
        var rindex = src.indexOf('&ratio=');
        var cindex = src.indexOf('&const=');
        var ratio = parseFloat(src.slice(rindex+7, cindex+1));
        var cnst = parseInt(src.slice(cindex+7, src.length));

        jQuery(window).on('resize', function() {
            var hei = jQueryvideoWrapper.width()*ratio + cnst;
            jQueryvideoWrapper.height(hei);
        });
    }

    jQuery(".accordion-indicator-icon-element").on("click",function(){
        jQuery(this).closest(".panel").toggleClass("active-panel");
        jQuery(this).closest(".panel").siblings(".panel").removeClass("active-panel");
    });

    jQuery(".panel-title .panel-title-container > a").on("click",function(){
        jQuery(this).closest(".panel").toggleClass("active-panel");
        jQuery(this).closest(".panel").siblings(".panel").removeClass("active-panel");
    });

    function setSize(){
        jQuery(".row--full-screen,.content--full-screen").each(function(){
            jQuery(this).css({"min-height":window.innerHeight+"px"});
            jQuery(this).css({"height":"auto"});
        });
    }

    setSize();

    jQuery(window).on("resize",setSize);

    var inFrame = (window.self !== window.top && document.referrer.indexOf('kartra') === -1);

    if (inFrame) {
        jQuery('head').append('<base target="_parent">');
    }

    jQuery('.cross_btn > a').on('click', function(){
        jQuery('.content--fixed-bottom').addClass('content--fixed-bottom-hide');
        jQuery('.footer-spacer').remove();
    });

    /**
     * EFFECTS
     */
    // Apply effects on elements with data-effect attribute only when those elements are visible

    var effects = document.querySelectorAll('[data-effect]');

    if (typeof IntersectionObserver != 'undefined' && typeof MutationObserver != 'undefined') {

        observer = new IntersectionObserver(function(entries) {

            function makeVisible(target) {
                jQuery(target).addClass(jQuery(target).attr('data-effect'));
                observer.unobserve(target);
            }

            entries.forEach(function(entry) {
                if (entry.intersectionRatio > 0.5) {

                    // normally, if the element is loaded, it is made visible when it was scrolled more than half (hence 0.5)
                    // but for images, they are made visible only once the lazyload library has loaded the images

                    if (entry.target.tagName === 'IMG') {
                        if (entry.target.getAttribute('src') === entry.target.getAttribute('data-original')) {
                            makeVisible(entry.target);
                        } else {
                            var mutationObserver = new MutationObserver(function(mutations) {
                                mutations.forEach(function(mutation) {
                                    if (mutation.attributeName === 'src') {
                                        makeVisible(entry.target);
                                        mutationObserver.disconnect();
                                    }
                                });
                            });

                            mutationObserver.observe(entry.target, {attributes: true, childList: false, characterData: false });
                        }
                    } else {
                        makeVisible(entry.target);
                    }


                }
            });
        }, {
            threshold: [0, 0.25, 0.5, 0.75, 1.0]
        });

        effects.forEach(function (el) {
            observer.observe(el);
        });

    } else {
        for (var i = 0, len = effects.length; i < len; i++) {
            effects[i].style.visibility = 'visible';
        }
    }
    //END EFFECTS

});

jQuery(window).on('load', function () {

    isPageFullyLoaded = true;

    var visitedBefore = isFirstVisit();

    jQuery('[data-screenshot="true"]').each(function(index, el) {
        var height =  jQuery('iframe', this).height();
        var width =  jQuery('iframe', this).width();
        var src = jQuery(this).attr('data-thumbnail');
        jQuery(this).html('<div class="kartra_video"><img src="'+src+'" width="'+width+'" height="'+height+'"></div>');
    });

    jQuery('a').click(function(event) {
        if (jQuery(this).hasClass('toggle_optin') || jQuery(this).hasClass('toggle_contentbox')) {
            var popup = jQuery(this).attr('id');
            jQuery('[data-button="'+popup+'"]').modal('show');
            jQuery('.modal-backdrop').addClass('popup-modal');
        }
    });

    Cookies.set(cookieLocation, true, { expires: 30 });

    if (jQuery('#popup_landing').length > 0) {
        var shouldShowLandingPopup = jQuery('#popup_landing').attr('data-reocur') === 'every' || visitedBefore !== true;
        if (shouldShowLandingPopup) {
            var delay = parseInt(jQuery('#popup_landing').attr('data-delay'))*1000;
            setTimeout(function(){
                jQuery('#popup_landing').modal('show');
                jQuery('.modal-backdrop').addClass('popup-modal');
            }, delay);
        }
    }

    if (jQuery('#popup_exit').length > 0) {
        var shouldShowExitPopup = jQuery('#popup_exit').attr('data-reocur') === 'every' || visitedBefore !== true;
        if (shouldShowExitPopup) {
            if (jQuery('#popup_exit').attr('data-trigger') === 'close') {
                window.onbeforeunload = function () {
                    jQuery('#popup_landing').modal('hide')
                    jQuery('#popup_exit').modal('show');
                    jQuery('.modal-backdrop').addClass('popup-modal');
                    window.onbeforeunload = null;
                    return false;
                }
            } else {
                var addEvent = function(obj, evt, fn) {
                    if (obj.addEventListener) {
                        obj.addEventListener(evt, fn, false);
                    }
                    else if (obj.attachEvent) {
                        obj.attachEvent("on" + evt, fn);
                    }
                };

                var popupShown = false;

                addEvent(document, "mouseout", function(e) {
                    e = e ? e : window.event;

                    if (e.target.tagName.toLowerCase() == "input") {
                        return;
                    }

                    var viewportWidth = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);

                    if (e.clientX >= (viewportWidth - 50)) {
                        return;
                    }

                    if (e.clientY >= 50) {
                        return;
                    }

                    var from = e.relatedTarget || e.toElement;

                    if (!from) {
                        showModal();
                    }
                });

                var showModal = function () {
                    if (popupShown === false) {
                        jQuery('#popup_landing').modal('hide');
                        jQuery('#popup_exit').modal('show');
                        jQuery('.modal-backdrop').addClass('popup-modal');
                        popupShown = true;
                    }
                }
            }
        }
    }

    jQuery('body').on('show.bs.modal', function(event) {
        if (jQuery(event.target).attr('data-autoplay-triggered') !== 'true') {
            jQuery(event.target).attr('data-autoplay-triggered', 'true');
            jQuery(event.target).find('iframe').each(function(index, frame) {
                if (jQuery(frame).attr('src').indexOf('autop') > -1) {
                    var src = jQuery(frame).attr('src');
                    src = src.replace(/autoplay=false&amp;/g, "");
                    src = src.replace(/autoplaceholder/g, "autoplay");
                    src = src.replace(/noautoplay/g, "autoplay");
                    jQuery(frame).attr('src', src);
                }
            });
        }
    });

    jQuery('.toggle_video').on('click', function () {
        var video = jQuery(this).attr('data-video');
        if (jQuery(this).attr('data-video-external') !== 'true') {
            if(jQuery('.hidden_video_holder_' + video).find('#preview_video_button').length){
                jQuery('.hidden_video_holder_' + video).find('#preview_video_button').trigger('click');
            }else{
                jQuery('.popup_trigger_' + video).trigger('click');
            }
        } else {
            var $frame = false;

            var setVideoHeight = function() {
                if (!$frame) {
                    return false;
                }

                var height = $frame.width()*0.5625;

                $frame.css('height', height+'px');
                $frame[0].contentWindow.postMessage({'func':'getSize'}, '*');
            };

            jQuery('.popup_video_'+video).first().modal('show').off('hide.bs.modal').on('hide.bs.modal', function () {
                jQuery(this).find('iframe')[0].contentWindow.postMessage({"func":"pause"}, '*');
                jQuery(window).off('resize', setVideoHeight);
            }).off('shown.bs.modal').on('shown.bs.modal', function () {
                $frame = jQuery(this).find('iframe');
                setVideoHeight();
                jQuery(window).on('resize', setVideoHeight);
                jQuery('.modal-backdrop').css('opacity', 0.7);
                jQuery('.modal-backdrop:not(.popup-modal)').css('z-index', 1052);
                jQuery(this).css('z-index', 1053);
            });
        }
    });

    jQuery('[data-dismiss="popup-video"]').click(function(event) {
        jQuery(this).parents('.popup-video').modal('hide');
    });

    jQuery('.toggle_playlist').on('click', function() {
        var video = jQuery(this).attr('data-video');

        if (jQuery('.hidden_video_holder_' + video).find('#preview_playlist_button').length){
            window['kartra_jquery_'+video]('.hidden_video_holder_' + video).find('#preview_playlist_button').trigger('click');
        } else {
            window['kartra_jquery_'+video]('.popup_trigger_' + video).trigger('click');
        }
    });
});

