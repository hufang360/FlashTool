// 工作目录
var winSWF = fl.configURI + "WindowSWF/";
var winSWFJSFL = winSWF + "flash工具箱/";



function libRename() {
  //打开的文档
  var doc = fl.getDocumentDOM();
  if (!doc) {
    alert("请打开fla文档");
    return;
  }

  var pName = prompt("请输入库元件前缀名", "lib");
  if (!pName) return;

  var lib = doc.library;
  var _l1 = 0;
  var _l2 = 0;
  for (var i in lib) {
    _l1++;
    for (var j in lib[i]) {
      if (lib[i][j].itemType == "folder") {
      } else {
        _l2++;
        lib[i][j].name = pName + "-" + _l2;
      }
    }
  }
  //fl.getDocumentDOM().library.items[0].itemType
}


function libReplace() {
  //打开的文档
  var doc = fl.getDocumentDOM();
  if (!doc) {
    alert("请打开fla文档");
    return;
  }

  var libSelection = doc.library.getSelectedItems();
  if (!libSelection || libSelection.length == 0) {
    alert("请在库中选择元件");
    return;
  }

  // 读取记录
  var url = winSWFJSFL + 'util.jsfl';
  show_str = "";
  if (!show_str)
    show_str = '查找 | 替换成';
  
  // 提示框
  var pName = prompt("请输入 “查找字符”以及“替换符”\n中间用 ' | ' 符号隔开，分隔符左右两边各有一个空格", show_str);
  if (!pName) return;
  
  // 取出输入值
  arr = pName.split(' | ');
  len = arr.length;
  if ( len<2 ){
    alert("输入的格式不正确！");
    return;
  }



  search_str=arr[0];
  replace_str=arr[1];


  var showStr = '';
  for ( var k=0; k<libSelection.length;k++ ) {
    obj_select = libSelection[k];

    // 取出不含文件夹的文件名
    raw_name=obj_select.name;
    name = obj_select.name;
    index = name.indexOf(search_str);
    if (index==-1)
      continue;

    name = name.replace(search_str,replace_str);
    fix_name = name;
    index = name.lastIndexOf("/");
    if (index!=-1)
      fix_name = name.substring(index+1);

    // 检索重名情况
    libnames = [];
    libs = doc.library;
    for (var i in libs){
      libnames.push(libs[i].name);
    }
    index = libnames.indexOf(name);
    if(index!=-1){
      if (showStr)
        showStr += "、" + obj_select.name;
      else
        showStr = obj_select.name;
    }else{
      obj_select.name = fix_name.toString();
    }

  }
  if (showStr)
    alert("部分元件名替换后会有重名情况，故未命名：\n"+showStr);
  //fl.getDocumentDOM().library.items[0].itemType
}


// 按类型整理库
function libConclude(){
  /*
  库文件整理v1.0
  制作:mm2004mx
  2004.1.7
  */
   //打开的文档
   var doc = fl.getDocumentDOM();
   if (!doc) {
     alert("请打开fla文档");
     return;
   }

   var cResult = confirm( "本操作具有一定风险，使用后请检查动画是否正常\n 点击取消则取消本操作！");
   if(!cResult) return;

  var lir = doc.library;
  var lirItem = lir.items;
  //
  // 忽略组件目录 Component Assets
  //
  var folderNames = ["■图形■","■图片■","■按钮■","■影片剪辑■","■视频■","■字体■","■声音■","■组件■","■标准组件-编译剪辑■","Component Assets"];
  var fname = new RegExp("^(?:"+folderNames.join("|")+")$");
  var graphic_list = [];
  var button_list = [];
  var movieclip_list = [];
  var photo_list = [];
  var sound_list = [];
  var compent_list = [];
  var video_list = [];
  var folder_list = [];
  var flashcompent_list = [];
  var font_list = [];

  //获取库文件列表
  for (i=0; i<lirItem.length; i++) {
    if(fname.test(lirItem[i].name.replace(/\/.+/g, ''))){
      continue;
    }

    switch (lir.getItemType(lirItem[i].name)) {
      case "graphic" :
        graphic_list.push(lirItem[i]);
        break;
      case "button" :
        button_list.push(lirItem[i]);
        break;
      case "movie clip" :
        movieclip_list.push(lirItem[i]);
        break;
      case "video" :
        video_list.push(lirItem[i]);
        break;
      case "font" :
        font_list.push(lirItem[i]);
        break;
      case "sound" :
        sound_list.push(lirItem[i]);
        break;
      case "compiled clip" :
        flashcompent_list.push(lirItem[i]);
        break;
      case "component" :
        compent_list.push(lirItem[i]);
        break;
      case "bitmap" :
        photo_list.push(lirItem[i]);
        break;
      case "folder" :
        folder_list.push(lirItem[i]);
        break;
      default :
        fl.trace("库文件损坏!"+lir.getItemType(lirItem[i].name));
        break;
    }
  }
  if (graphic_list.length>0) {
    lir.newFolder("■图形■");
  }
  if (button_list.length>0) {
    lir.newFolder("■按钮■");
  }
  if (movieclip_list.length>0) {
    lir.newFolder("■影片剪辑■");
  }
  if (video_list.length>0) {
    lir.newFolder("■视频■");
  }
  if (font_list.length>0) {
    lir.newFolder("■字体■");
  }
  if (sound_list.length>0) {
    lir.newFolder("■声音■");
  }
  if (compent_list.length>0) {
    lir.newFolder("■组件■");
  }
  if (flashcompent_list.length>0) {
    lir.newFolder("■标准组件-编译剪辑■");
    lir.selectItem("■标准组件-编译剪辑■");
    lir.moveToFolder('■组件■');
  }
  if (photo_list.length>0) {
    lir.newFolder("■图片■");
  }
  for (i=0; i<movieclip_list.length; i++) {
    lir.selectItem(movieclip_list[i].name);
    lir.moveToFolder('■影片剪辑■');
  }
  for (i=0; i<graphic_list.length; i++) {
    lir.selectItem(graphic_list[i].name);
    lir.moveToFolder('■图形■');
  }
  for (i=0; i<button_list.length; i++) {
    lir.selectItem(button_list[i].name);
    lir.moveToFolder('■按钮■');
  }
  for (i=0; i<video_list.length; i++) {
    lir.selectItem(video_list[i].name);
    lir.moveToFolder('■视频■');
  }
  for (i=0; i<font_list.length; i++) {
    lir.selectItem(font_list[i].name);
    lir.moveToFolder('■字体■');
  }
  for (i=0; i<sound_list.length; i++) {
    lir.selectItem(sound_list[i].name);
    lir.moveToFolder('■声音■');
  }
  for (i=0; i<compent_list.length; i++) {
    lir.selectItem(compent_list[i].name);
    lir.moveToFolder('■组件■');
  }
  for (i=0; i<flashcompent_list.length; i++) {
    lir.selectItem(flashcompent_list[i].name);
    lir.moveToFolder('■组件■/■标准组件-编译剪辑■');
  }
  for (i=0; i<photo_list.length; i++) {
    lir.selectItem(photo_list[i].name);
    lir.moveToFolder('■图片■');
  }
  //clear lib
  for (i=0; i<folder_list.length; i++) {
    try{
      lir.selectItem(folder_list[i].name);
      lir.deleteItem();
    }catch(err){
    }
  }
}