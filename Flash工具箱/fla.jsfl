
// 脚本有三种使用方式
// fla2swf() 批量将 fla 导出 swf
// fla2swfByFolder()  批量将 fla 导出 swf 选择文件夹
// fla2png() 批量将 fla 导出 png

/**************************
批量导出 swf
功能：
	将1个或多个fla，执行导出swf操作

说明：
	当缺少字体时脚本会暂停住，为了保证执行效率可以取消缺少字体提示，具体方法是：
		【编辑】--【首选参数】--[文本]--取消[为缺少字体显示]左边的勾选框
*/


/**********************************
批量将fla导出成png
作用：
1.将fla的每个场景导出成png，png尺寸同舞台大小；
2.可设置是否处理子文件夹内的fla文件；
*/


function fla2swf() {
  var choose = confirm("是否批量导出swf？");
  if (!choose) return;

  var uri = getWorkFolder()+"fla2swf.txt";
  var url = FLfile.uriToPlatformPath(uri);
  var isExist = FLfile.exists(uri);
  if (!isExist) {
    alert(
      "请先配置一个或多个 fla 路径!!!\n*稍后将创建txt文件，\n*请将fla的路径地址粘贴到txt中，一行代表一个文件！\n*填写完后请手动保存 并关闭txt，并重新执行本操作！"
    );
    var result = FLfile.write(uri, "");
    if (!result) {
      alert("txt 文件创建失败！！！");
      return;
    }
    fl.openScript(uri);

    return;
  }

  // 读取 txt 文件
  var txtArr = readTxt2Arr(url);

  // 转移 txt 文件
  if (FLfile.exists(uri)) {
    var nuri = uri.substr(0, uri.length - 4) + "-" + getMDHMS() + ".txt";
    FLfile.copy(uri, nuri);

    if (FLfile.exists(uri)) FLfile.remove(uri);
  }

  // 提示文字
  var sStr = "执行任务清单 " + url;
  if (txtArr.length == 0) sStr += "\n清单共有 " + txtArr.length + " 条任务 ";
  else sStr += "\n清单中没有任务";
  fl.trace(sStr);

  // 执行操作
  for (var i = 0; i < txtArr.length; i++) {
    exportSWF(txtArr[i]);
  }
}

// 批量导出 swf 选择一个文件夹
function fla2swfByFolder(){
  var folderURI = fl.browseForFolderURL("选择包含fla的文件夹");
    if(!folderURI) return;

    if (!FLfile.exists(folderURI))
    {
        fl.trace("找不到 "+FLfile.uriToPlatformPath(folderURI));
        return;
    }

    var list = FLfile.listFolder(folderURI + "/*.fla", "files");
    for(var i in list)
    {
        var uri = folderURI + "/"+list[i];
        var url = FLfile.uriToPlatformPath(uri);
        var doc = fl.openDocument(uri);
        if( !doc )
        {
            fl.trace("打不开 "+url);
            continue;
        }

        fl.trace("正导出 "+url);
        doc.exportSWF(replaceFlaToSwf(uri), true);
        doc.close();
    }
}



function fla2png() {
  var choose = confirm("是否批量导出png？");
  if (!choose) return;

  var uri = getWorkFolder()+"fla2png.txt";
  var url = FLfile.uriToPlatformPath(uri);
  fl.trace(uri);

  var isExist = FLfile.exists(uri);
  if (!isExist) {
    alert(
      "请先配置一个或多个 fla 路径!!!\n*稍后将创建txt文件，\n*请将fla的路径地址粘贴到txt中，一行代表一个文件！\n*填写完后请手动保存 并关闭txt，并重新执行本操作！"
    );
    var result = FLfile.write(uri, "");
    if (!result) {
      alert("txt 文件创建失败！！！");
      return;
    }
    fl.openScript(uri);

    return;
  }

  // 读取 txt 文件
  var txtArr = readTxt2Arr(url);

  // 转移 txt 文件
  if (FLfile.exists(uri)) {
    var nuri = uri.substr(0, uri.length - 4) + "-" + getMDHMS() + ".txt";
    FLfile.copy(uri, nuri);

    if (FLfile.exists(uri)) FLfile.remove(uri);
  }

  // 提示文字
  var sStr = "执行任务清单 " + url;
  if (txtArr.length == 0) sStr += "\n清单共有 " + txtArr.length + " 条任务 ";
  else sStr += "\n清单中没有任务";
  fl.trace(sStr);

  // 执行操作
  for (var i = 0; i < txtArr.length; i++) {
    exportPNG(txtArr[i]);
  }
}


