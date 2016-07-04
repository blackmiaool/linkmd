let ajaxUrl = "http://localhost";
let ua = UATest(navigator.userAgent);
let testArticleData = {
    root: `# root
[google](http://www.google.com)
### test1:
<pad padid="test1"></pad>


### test2:
<pad padid="test2"></pad>`,
    test1: `## test1's title
#### test1's content
<pad padid="test2"/>
<pad padid="test2"/>
`,
    test2: `## test2's title
#### test2 content
`
};
let idMap = {};
let reactTags = ["pad"];


function parseURL(url) {
    let a = document.createElement('a');
    a.href = url;
    let ret = {
        source: url,
        protocol: a.protocol.replace(':', ''),
        host: a.hostname,
        port: a.port,
        query: a.search,
        params: (function () {
            let ret = {},
                seg = a.search.replace(/^\?/, '').split('&'),
                len = seg.length,
                i = 0,
                s;
            for (; i < len; i++) {
                if (!seg[i]) {
                    continue;
                }
                s = seg[i].split('=');
                ret[s[0]] = s[1];
            }
            return ret;
        })(),
        file: (a.pathname.match(/\/([^\/?#]+)$/i) || [, ''])[1],
        hash: a.hash.replace('#', ''),
        path: a.pathname.replace(/^([^\/])/, '/$1'),
        relative: (a.href.match(/tps?:\/\/[^\/]+(.+)/) || [, ''])[1],
        segments: a.pathname.replace(/^\//, '').split('/')
    };
    ret.params.page = ret.segments[ret.segments.length - 1].toLowerCase();
    return ret;
}

function markedInit() {

    let renderer = new marked.Renderer();
    //    renderer.code=function(code,language){
    //        console.log(1,code,language);
    //    }
    marked.setOptions({
        renderer,
    })
}

function UATest(uaText) {
    let android = Boolean(uaText.match(/Android/));
    let iOS = Boolean(uaText.match(/(iPad|iPhone|iPod)\s+OS\s([\d_\.]+)/));
    let pc = !(android || iOS);
    return {
        android,
        iOS,
        pc,
    };
}
function maskInit(){
    let $mask = $("#wrap>.mask");
    $mask.find(">.bg").on("tap",function(){
        console.log(123);
        $mask.removeClass("active");
    })
}
function jqInit() {
    if (ua.pc) {
        var on = $.fn.on;
        var off = $.fn.off;
        $.fn.on = function (event) {
            var args = arguments;
            if (event == "tap" || typeof args[2] == "function" && args[1] == "tap") {
                args[0] = "click";
            }
            return on.apply(this, args);
        }
        $.fn.off = function (event) {
            var args = arguments;
            if (event == "tap") {
                args[0] = "click";
            }
            return off.apply(this, args);
        }
    }else{
        (function($){

    var THRESHOLD_DBL = 500;
    var THRESHOLD_LONG = 600;
    var elems = 0,
        clicks = 0,
        last,
        timeout;

    $.event.special.tap = 
    $.event.special.dbltap = 
    $.event.special.longtap = {
        setup: function() {
            if (++elems === 1) {
                $(document).bind('touchstart', touch_start);
                $(document).bind('touchend', touch_end);
            }
        },
        teardown: function() {
            if (--elems === 0) {
                $(document).unbind('touchstart', touch_end);
                $(document).bind('touchend', touch_end);
            }
        }
    };
    
    var touch_start = function(ev) {
        last = ev;
        timeout = setTimeout(function() {
            clicks = 0;
            touch_move();
            $(ev.target).trigger('longtap');
        }, THRESHOLD_LONG);
        $(document).one('touchmove', touch_move);
    };

    var touch_end = function(ev) {
        if (last) {
            var elem = $(ev.target);
            if (ev.timeStamp - last.timeStamp > THRESHOLD_DBL) {
                clicks = 0;
            }
            clicks += 1;
            elem.trigger('tap');
            if (clicks == 2) {
                elem.trigger('dbltap');
                clicks = 0;
            }
        }
        touch_move();
    };

    var touch_move = function() {
        last = null;
        $(document).unbind('touchmove', touch_move);
        timeout = clearTimeout(timeout);
    };

})(jQuery);
    }
    

}

function renderArticle($dom, data) {
    $dom.html(marked(data));
    riot.mount($dom[0], "*")
        //    console.log("data", data);
}

function getArticle(id, cb) {
    //     $.post(`${ajaxUrl}/getArticle`,{id},function(){
    //         
    //     })
    setTimeout(function () {
        let data = testArticleData[id];
        idMap[id] = data;
        cb(data);
    }, 500)
}

function edit(id) {
    //    let simplemde = new SimpleMDE({
    //        element: $(".mask>.editor")[0]
    //    });
    let $mask = $("#wrap>.mask");
    console.log($("#wrap>.mask"))
    $mask.addClass("active");
    let $editor = $mask.find(".editor textarea");
    console.log($editor);
    $editor.siblings().remove();
    let simplemde = new SimpleMDE({
        element: $editor[0]
    });
    
    simplemde.value(idMap[id]);
}

function toolCb(toolName, id) {
    console.log(toolName)
    switch (toolName) {
    case "edit":
        edit(id);
        break;
    }
}