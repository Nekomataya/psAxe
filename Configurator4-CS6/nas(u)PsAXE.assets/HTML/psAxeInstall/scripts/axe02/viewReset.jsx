//レイヤトレーラ内のレイヤを全て100%表示状態にリセットする
	nas=app.nas;
	nas.uiMsg.opacityReset={en:"opacity reset",ja:"表示リセット"};
	var myUndo=nas.localize(nas.uiMsg["opacityReset"]);//表示リセット
	var myExec="";
myExec+='var myDocLayers=app.activeDocument.activeLayer.parent.layers;';
myExec+='for(var idx=0;idx<myDocLayers.length;idx++){';
myExec+='	if(myDocLayers[idx].visible!=true){myDocLayers[idx].visible=true}';
myExec+='	if(myDocLayers[idx].opacity!=100.0){myDocLayers[idx].opacity=100.0}}';
	app.activeDocument.suspendHistory(myUndo,myExec);
