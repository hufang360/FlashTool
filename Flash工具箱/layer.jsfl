/*************************************
	清除空白图层
*************************************/

//
//设置根据曾名称要忽略的层
var IGNORE_LAYER_BY_NAME = /^(actionscript|as|label|assist|soundtrack|sound)$/i;
//扩展 folder 的定义范围
var FOLDER_TYPE = /^(folder|mask|guide)$/; //--;
//all layer type: "normal"、"guide"、"guided"、"mask"、"masked" 和 "folder"。
function clearEmptyLayer(){
	//打开的文档
	var doc = fl.getDocumentDOM();
	if (!doc) {
		alert("请打开fla文档");
		return;
	}
	
	var tl = doc.getTimeline();
	//find all blank layers
	var dl = getEmptyLayers(tl);
	//
	fl.outputPanel.clear();
	doc.save();
	dl.reverse();
	for(i=0;i<dl.length;i++){
		//fl.trace("delete: [" + tl.layers[dl[i]].layerType + "] "+tl.layers[dl[i]].name);
		tl.deleteLayer(dl[i]);
	}

}



function util_string_isStringEmpty(str){
	var s = str.replace(/[ \n\r\t]/g, "");
	return s == "";
}
/////////////////////////////////////////////
function isFrameBlank(f){
	if(f.elements.length == 0 && util_string_isStringEmpty(f.actionScript)){
		return true;
	}else{
		return false;
	}
}
function isLayerBlank(layer){
	var frameid = layer.frames[layer.frames.length - 1].startFrame;
	while(frameid > 0){
		if(!isFrameBlank(layer.frames[frameid]))
			return false;
		frameid = layer.frames[frameid-1].startFrame;
	}
	return isFrameBlank(layer.frames[frameid]);
}
/*
 *	功能:	测试图层是否空白文件夹
 *	参数:
 *			tl			Timeline	时间线
 *			layerID		Number		图层ID
 *	返回:
 *			Boolean
 */
function isEmptyFolder(tl, folderID){
	var folder =  tl.layers[folderID];
	var endLayer = folderID + countChild(tl, folderID);
	var i = folderID+1;
	do{
		if(tl.layers[i] == null)
			return true;
		if(tl.layers[i].parentLayer == folder){
			//是否被忽略的图层
			if(IGNORE_LAYER_BY_NAME.test(tl.layers[i].name)){
				return false;
			}
			if(FOLDER_TYPE.test(tl.layers[i].layerType)){
				//是否非空文件夹
				if(!isEmptyFolder(tl, i)){
					return false;
				}
			}else{
				//是否非空图层
				if(!isLayerBlank(tl.layers[i])){
					return false;
				}
			}
		}
		i++;
	}while(i<=endLayer);
	
	return true;
}
/*
 *	功能:	测试两个层是否存在父子关系
 *	参数:
 *		tl			TimeLine
 *		father		the father layer
 *		child		the child layer
 *	返回:
 *		Boolean
 */
function isMyChild(tl, father, child){
	if(typeof father == "number")
		father = tl.layers[father];
	if(typeof child == "number")
		child = tl.layers[child];
		
	if(child == null || child.parentLayer == null){
		return false;
	}else if(child.parentLayer == father){
		return true;
	}else{
		return isMyChild(tl, father, child.parentLayer);
	}
}
/*
 *	功能:	获取图层的子层数量
 *	参数:
 *		tl			TimeLine
 *		fatherID		the father layer
 *	返回:
 *		Number
 */
function countChild(tl, fatherID, noDeep){
	var lid = fatherID+1;
	var len = tl.layers.length;
	while(lid<len){
		if(tl.layers[lid] == null || tl.layers[lid].parentLayer == null)
			break;
		if(noDeep){
			if(tl.layers[lid].parentLayer != tl.layers[fatherID])
				break;
		}else{
			if(!isMyChild(tl, fatherID, lid))
				break;
		}
		lid++;
	}
	return lid - fatherID - 1;
}
/*
 */
function getEmptyLayers(tl){
	var total = tl.layers.length;
	var el = [];
	for(i=0;i<total;i++){
		//是否被忽略的图层
		if(IGNORE_LAYER_BY_NAME.test(tl.layers[i].name)){
			continue;
		}
		if(FOLDER_TYPE.test(tl.layers[i].layerType)){
			//check folder
			if(isEmptyFolder(tl, i)){
				el.push(i);
				i += countChild(tl, i);
			}
		}else{
			if(isLayerBlank(tl.layers[i])){
				el.push(i);
			}
		}
	}
	return el;
}
