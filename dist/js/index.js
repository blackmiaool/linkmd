"use strict";

(function () {
    if (!ua.pc) {
        $(document.body).addClass("mobile");
    }
    jqInit();
    linkProxyInit();
    maskInit();
    markedInit();
    editorInit();
    $("#article-wrap>.edit-btn").on("tap", function () {
        toolCb("edit", padid);
    });

    function initRoute() {
        setTimeout(function () {
            window.addEventListener("popstate", articleInit);
            articleInit();
        });
    }
    initRoute();
})();