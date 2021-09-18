

// 重置导出设置
function showExportPng(fURL) {
  //交互提示
  var boo = confirm('导出功能修正\n将弹出"Flash导出png"对话框，请做如下调整: \n\t分辨率(R):  72 dpi \n\t包含(I):  完整文档大小 \n\t颜色(C):  32位 \n\t勾选 平滑(S)');
  if (!boo)
    return;

  var folder = fURL;
  FLfile.createFolder(folder);

  var doc = fl.createDocument();
  doc.width = 100;
  doc.height = 100;
  doc.backgroundColor="#000000";

  var pngName = folder + "0_0.png";
  doc.exportPNG(pngName, false, false);
  doc.close(false);
}

//导出当前画面 v1.1
function view2png(fURL) {
  var folder = fURL;
  FLfile.createFolder(folder);

  //打开的文档
  var doc = fl.getDocumentDOM();
  if (!doc) {
    alert("请打开fla文档");
    return;
  }

  var eleName = doc.name;
  var timeStr = getTimeStr();
  var pngName = folder + timeStr + "_" + eleName + "_"+ getHourStr() +".png";

  //去掉文件的扩展名
  pngName = pngName.replace(".fla","");
  doc.exportPNG(pngName, true, true);

  // 导出完成提示
  showResult(pngName);
}






//导出所选到png v1.4
//将flash所选内容保存为png
//  素材将保存到脚本目录下的 JSFL 文件夹里
//	支持设置导出的素材名称
//	支持将素材放大导出
//	支持逐个导出选中元素
function selection2png(fURL) {
  var folder = fURL;
  FLfile.createFolder(folder);

  //打开的文档
  var doc = fl.getDocumentDOM();
  if (!doc) {
    alert("请打开fla文档");
    return;
  }

  //判断是否有所选内容
  var len = doc.selection.length;
  if (len == 0) {
    alert("请在舞台选择一个元素");
    return;
  }

  if (len > 1) {
    // 逐个导出选中元素
    var showStr ="你选中了多个元素，是否逐个导出？\n“确定”，将逐个导出；\n“取消”，将所有元素导出成一张图片；";
    var boo = confirm(showStr);
    if( boo )
    {
      exportMultiSelection(doc, folder);
      return;
    }
  }

  // 合并导出
  exportMergeSelection(doc, folder);
}

// 合并导出
function exportMergeSelection(doc, folder) {
  //获取选中的元件名称
  var eleName = "";
  if (doc.selection.length == 1) {
    var ele = doc.selection[0];
    if (ele.elementType == "instance") {
      if (ele.name){
        eleName = ele.name;
      }else{
        eleName = ele.libraryItem.name;
      }
      // 如果是库文件，则只取元件名
      var index = eleName.lastIndexOf("/");
      if (index != -1) eleName = eleName.substring(index + 1);
    } else {
      eleName = doc.selection[0].name;
    }
  }

  //交互提示
  var inputName = prompt("请输入素材的名字", eleName);
  if (inputName == null) return;
  eleName = inputName;

  var inputRate = prompt("请输入放大倍数", 1);
  if (inputRate == null) return;
  inputRate = parseFloat(inputRate);
  if (!inputRate) inputRate = 1;

  // 导出
  var timeStr = getTimeStr();
  var pngName = folder + timeStr + "_" + eleName + ".png";
  exportOneSelection(doc, pngName, inputRate);

  // 导出完成提示
  showResult(pngName);
}

// 逐个导出所选
function exportMultiSelection(doc, folder) {
  var eleName = "";
  //交互提示
  var prefixName = prompt("请输入素材前缀名（留空则使用实例名称）", "0_");
  if (prefixName == null) return;

  var inputRate = prompt("请输入放大倍数", 1);
  if (inputRate == null) return;
  inputRate = parseFloat(inputRate);
  if (!inputRate) inputRate = 1;

  //重新创建对应目录
  folder += doc.name;
  FLfile.createFolder(folder);
  fl.trace("creatFolder:"+folder);
  if (!FLfile.exists(folder)) {
    alert("保存png的文件夹创建失败！！！");
    return;
  }

  // 暂存选中记录
  var selections = new Array();
  var len = doc.selection.length;
  for (var i = 0; i < len; i++) {
    selections.push( doc.selection[i] );
  }

  var count = 0;
  var pngName = "";
  for (var i = 0; i < len; i++) {
    var ele = selections[i];
    doc.selectNone();
    doc.selection = [ele];

    eleName = "";
    if ( prefixName == "" ){
      //获取选中的元件名称
      if (ele.elementType == "instance") {
          eleName = ele.name;
      }
      if( eleName=="" )
      {
        count++;
        eleName = count.toString();
      }
    } else {
      // 使用前缀
      count++;
      eleName = prefixName + "" +count;
    }

    pngName = folder + "/" +  eleName + ".png";

    // 导出选中
    exportOneSelection(doc, pngName, inputRate);
  }

  // 恢复选中记录
  doc.selectNone();
  doc.selection = selections;

  // 导出完成提示
  showResult(pngName);
}

