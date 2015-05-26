/*
	アクティブトレーラーの最上位レイヤを直下のレイヤと入れ換える
	swapLayers.jsx
	アクティブレイヤも交換
// enable double clicking from the Macintosh Finder or the Windows Explorer
// #target photoshop
*/
 var myDocLayers=((app.activeDocument.activeLayer.parent.typename=="Document") && (app.activeDocument.activeLayer.typename=="LayerSet"))?app.activeDocument.activeLayer:app.activeDocument.activeLayer.parent;
  var xLinks=(myDocLayers.xLinks)? myDocLayers.xLinks:[];//プロパティがない場合は初期値で
  var subMotionLayers=new Array();
 if((myDocLayers.typename!="Document")&&(xLinks.length)){
	for(var ix=0;ix<xLinks.length;ix++){if(app.activeDocument.layers[xLinks[ix]]===myDocLayers){continue}
		subMotionLayers.push(app.activeDocument.layers[xLinks[ix]])
	}
}
if(myDocLayers.layers.length>1){
var myUndoStr="上下入れ替え";
var myExecute="app.activeDocument.activeLayer=myDocLayers.layers[1];myDocLayers.layers[1].move(myDocLayers.layers[0],ElementPlacement.PLACEBEFORE);if(subMotionLayers.length){for(var lx=0;lx<subMotionLayers.length;lx++){if(subMotionLayers[lx].layers.length){subMotionLayers[lx].layers[1].move(subMotionLayers[lx].layers[0],ElementPlacement.PLACEBEFORE)}}}"
if(app.activeDocument.suspendHistory){app.activeDocument.suspendHistory(myUndoStr,myExecute)}else{eval(myExecute)}
};
//swapLayers.jsx
/*
var myDocLayers=app.activeDocument.activeLayer.parent.layers;
for(var idx=0;idx<myDocLayers.length;idx++){
	if(myDocLayers[idx].visible){var kidx=idx;break;}
};
if((kidx+1)<myDocLayers.length){
	//myDocLayers[kidx].move(myDocLayers[kidx+1],ElementPlacement.PLACEAFTER);
	app.activeDocument.activeLayer=myDocLayers[kidx]
};
*/