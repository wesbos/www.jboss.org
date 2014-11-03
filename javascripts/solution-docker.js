app.solutions.docker = {
    
};

// Event Listeners
$(function() {
    
    console.log('working');
    
    $("input[type='text']").click(function () {
        $(this).select();
    });
    
    $("div.more-info-link").click(function(e) {
        $("div.more-info[name=" + $(this).attr('name') + "]").fadeToggle(300);
        e.preventDefault();
        e.stopPropagation();
        return false;
    });
});