// 导出一个选中对象
function exportOneSelection(doc, pngName, inputRate)
{
  //拷贝所选内容到新的文档
  // 打散的形状，不能执行复制操作，可以人工ctrl+g打组处理，然后再导出
  doc.clipCopy();

  //创建新文档
  var exportDoc = fl.createDocument();
  exportDoc.clipPaste();
  exportDoc.selectAll();

  // 转成元件 并进行缩放
  exportDoc.convertToSymbol("graphic", "eClip", "top left");
  var clip = exportDoc.selection[0];
  clip.scaleX = inputRate;
  clip.scaleY = inputRate;

  //将元件转成位图，解决边界计算比实际略小的情况
  exportDoc.convertSelectionToBitmap();

  //设置舞台大小 将图片尺寸调整为偶数
  var bm = exportDoc.selection[0];
  bm.x = 0;
  bm.y = 0;
  bmW = Math.ceil(bm.width);
  bmH = Math.ceil(bm.height);
  bmW = bmW % 2 == 0 ? bmW : bmW + 1;
  bmH = bmH % 2 == 0 ? bmH : bmH + 1;
  exportDoc.width = bmW;
  exportDoc.height = bmH;

  //去掉文件的扩展名
  //pngName = pngName.replace("fla","");
  //pngName = pngName.replace(".xfl","");
  exportDoc.selectNone();

  // fl.trace(pngName);
  exportDoc.exportPNG(pngName, true, true);
  exportDoc.close(false);
}



/*
脚本说明 v1.3.1
功能：
		将Flash主场景上的各个图层导出成png；
		素材将保存到脚本目录下的 JSFL 文件夹里
		支持导出主场景当前时间轴状态；

说明：
1.请将fla文档切换到主场景，否则导出的图片可能不正确；
2.脚本是通过Flash的“导出 PNG”功能实现的，通过调整“分辨率”和“包含”可以导出更大尺寸的图片
	导出2倍大小的图：先手动执行一次“导出PNG”，并在导出对话框将分辨率设置成144（72x2）dpi，再次执行本脚本即可；
	导出舞台之外的元素：先手动执行一次“导出PNG”，并在导出对话框将“包含”选项调整为“最小影像区域”，再次执行本脚本即可；将包含选项调整为“完整文档大小”之后再执行脚本则只会导出和舞台相同的尺寸；
3.空图层、引导层上的内容将不会被导出；
4.遮罩效果支持不太好，建议将遮罩层和被遮罩层放到一个元件里；
	被遮罩的图层将在应用遮罩效果后一层层地被导出
	遮罩层上的内容将不会被导出；
*/
function layer2png(fURL) {
  var folder = fURL;
  FLfile.createFolder(folder);

  var doc = fl.getDocumentDOM();
  if (!doc) {
    alert("请打开并选定一个fla文档");
    return;
  }

  //以文档名创建文件夹
  folder += doc.name;

//   folder = folder.replace(".fla", "");
//   folder = folder.replace(".xfl", "");

  //清空对应目录
  if (FLfile.exists(folder)) FLfile.remove(folder);

  //重新创建对应目录
  FLfile.createFolder(folder);
  fl.trace("creatFolder:"+folder);
  if (!FLfile.exists(folder)) {
    alert("保存png的文件夹创建失败！！！");
    return;
  }
  //获得当前时间轴的图层
  var index = doc.currentTimeline;
  var layers = doc.timelines[index].layers;

  //记录各图层的"隐藏"和"轮廓"状态
  var len = layers.length;
  var status = [];
  for (var i = 0; i < len; i++) {
    var layer = layers[i];
    status.push({
      visible: layer.visible,
      outline: layer.outline,
      locked: layer.locked
    });

    //隐藏全部图层，并取消轮廓状态
    layer.visible = false;
    layer.outline = false;
    //layer.locked = false;
  }

  //单独显示每个要导出的文件，并导出文件
  var maskIndex = [];
  var maskedIndex = [];
  for (var i = 0; i < len; i++) {
    var layer = layers[i];
    //跳过文件夹
    if (layer.layerType == "folder") continue;
    //跳过引导层
    if (layer.layerType == "guide") continue;
    //跳过遮罩层 和 被遮罩内容
    if (layer.layerType == "mask") {
      maskIndex.push(i);
      continue;
    }
    if (layer.layerType == "masked") {
      maskedIndex.push(i);
      continue;
    }
    //跳过空图层
    if (layer.frames[index].elements.length == 0) continue;

    //显示并导出当前图层
    layer.visible = true;
    var pngName = folder + "/" + (len - i) + "_" + layer.name + ".png";
    doc.exportPNG(pngName, true, true);

    //隐藏当前图层
    layer.visible = false;
  }

  //查找遮罩层和被遮罩层的关联
  var maskStatus = [];
  var m1;
  var m2;
  var last;
  for (var i = 0; i < maskIndex.length; i++) {
    m1 = maskIndex[i];
    last = m1;
    for (var j = 0; j < maskedIndex.length; j++) {
      m2 = maskedIndex[j];
      if ((m2 = last + 1)) {
        maskStatus.push({ mask: m1, masked: m2 });
        last = m2;
      }
    }
  }

  //应用遮罩效果并导出
  var maskLayer;
  var maskedLayer;
  for (var i = 0; i < maskStatus.length; i++) {
    maskLayer = layers[maskStatus[i].mask];
    maskedLayer = layers[maskStatus[i].masked];

    //跳过空图层
    if (maskedLayer.frames[index].elements.length == 0) continue;

    //显示并导出当前图层
    maskLayer.visible = true;
    maskedLayer.visible = true;
    maskLayer.locked = true;
    maskedLayer.locked = true;

    var pngName = folder + "/" + (len - i) + "_" + maskedLayer.name + ".png";
    doc.exportPNG(pngName, true, true);

    //恢复状态
    maskLayer.visible = false;
    maskedLayer.visible = false;
    maskLayer.locked = false;
    maskedLayer.locked = false;
  }

  //还原各图层状态
  for (var i = 0; i < len; i++) {
    var layer = layers[i];
    //跳过文件夹
    if (layer.layerType == "folder") continue;

    layer.visible = status[i].visible;
    layer.outline = status[i].outline;
    layer.locked = status[i].locked;
  }

  // 导出完成提示
  showResult(pngName);
}

