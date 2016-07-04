"use strict";

var ajaxUrl = "http://localhost";
var ua = UATest(navigator.userAgent);
var testArticleData = {
    root: "# root\n[google](http://www.google.com)\n### test1:\n<pad padid=\"test1\"></pad>\n\n\n### test2:\n<pad padid=\"test2\"></pad>",
    test1: "## test1's title\n#### test1's content\n<pad padid=\"test2\"/>\n<pad padid=\"test2\"/>\n",
    test2: "## test2's title\n#### test2 content\n"
};
var idMap = {};
var reactTags = ["pad"];

function parseURL(url) {
    var a = document.createElement('a');
    a.href = url;
    var ret = {
        source: url,
        protocol: a.protocol.replace(':', ''),
        host: a.hostname,
        port: a.port,
        query: a.search,
        params: function () {
            var ret = {},
                seg = a.search.replace(/^\?/, '').split('&'),
                len = seg.length,
                i = 0,
                s = void 0;
            for (; i < len; i++) {
                if (!seg[i]) {
                    continue;
                }
                s = seg[i].split('=');
                ret[s[0]] = s[1];
            }
            return ret;
        }(),
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

    var renderer = new marked.Renderer();
    //    renderer.code=function(code,language){
    //        console.log(1,code,language);
    //    }
    marked.setOptions({
        renderer: renderer
    });
}

function UATest(uaText) {
    var android = Boolean(uaText.match(/Android/));
    var iOS = Boolean(uaText.match(/(iPad|iPhone|iPod)\s+OS\s([\d_\.]+)/));
    var pc = !(android || iOS);
    return {
        android: android,
        iOS: iOS,
        pc: pc
    };
}
function maskInit() {
    var $mask = $("#wrap>.mask");
    $mask.find(">.bg").on("tap", function () {
        console.log(123);
        $mask.removeClass("active");
    });
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
        };
        $.fn.off = function (event) {
            var args = arguments;
            if (event == "tap") {
                args[0] = "click";
            }
            return off.apply(this, args);
        };
    } else {
        (function ($) {

            var THRESHOLD_DBL = 500;
            var THRESHOLD_LONG = 600;
            var elems = 0,
                clicks = 0,
                last,
                timeout;

            $.event.special.tap = $.event.special.dbltap = $.event.special.longtap = {
                setup: function setup() {
                    if (++elems === 1) {
                        $(document).bind('touchstart', touch_start);
                        $(document).bind('touchend', touch_end);
                    }
                },
                teardown: function teardown() {
                    if (--elems === 0) {
                        $(document).unbind('touchstart', touch_end);
                        $(document).bind('touchend', touch_end);
                    }
                }
            };

            var touch_start = function touch_start(ev) {
                last = ev;
                timeout = setTimeout(function () {
                    clicks = 0;
                    touch_move();
                    $(ev.target).trigger('longtap');
                }, THRESHOLD_LONG);
                $(document).one('touchmove', touch_move);
            };

            var touch_end = function touch_end(ev) {
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

            var touch_move = function touch_move() {
                last = null;
                $(document).unbind('touchmove', touch_move);
                timeout = clearTimeout(timeout);
            };
        })(jQuery);
    }
}

function renderArticle($dom, data) {
    $dom.html(marked(data));
    riot.mount($dom[0], "*");
    //    console.log("data", data);
}

function getArticle(id, cb) {
    //     $.post(`${ajaxUrl}/getArticle`,{id},function(){
    //        
    //     })
    setTimeout(function () {
        var data = testArticleData[id];
        idMap[id] = data;
        cb(data);
    }, 500);
}

function edit(id) {
    //    let simplemde = new SimpleMDE({
    //        element: $(".mask>.editor")[0]
    //    });
    var $mask = $("#wrap>.mask");
    console.log($("#wrap>.mask"));
    $mask.addClass("active");
    var $editor = $mask.find(".editor textarea");
    console.log($editor);
    $editor.siblings().remove();
    var simplemde = new SimpleMDE({
        element: $editor[0]
    });

    simplemde.value(idMap[id]);
}

function toolCb(toolName, id) {
    console.log(toolName);
    switch (toolName) {
        case "edit":
            edit(id);
            break;
    }
}