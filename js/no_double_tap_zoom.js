(function($){
    $.fn.nodoubletapzoom = function(){
        $(this).bind('touchend', function preventZoom(e){
            var now = new Date().getTime();
            var lastTouch = $(this).data('lastTouch') || now + 1;
            var delta = now - lastTouch;

            if(delta<500 && delta>0){
                e.preventDefault();
                $(this).trigger('click').trigger('click');
                }
            $(this).data('lastTouch', now);
        });
    };
})(jQuery);