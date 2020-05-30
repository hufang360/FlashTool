// 工作目录
var winSWF = fl.configURI + "WindowSWF/"
var winSWFJSFL = winSWF + "flash工具箱/"

function importSprite()
{
	//打开的文档
	var doc = fl.getDocumentDOM();
	if (!doc) {
		alert("请打开fla文档");
		return tl;
	}
	var lib = doc.library;

	// 选择精灵图
	var uri = fl.browseForFileURL("select", "请选择sprite图", "PNG (*.png)", "png");
	// var uri = "file:///Mac/Users/hf/Desktop/Acc_Balloon_6.png"
	var itemName = getNoRepeatName(lib, getFile(uri));
	lib.addNewItem('graphic', itemName);
	if (lib.getItemProperty('linkageImportForRS') == true) {
		lib.setItemProperty('linkageImportForRS', false);
	}
	else {
		lib.setItemProperty('linkageExportForAS', false);
		lib.setItemProperty('linkageExportForRS', false);
	}
	lib.selectItem(itemName);
	lib.editItem();

	// 导入图片
	doc.importFile(uri);

	// 取出上次的输入记录
	var jsflURL = winSWFJSFL + 'util.jsfl';
    var s = fl.runScript(jsflURL, 'getSpriteParam');
    if (!s)
		s = '1,1,0';
	lastArr = s.split(",");
	var initRow = lastArr[0];
	var initCol = lastArr[1];
	var initInsert = lastArr[2];

	//交互提示
	var inputRow = prompt("行数", initRow);
	if (inputRow == null) return;
	inputRow = parseFloat(inputRow);
	if (!inputRow) inputRow = initRow;

	var inputCol = prompt("列数", initCol);
	if (inputCol == null) return;
	inputCol = parseFloat(inputCol);
	if (!inputCol) inputCol = initCol;

	var inputInsert = prompt("插帧数", initInsert);
	if (inputInsert == null) return;
	inputInsert = parseFloat(inputInsert);
	if (!inputInsert && inputInsert<1) inputInsert = initInsert;

	// 记忆当前输入
	var s = inputRow + "," + inputCol + "," + inputInsert;
	fl.runScript(jsflURL, 'setSpriteParam',s)

	// var inputRow = 3;
	// var inputCol = 4;
	// var inputInsert = 1;
	var totalFrame = inputRow * inputCol * (inputInsert+1);

	var timeline = doc.getTimeline();
	var layerPng = timeline.layers[0];
	var pngItem = layerPng.frames[0].elements[0];
	var pW = pngItem.width / inputCol;
	var pH = pngItem.height / inputRow;

	c = inputCol;
	r = inputRow;
	keyFrameNum = inputInsert+1
	var indexArr = []
	for(var i=1; i<totalFrame; i++){
		timeline.insertFrames();
		if (i%keyFrameNum==0)
			indexArr.push(i);
	}
	// 创建关键帧
	for(index in indexArr){
		timeline.currentFrame = indexArr[index];
		timeline.convertToKeyframes();
	}
	// 调节位置
	var rX = 0;
	var rY = 0;
	var i = 0;
	var count = 1;
	for(index in indexArr){
		i = indexArr[index];
		curItem = layerPng.frames[i].elements[0];

		rX = count%inputCol;
		rY = Math.floor(count/inputCol);
		curItem.x = -(rX * pW);
		curItem.y = -(rY * pH);

		count ++;
	}
	
	// 添加遮罩层
	timeline.addNewLayer("mask");
	timeline.setLayerProperty('layerType', 'mask');
	doc.addNewPrimitiveRectangle({left:0, top:0, right:pW, bottom:pH}, 0);
	timeline.setLayerProperty('locked', true);

	// 将png所在图层改名，并设置为遮罩层，并锁定以便于预览
	timeline.layers[1].name = "png"
	timeline.setSelectedLayers(1);
	timeline.setLayerProperty('layerType', 'masked');
	timeline.setLayerProperty('locked', true);

	// doc.exitEditMode();
	// doc.library.selectItem(itemName);
}


// 获得不重复的名字
function getNoRepeatName(lib, itemName){
	var isDup = hasItemName(lib, itemName);
	if (!isDup){
		return itemName;
	} else {
		n = itemName;
		// 允许尝试1万次
		var len = 10000;
		for(var i = 1; i< len; i++){
			n = itemName + "_" + i;
			isDup = hasItemName(lib, n);
			if (!isDup)
				return n;
		}
		// 超过1万次加w，然后再次允许尝试1万次
		var len = 10000;
		for(var i = 0; i< len; i++){
			n = itemName + "_w_" + i;
			isDup = hasItemByName(lib, n);
			if (!isDup)
				return n;
		}
	}
}

// 检查库中是否有同名项
function hasItemName(lib, itemName){
	var len = lib.items.length;
	for (var i=0; i<len; i++)
	{
		if( lib.items[i].name == itemName)
			return true;
	}
	return false;
}

// 获得文件名
function getFile(str) {
    var index = str.lastIndexOf("/");
	if (index != -1) str = str.substring(index + 1);

	index = str.toLocaleLowerCase().lastIndexOf(".png");
	if (index != -1) str = str.substring(0, index);

    return str;
}