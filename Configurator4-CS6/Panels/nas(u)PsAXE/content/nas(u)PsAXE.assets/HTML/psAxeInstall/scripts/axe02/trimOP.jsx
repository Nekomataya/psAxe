/*trinOP.jsx
再生ヘッドを終了点でトリミング
*/
nas=app.nas;
var trimClipOP=function(){
	var selected=nas.axeCMC.getSelectedItemId();
	for(var idx=0;idx<selected.length;idx++){
	  nas.axeCMC.getItemById(selected[idx]);//getItemByIdで単独セレクト兼ねる
	  nas=app.nas;nas.axeCMC.execWithReference("timelineTrimLayerEnd");
	 };
	nas.axeCMC.selectItemsById(selected);
};
 app.activeDocument.suspendHistory("trim Clip OP","trimClipOP();");