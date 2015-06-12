/*trinIP.jsx
再生ヘッドを開始点でトリミング
*/
nas=app.nas;
var trimClipIP=function(){
	var selected=nas.axeCMC.getSelectedItemId();
	for(var idx=0;idx<selected.length;idx++){
	  nas.axeCMC.getItemById(selected[idx]);//getItemByIdで単独セレクト兼ねる
	  nas.axeCMC.execWithReference("timelineTrimLayerStart");	 
	 };
	nas.axeCMC.selectItemsById(selected);
};
 app.activeDocument.suspendHistory("trim Clip IP","trimClipIP();");
