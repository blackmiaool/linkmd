(function(){    
    let args=parseURL(location.href);
    let padid=args.padid||"root";
    jqInit();
    maskInit();
    markedInit();
    getArticle(padid,(data)=>{renderArticle($("article"),data)});
})()