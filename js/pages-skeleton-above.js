
// Timing & scrolling analytics

var isPageFullyLoaded = false,
    maxScroll         = document.documentElement.scrollTop + document.documentElement.clientHeight,
    previousTime      = 0,
    unique_string     = uniqueString(),
    deviceType;

var cookieLocation = 'kartrapage_popwindow' + window.location.pathname;

var isFirstVisit = function() {
    if ('undefined' === typeof window['kartraPageVisited']) {
        window['kartraPageVisited'] = Cookies.get(cookieLocation) !== undefined;
    }

    return window['kartraPageVisited'];
};

TimeMe.initialize();

if (document.documentElement.clientWidth < 767) {
    deviceType = 'mobile';
} else if (document.documentElement.clientWidth < 1024) {
    deviceType = 'tablet';
} else {
    deviceType = 'desktop';
}

jQuery(window).on('scroll', function() {
    var currentScroll = document.documentElement.scrollTop + document.documentElement.clientHeight;

    if (currentScroll > maxScroll) {
        maxScroll = currentScroll;
    }
});

data = {
    'unique_string'    : unique_string,
    'time_on_page'     : 0,
    'page_fully_loaded': isPageFullyLoaded,
    'user_max_scroll'  : maxScroll,
    'user_page_height' : document.documentElement.scrollHeight,
    'location'         : window.location.protocol + '//' + window.location.hostname,
    'device_type'      : deviceType
};

if (window.global_id) {
    visitRequest(data);
}

setInterval(function() {

    var timeSpentOnPage = TimeMe.getTimeOnCurrentPageInSeconds();

    if ((timeSpentOnPage - previousTime) > 9.9) {

        var data = {
            'unique_string': unique_string,
            'time_on_page': Math.round(timeSpentOnPage),
            'page_fully_loaded': isPageFullyLoaded,
            'user_max_scroll': Math.min(maxScroll, document.documentElement.scrollHeight),
            'user_page_height': document.documentElement.scrollHeight,
            'device_type' : deviceType,
            'location': window.location.protocol + '//' + window.location.hostname,
        };

        if (window.global_id) {
            visitRequest(data);
        }

        previousTime = timeSpentOnPage;
    }

}, 1000);

// END Timing & scrolling analytics

var onMessageExternalVideo = function(messageEvent) {
    if (typeof(messageEvent.data) !== 'undefined' && messageEvent.data['func'] == 'resizeVideo') {
        var height = messageEvent.data['height'],
            sourceFrame = null,
            videoFrames = jQuery('.popup-video iframe'),
            eventSource = event.source,
            eventOrigin = event.origin;

        // detect the source for IFRAMEs with same-origin URL
        for (var i = 0; i < videoFrames.length; i++) {
            var frame = videoFrames[i];

            if (frame.contentWindow === eventSource || // for absolute URLs
                frame.contentWindow === eventSource.parent) { // for relative URLs
                sourceFrame = frame;
                break;
            }
        }

        // detect the source for IFRAMEs with cross-origin URL (because accessing/comparing event.source properties is not allowed for cross-origin URL)
        if (sourceFrame === null) {
            for (var j = 0; j < videoFrames.length; j++) {
                if (videoFrames[j].src.indexOf(eventOrigin) === 0) {
                    sourceFrame = videoFrames[j];
                    break;
                }
            }
        }

        if (sourceFrame !== null) {
            jQuery(sourceFrame).css('height', height + 'px');
        }
    }
};

window.addEventListener('message', onMessageExternalVideo);

// A trivial pubsub
var topics = {};

jQuery.PubSub = function( id ) {
    var callbacks,
        topic = id && topics[ id ];
    if ( !topic ) {
        callbacks = jQuery.Callbacks();
        topic = {
            publish: callbacks.fire,
            subscribe: callbacks.add,
            unsubscribe: callbacks.remove
        };
        if ( id ) {
            topics[ id ] = topic;
        }
    }
    return topic;
};

// "new Event()" polyfill for IE
(function () {
    if ( typeof window.CustomEvent === "function" ) return false; //If not IE
    function CustomEvent ( event, params ) {
        params = params || { bubbles: false, cancelable: false, detail: undefined };
        var evt = document.createEvent( 'CustomEvent' );
        evt.initCustomEvent( event, params.bubbles, params.cancelable, params.detail );
        return evt;
    }
    CustomEvent.prototype = window.Event.prototype;
    window.Event = CustomEvent;
})();

function uniqueString() {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (var i = 0; i < 10; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }

    text = new Date().getTime() + '_' + text;

    return text;
}

function visitRequest(data) {
    jQuery.ajax({
        type: 'POST',
        url: window.secure_base_url + 'analytics/visitorTime/' + window.global_id,
        data: data,
        xhrFields: {
            withCredentials: true
        }
    });
}
