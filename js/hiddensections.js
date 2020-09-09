jQuery(function(){

    var $ = jQuery;

    var hideSections = document.querySelectorAll('[data-hide]');

    var lists = {};
    var sequences = {};
    var tags = {};

    var data = {
        days: '0',
        hours: '0',
        seconds: '0',
        minutes: '0'
    };

    for ( x = 0; x < hideSections.length; x++ ) {
        var type = hideSections[x].getAttribute('data-hide');

        if (type === 'list' || type === 'not-list') {
            lists[hideSections[x].getAttribute('data-list-id')] = data;
        } else if (type === 'sequence' || type === 'not-sequence') {
            sequences[hideSections[x].getAttribute('data-sequence-id')] = data;
        } else if (type === 'tag' || type === 'not-tag') {
            tags[hideSections[x].getAttribute('data-tag-id')] = data;
        }
    }

    if (hideSections.length) {

        var resources = {
            lists: lists,
            tags: tags,
            sequences: sequences
        };

        $.ajax({
            type: 'post',
            url: secure_base_url+'front/email_countdown/ajax_countdown_data',
            xhrFields: {
                withCredentials: true
            },
            data: {pageHashedId: global_id, resources: resources},
        }).done(function (data) {

            var result = {};

            if (data.success === true && data.resources) {
                if (data.resources.based_on_subscribe_list_date) {
                    result.list = data.resources.based_on_subscribe_list_date;
                }
                if (data.resources.based_on_subscribe_tag_date) {
                    result.tag = data.resources.based_on_subscribe_tag_date;
                }
                if (data.resources.based_on_subscribe_sequence_date) {
                    result.sequence = data.resources.based_on_subscribe_sequence_date;
                }
            }

            for ( x = 0; x < hideSections.length; x++ ) {
                var type = hideSections[x].getAttribute('data-hide');
                
                if (type === 'list') {
                    if (result.list && result.list[hideSections[x].getAttribute('data-list-id')]) {
                        $(hideSections[x]).removeAttr('is-hidden-section');
                    }
                } else if (type === 'not-list') {
                    
                    if (!result.list || !result.list[hideSections[x].getAttribute('data-list-id')]) {
                        $(hideSections[x]).removeAttr('is-hidden-section');
                    }
                } else if (type === 'sequence') {
                    if (result.sequence && result.sequence[hideSections[x].getAttribute('data-sequence-id')]) {
                        $(hideSections[x]).removeAttr('is-hidden-section');
                    }
                } else if (type === 'not-sequence') {
                    if (!result.sequence || !result.sequence[hideSections[x].getAttribute('data-sequence-id')]) {
                        $(hideSections[x]).removeAttr('is-hidden-section');
                    }
                } else if (type === 'tag') {
                    if (result.tag && result.tag[hideSections[x].getAttribute('data-tag-id')]) {
                        $(hideSections[x]).removeAttr('is-hidden-section');
                    }
                } else if (type === 'not-tag') {
                    if (!result.tag || !result.tag[hideSections[x].getAttribute('data-tag-id')]) {
                        $(hideSections[x]).removeAttr('is-hidden-section');
                    }
                }
            }

            $.PubSub('hidden-query-complete').publish();
            
        });
        
    }

});