function lib2png(fURL)
{
  var folder = fURL;
  FLfile.createFolder(folder);

  //打开的文档
  var doc = fl.getDocumentDOM();
  if (!doc) {
    alert("请打开fla文档");
    return;
  }

  var libSelection = doc.library.getSelectedItems();
  if (!libSelection || libSelection.length == 0) {
    alert("请在库中选择一个或多个元件");
    return;
	}

  var pathName = folder + doc.name + "/";
	var fileName = "";
  var fileNameFirst = "";
  var itemNum = libSelection.length;
	if (itemNum > 0){
		//清空对应目录
		if (FLfile.exists(pathName)) FLfile.remove(pathName);
		FLfile.createFolder(pathName);	//重新创建对应目录
		if (!FLfile.exists(pathName)) {
			alert("保存png的文件夹创建失败！！！");
			return;
		}
	}

	var libItem,lType,lName;
  var count = 0;
  for (var i = 0; i < itemNum; i++) {
		libItem = libSelection[i];
		lType = libItem.itemType;
		lName = libItem.name;
    if (
      lType == "movie clip" ||
      lType == "graphic" ||
      lType == "button" ||
      lType == "bitmap"
    ) {
      //if (lName.indexOf("/") == -1) {
      // var index = lName.indexOf("/");
      // if( index != -1 )
      //   lName = lName.replace(/\//g,"__")
      var index = lName.lastIndexOf("/");
      if( index != -1 )
        lName = lName.substring(index+1);

      fl.trace("库元件导出 " + lName);
      fileName = pathName + lName + "_.png";
      fileNameFirst = pathName + lName + "_0001.png";
      libItem.exportToPNGSequence(fileName);
      count++;
      //}
    }
  }

  // 导出完成提示
  if (count > 0) {
    showResult(fileNameFirst);
  } else {
    alert("( ˇˍˇ )没有找到元件（文件夹内的元件不被导出）");
  }
}






// 导出完成提示
//  path = file，打开文件夹并选中文件
// path = folder，打开文件夹
function showResult(path) {
  var fpath = getFolder(path);
  var showStr ="☀☀☀( ^_^ )☀☀☀\n已导出到：" + FLfile.uriToPlatformPath(fpath);
  showStr += "\n是否打开输出目录？";
  // showStr = showStr.replace("file:///","");
  // showStr = showStr.replace("|/",":/");
  var boo = confirm(showStr);
  if (boo)
    if (FLfile.exists(path))
      selectFile(path); // 尝试选中第一个文件
  else
      openFolder(fpath);
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
// 0803
function getHourStr() {
  var today = new Date();
  var h = checkTime(today.getHours());
  var m = checkTime(today.getMinutes());
  var s = checkTime(today.getSeconds());
  return h + m + s;
}
// 0803
function getTimeStr() {
  var today = new Date();
  var y = checkTime(today.getFullYear());
  var m = checkTime(today.getMonth() + 1);
  var d = checkTime(today.getDate());
  return m + d;
}
function checkTime(i) {
  if (i < 10) i = "0" + i;
  return i.toString();
}


function openFolder(folderPath){
  folderPath = FLfile.uriToPlatformPath(folderPath);
  if (isMac)
      pStr = 'open "'+folderPath+'"';
  else
      pStr = 'start explorer "'+folderPath+'"';
  FLfile.runCommandLine(pStr);
}

function selectFile(folderPath){
  folderPath = FLfile.uriToPlatformPath(folderPath);
  if (isMac)
      pStr = 'open -R "'+folderPath+'"';
  else
      pStr = 'explorer /select,"'+folderPath+'"';
  FLfile.runCommandLine(pStr);
}