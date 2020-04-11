// 工作目录
var winSWF = fl.configURI + "WindowSWF/";
var winSWFJSFL = winSWF + "flash工具箱/";

// 复制文档结构
function copyStructure(){
    //打开的文档
    var sdoc = fl.getDocumentDOM();
    if (!sdoc) {
    alert("请打开fla文档");
    return;
    }

    // var tl = sdoc.getTimeline();
    //tl.setSelection
    if(sdoc != undefined){
        var ndoc = fl.createDocument("timeline");
        if(ndoc == undefined){
            alert("文件创建失败!");
        }else{
            ndoc.width = sdoc.width;
            ndoc.height = sdoc.height;
            ndoc.backgroundColor = sdoc.backgroundColor;
            ndoc.frameRate = sdoc.frameRate;
            ndoc.asVersion = sdoc.asVersion;
            ndoc.autoLabel = sdoc.autoLabel;
            ndoc.description = sdoc.description;
            ndoc.zoomFactor = 1;
        }
    }
}

