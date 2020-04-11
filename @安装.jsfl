// 安装脚本


// 当前目录
var curDir = getFolder(fl.scriptURI);
var curDirJSFL = curDir + "Flash工具箱/";

// 工作目录
var winSWF = fl.configURI + "WindowSWF/";
var winSWFJSFL = winSWF + "Flash工具箱/";

// 拷贝到工作目录
var swfName = "Flash工具箱.swf";
var arr = [
	"2png.jsfl",
    "lib.jsfl",
	"layer.jsfl",
    "fla.jsfl",
    "doc.jsfl",
	"timeline.jsfl",
	
	"util.jsfl"	//工具类
];


fl.trace("========== Flash工具箱 ==========");
var curURI = curDir + swfName;
var winURI = winSWF + swfName;
var isExists = FLfile.exists(curURI);
var lackSWF = "";
if (isExists) {
    if (FLfile.exists(winURI))	FLfile.remove(winURI);
    FLfile.copy(curURI, winURI);
    fl.trace("拷贝 ./" + swfName);
} else{
	lackSWF = swfName;
}

//if( FLfile.exists(winSWFJSFL) )	FLfile.remove(winSWFJSFL)
FLfile.createFolder(winSWFJSFL);
var lackJSFL = "";
for (var i = 0; i < arr.length; i++) {
    curURI = curDirJSFL + arr[i];
    winURI = winSWFJSFL + arr[i];
    var isExists = FLfile.exists(curURI);
    if (isExists) {
		if( FLfile.exists(winURI) )	FLfile.remove(winURI);
        FLfile.copy(curURI, winURI);
        fl.trace("拷贝 ./Flash工具箱/" + arr[i]);
    } else{
		lackJSFL += "缺少 ./Flash工具箱/"+arr[i] + "\n";
	}
}
fl.trace("安装完成！安装在：\n" + FLfile.uriToPlatformPath(winSWF));
if( lackSWF )	fl.trace("缺少 "+lackSWF +",安装失败！！！");
if( lackJSFL )	fl.trace("缺少下列文件：\n"+lackJSFL);
fl.trace("=============");

alert("安装完成，请重启 Flash\n工具位于Flash【窗口】-->【其它面板】--[Flash工具箱]");



function getFolder(str)
{
	var index = str.lastIndexOf("/");
	if (index != -1)
		 str = str.substring(0,index+1);
	return str;
}