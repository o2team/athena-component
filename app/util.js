var _POP_ = {
    toast: function(text) {
        if(!text) return;
        var rid = 'toast_' + new Date().getTime();
        var div = document.createElement('div');
        div.innerHTML = '<div id="'+rid+'" style="z-index:4;position:fixed;top:0;left:0;display:block;width:100%;height:100%; text-align:center;font-size:0;">'+
                            '<div style="display:inline-block;*display:inline;*zoom:1;vertical-align:middle;font-size:16px;">'+
                                '<div style="padding:30px 40px;min-width: 200px;_width: 200px;background:rgba(0,0,0,0.8);border-radius:5px;">'+
                                    '<div style="font-size:18px;color:#fff;">'+text+'</div>'+
                                '</div>'+
                            '</div>'+
                            '<span style="display:inline-block;*display:inline;*zoom:1;width:0;height:100%;vertical-align:middle;"></span>'+
                        '</div>';
        document.body.appendChild( div.childNodes[0] );

        var dom = document.getElementById(rid);
        var timer = setTimeout(function() {
            dom.parentNode.removeChild(dom);
        },1500);
        dom.addEventListener('click', function() {
            clearTimeout(timer);
            dom.parentNode.removeChild(dom);
        });
    }
}