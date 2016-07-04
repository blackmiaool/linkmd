<pad>
    <div name="hovering-tools" class="hovering-tools">
        <span data-tool="edit" class="glyphicon glyphicon-edit"></span>
    </div>
    <article name="article-wrap"></article>
    <script>
        (function () {
            let $article = $(this["article-wrap"]);
            let $tools = $(this["hovering-tools"]);
            $tools.on("click",'span', function () {
                let toolName=$(this).data("tool");                
                toolCb(toolName,opts.padid);
            })
            getArticle(opts.padid, (data) => {
                renderArticle($article, data);
                let $pad = $article.parent("pad");
                $article.on("taphold", function (e) {
                    alert("long");
                })
                $article.on("longtap", function (e) {
                    alert("long2");
                })
                $article.on("mouseover", function (e) {
                    let $target = $(e.target);
                    //                    console.log($article[0],e.target,$article[0]==e.target,e.target.tagName);
                    if ($article[0] == e.target || $article[0] == $target.parent("article")[0]) {
                        $("pad").removeClass("hovering");
                        $pad.addClass("hovering");

                    } else {
                        $pad.removeClass("hovering");
                        $target.parent("pad").addClass("hovering");
                    }
                })
                $tools.on("mouseleave", function (e) {
                        $pad.removeClass("hovering");
                    })
                    //                $article.on("mouseleave",function(e){
                    //                    $pad.removeClass("hovering");
                    //                })
            });
        }).bind(this)()
    </script>

    <style scoped>

    </style>
</pad>