/*trinIP.jsx
	IN点に移動
	マルチセレクト対応
*/
nas=app.nas;
var moveClipIP=function(){
	var selected=nas.axeCMC.getSelectedItemId();
	for(var idx=0;idx<selected.length;idx++){
	  nas.axeCMC.getItemById(selected[idx]);//getItemByIdで単独セレクト兼ねる
	  nas.axeCMC.execWithReference("timelineMoveLayerInPoint");
	};
	nas.axeCMC.selectItemsById(selected);
};
 app.activeDocument.suspendHistory("move Clip IP","moveClipIP()");