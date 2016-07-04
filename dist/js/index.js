"use strict";

(function () {
    var args = parseURL(location.href);
    var padid = args.padid || "root";
    jqInit();
    maskInit();
    markedInit();
    getArticle(padid, function (data) {
        renderArticle($("article"), data);
    });
})();