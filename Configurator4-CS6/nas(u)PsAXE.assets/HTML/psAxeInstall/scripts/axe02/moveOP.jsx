/*trinIP.jsx
	OUT点に移動
*/
nas=app.nas;
var moveClipOP=function(){
	var selected=nas.axeCMC.getSelectedItemId();
	for(var idx=0;idx<selected.length;idx++){
	  nas.axeCMC.getItemById(selected[idx]);//getItemByIdで単独セレクト兼ねる
	  nas.axeCMC.execWithReference("timelineMoveLayerEndPoint");
	};
 	nas.axeCMC.selectItemsById(selected);
};
 app.activeDocument.suspendHistory("move Clip OP","moveClipOP()");