//レイヤトレーラ内のレイヤを全て100%表示状態にリセットする
var myDocLayers=app.activeDocument.activeLayer.parent.layers;
for(var idx=0;idx<myDocLayers.length;idx++){
	if(myDocLayers[idx].opacity!=100.0){myDocLayers[idx].opacity=100.0}
	if(myDocLayers[idx].visible!=true){myDocLayers[idx].visible=true}
}