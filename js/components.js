//some JS used by components
$(document).ready(function(){
    $(document).on('show.bs.collapse', '.panel-collapse', function () {
        $(this).siblings('.panel-heading').parent(".panel").addClass('active-panel');
    });

    $(document).on('hide.bs.collapse', '.panel-collapse', function () {
        $(this).siblings('.panel-heading').parent(".panel").removeClass('active-panel');
    });
});