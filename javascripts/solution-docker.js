/*
    Used by the Docker solution. In particular manages the show/hide of the extra Docker image information.
 */
$(function() {
    
    $("input[type='text']").click(function () {
        $(this).select();
    });
    
    $("div.more-info-link").click(function(e) {
        $("div.more-info[name=" + $(this).attr('name') + "]").toggle().removeAttr('hidden').fadeToggle(300);
        e.preventDefault();
        e.stopPropagation();
        return false;
    });
});