// 批量导出 png 选择一个文件夹
function fla2pngByFolder(){
  var folderURI = fl.browseForFolderURL("选择包含fla的文件夹");
    if(!folderURI) return;

    if (!FLfile.exists(folderURI))
    {
        fl.trace("找不到 "+FLfile.uriToPlatformPath(folderURI));
        return;
    }

    var list = FLfile.listFolder(folderURI + "/*.fla", "files");
    for(var i in list)
    {
        var uri = folderURI + "/"+list[i];
        var url = FLfile.uriToPlatformPath(uri);
        exportPNG(url);
    }
}




function exportSWF(url) {
  var uri = FLfile.platformPathToURI(url);
  if (!FLfile.exists(uri)) {
    fl.trace("找不到 " + url);
    return;
  }

  var doc = fl.openDocument(uri);
  if (!doc) {
    fl.trace("打开文件失败 " + url);
    return;
  }

  fl.trace("正在导出：" + url);
  var swfURL = replaceFlaToSwf(getFile(url));
  var swfURI = FLfile.platformPathToURI(swfURL);
  doc.exportSWF(swfURI, true);
  doc.close();
}

function exportPNG(url) {
  var uri = FLfile.platformPathToURI(url);
  if (!FLfile.exists(uri)) {
    fl.trace("找不到 " + url);
    return;
  }

  var doc = fl.openDocument(uri);
  if (!doc) {
    fl.trace("打开文件失败 " + url);
    return;
  }

  fl.trace("正在导出：" + url);
  var prefix = uri.substr(0, uri.lastIndexOf(".fla"));
  var len = doc.timelines.length;
  for (i = 0; i < len; i++) {
    doc.editScene(i);
    doc.exportPNG(prefix + "_sc" + i + ".png", false, true);
  }
  doc.close(false);
}

// 获得 jsfl 工作路径
function getWorkFolder(){
  // 工作目录
  var winSWF = fl.configURI + "WindowSWF/";
  var winSWFJSFL = winSWF + "Flash工具箱/";

  return winSWFJSFL;
  // var tStr = FLfile.platformPathToURI("/Users/");
  // if (FLfile.exists(tStr)) url = "/Users/qinbaomac-mini/Desktop/JSFL/1/1png.txt";
  // else url = "E:\\Desktop\\flash工具箱\\1png.txt";
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

function getMDHMS() {
  var today = new Date();
  var y = checkTime(today.getFullYear());
  var m = checkTime(today.getMonth() + 1);
  var d = checkTime(today.getDate());
  var h = checkTime(today.getHours());
  var min = checkTime(today.getMinutes());
  var s = checkTime(today.getSeconds());
  return m + d + h + min + s;
}

function checkTime(i) {
  if (i < 10) i = "0" + i;
  return i.toString();
}



//获得文件名
function batToDo(folder) {
  //获得当前目录下的文件地址
  var arr = FLfile.listFolder(folder + "/*.fla", "files");
  for (i = 0; i < arr.length; i++) {
    folderContents.push(folder + "/" + arr[i]);
  }

  //处理子文件夹
  if (isIncludeSub) {
    var directorys = FLfile.listFolder(folder, "directories");
    for (i = 0; i < directorys.length; i++) {
      batToDo(folder + "/" + directorys[i]);
    }
  }
}

//"E:\xx\xx.fla" 转成 "file:///E|/xx/xx.fla";
function filePathToURI(url) {
  var str = url.charAt(0); //获得盘符
  var str2 = "file:///" + str;
  str2 += "|";

  url = url.substr(2); //删除前3个字符
  url = str2 + url;

  //将所有的"\"替换成"/"
  var reg = /\\/g;
  url = url.replace(reg, "/");
  return url;
}
