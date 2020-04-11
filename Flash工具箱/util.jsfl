//工具类

function runScript(args){
    fl.trace(args);
}

function getFolder(str) {
    var index = str.lastIndexOf("/");
    if (index != -1) str = str.substring(0, index + 1);
    return str;
}
function getFile(str) {
    var index = str.lastIndexOf("/");
    if (index != -1) str = str.substring(index + 1);
    return str;
}
function replaceFlaToSwf(str) {
    var gStr = str.substr(-4);
    if (gStr == ".fla") str.replace(".fla", ".swf");
    if (gStr == ".FLA") str.replace(".FLA", ".swf");
    return str;
}

var isMac = getOS()=="mac" ? true:false;
function getOS(){
    var tStr = FLfile.platformPathToURI("/Users/");
    if (FLfile.exists(tStr)){
        // fl.trace("isMac")
        return "mac";
    }else{
        // fl.trace("isWindows"replace)
        return "windows";
    }
}

// 工作目录
var winSWF = fl.configURI + "WindowSWF/";
var winSWFJSFL = winSWF + "flash工具箱/";
var folderTxtURI = winSWFJSFL+"folder.txt";
var folderTxtURL = FLfile.uriToPlatformPath(folderTxtURI);

// 创建本地存储文件夹
var localStorage = winSWFJSFL + "local_storage/";
var localStorageURI = FLfile.platformPathToURI(localStorage);
if( !FLfile.exists(localStorageURI) )
    FLfile.createFolder(localStorage);

function changeDefaultFolder(){
    var result = fl.browseForFolderURL("选择默认输出文件夹");
    if( result && result.length>1 ){
        if(isMac)
            result += "/";
        else
            result += "/";
        var url = FLfile.uriToPlatformPath(result);
        var r2 = FLfile.write(folderTxtURI,url);
        if( !r2 )
            fl.trace("！！！写入文件失败 "+  folderTxtURL );
    }
    return getDefaultFolder();
}

function openFolder(folderPath){
    folderPath = FLfile.uriToPlatformPath(folderPath);
    if (isMac)
        pStr = 'open "'+folderPath+'"';
    else
        pStr = 'start explorer "'+folderPath+'"';
    FLfile.runCommandLine(pStr);
}

function getDefaultFolder(){
    if( FLfile.exists(folderTxtURI) )
    {
        var arr = readTxt2Arr(folderTxtURL);
        var url = arr.shift();
        var uri = FLfile.platformPathToURI(url);
        if( FLfile.exists(uri) )
        {
            return uri;
        }
    }


    var nURL = "";
    if( isMac )
        nURL =  "/Users/Shared/JSFL/";
    else
        nURL = "D:\\JSFL\\";
    var nURI = FLfile.platformPathToURI(nURL);
    return nURI;
}


// 获得 txt 里的第一行
function getTxt(txtURI){
    var str = '';
    if( txtURI && FLfile.exists(txtURI) )
    {
        var txtURL = FLfile.uriToPlatformPath(txtURI);
        var arr = readTxt2Arr(txtURL);
        str = arr.shift();
    }
    return str;
}
// 保存内容到 txt 里
function setTxt(str,txtURI){
    var r2 = FLfile.write(txtURI,str);
    if( !r2 )
    {
        var txtURL = FLfile.uriToPlatformPath(txtURI);
        fl.trace("！！！写入文件失败 "+  txtURL );
    }
}

function browseFolder(titleStr){
    return fl.browseForFolderURL(titleStr);
}
// 读取txt,并按行转成数组
function readTxt2Arr(url) {
    var uri = FLfile.platformPathToURI(url);
    var str = FLfile.read(uri);

    var arr = str.replace(/\r\n/g, "\n").split("\n"); //将换行符统一换成 \n,并分割
    var nArr = [];
    for (var i = 0; i < arr.length; i++) {
      str = arr[i];
      str = strip(str, " ");
      str = strip(str, '"');
      if (!str) continue;
      nArr.push(str);
    }

    return nArr;
}

// 删除首尾特定字符
function strip(str, reStr) {
    // str = str.replace(/^\"|\"$/g,'')		// 去除首尾空格
    // str = str.replace(/(^\s*)|(\s*$)/g,'')	// 去除首尾双引号
    var sIndex = str.substr(0, 1) == reStr ? 1 : 0;
    var eIndex = str.substr(-1, 1) == reStr ? str.length - 1 : str.length;

    return str.substring(sIndex, eIndex);
}