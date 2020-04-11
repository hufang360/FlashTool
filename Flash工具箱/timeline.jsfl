
function moveEnd()
{
	//打开的文档
	var doc = fl.getDocumentDOM();
	if (!doc) {
		alert("请打开fla文档");
		return tl;
	}

	var tl = doc.getTimeline();
	if( !tl ){
		alert("没有时间轴");
		return;
	}
	tl.currentFrame = tl.frameCount;
}



function moveStart(){
	//打开的文档
	var doc = fl.getDocumentDOM();
	if (!doc) {
		alert("请打开fla文档");
		return tl;
	}

	var tl = doc.getTimeline();
	if( !tl ){
		alert("没有时间轴");
		return;
	}

	tl.currentFrame = 0;
}

//关键帧 前一个（所有图层）
function preKeyframeGlobal(){
	//打开的文档
	var doc = fl.getDocumentDOM();
	if (!doc) {
		alert("请打开fla文档");
		return tl;
	}

	var tl = fl.getDocumentDOM().getTimeline();
	var key = 0;
	var klayers = [];

	if(tl.currentFrame > key){
		for(var j=0; j<tl.layers.length; j++){
			var sf = 0;
			var layer = tl.layers[j];
			if(tl.currentFrame <= layer.frames.length && layer.layerType != "folder"){
				sf = layer.frames[tl.currentFrame].startFrame;
				if(sf == tl.currentFrame)
					sf = layer.frames[tl.currentFrame - 1].startFrame;
			}else if(layer.layerType != "folder"){
				sf = layer.frames[layer.frames.length - 1].startFrame;
			}
			if(sf > key){
				klayers = [j];
				key = sf;
			}else if(sf == key){
				klayers.push(j);
			}
		}
		if(key > 0){
			//防止第一帧时选择所有帧
			tl.setSelectedLayers(klayers[0], true);
			for(var j=1; j< klayers.length; j++)
				tl.setSelectedLayers(klayers[j], false);
		}
		tl.currentFrame = key;
		tl.setSelectedFrames(tl.currentFrame, tl.currentFrame+1);
	}
}
//关键帧 前一个
function preKeyframe(){

	//打开的文档
	var doc = fl.getDocumentDOM();
	if (!doc) {
		alert("请打开fla文档");
		return tl;
	}

	var tl = fl.getDocumentDOM().getTimeline();
	var layer = tl.layers[tl.currentLayer];
	var startframe = layer.frames[tl.currentFrame].startFrame;

	if(startframe == tl.currentFrame && tl.currentFrame > 0){
		startframe = layer.frames[tl.currentFrame-1].startFrame;
	}
	tl.currentFrame = startframe >=0 ? startframe:0;
	tl.setSelectedFrames(tl.currentFrame, tl.currentFrame+1);
}


//关键帧 下一个（所有图层）
function nextKeyframeGlobal(){
	//打开的文档
	var doc = fl.getDocumentDOM();
	if (!doc) {
		alert("请打开fla文档");
		return tl;
	}

	var tl = fl.getDocumentDOM().getTimeline();

	var key = tl.frameCount - 1;
	var klayers = [];

	if(tl.currentFrame < key){
		for(var j=0; j<tl.layers.length; j++){
			if(tl.currentFrame <= tl.layers[j].frames.length && tl.layers[j].layerType != "folder"){
				var dura = tl.layers[j].frames[tl.currentFrame].duration;
				if(dura == 0)
					dura = tl.layers[j].frames[tl.currentFrame + 1].duration + 1;
				var sf = tl.layers[j].frames[tl.currentFrame].startFrame + dura;
				if(sf < tl.layers[j].frames.length){
					if(sf < key){
						klayers = [j];
						key = sf;
					}else if(sf == key){
						klayers.push(j);
					}
				}
			}
		}
		if(klayers.length > 0){
			if(tl.layers[klayers[0]].frames[key].startFrame == key){
				tl.setSelectedLayers(klayers[0], true);
				for(var j=1; j<klayers.length; j++)
					tl.setSelectedLayers(klayers[j], false);
				tl.currentFrame = key;
				tl.setSelectedFrames(key, key+1);
			}
		}		
	}

}
//关键帧 下一个
function nextKeyframe(){
	//打开的文档
	var doc = fl.getDocumentDOM();
	if (!doc) {
		alert("请打开fla文档");
		return tl;
	}

	var tl = fl.getDocumentDOM().getTimeline();
	var layer = tl.layers[tl.currentLayer];
	var key = layer.frames[tl.currentFrame].startFrame + layer.frames[tl.currentFrame].duration;

	if(key < layer.frames.length){
		tl.currentFrame = key;
		tl.setSelectedFrames(key, key+1);
	}else{
		//goto last frame
		tl.currentFrame = layer.frames.length-1;
		tl.setSelectedFrames(tl.currentFrame, tl.currentFrame+1);
	}
}