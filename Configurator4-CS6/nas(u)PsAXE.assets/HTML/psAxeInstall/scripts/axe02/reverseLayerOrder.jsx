/*
	レイヤ並び順反転サブプロシージャ
*/

layerReverse= function(targetCol){
	var myTarget=targetCol;
	if(!(targetCol instanceof Layers)){return false;};
	if(myTarget.length<=1){return false;};
	var sortOrder=new Array();
	for (idx=0;idx<myTarget.length;idx++){
		if (myTarget[idx].isBackgroundLayer){
			continue;
		}else{
			sortOrder.push(myTarget[idx]);
		}
	}
	for (idx=0;idx<sortOrder.length;idx++){
		sortOrder[idx].move(myTarget[0],ElementPlacement.PLACEBEFORE);
	}
	return;
}
//	main
layerReverse(activeDocument.activeLayer.parent.layers);
var myDocLayers=app.activeDocument.activeLayer.parent.layers;for(var idx=0;idx<myDocLayers.length;idx++){if(myDocLayers[idx].visible){app.activeDocument.activeLayer=myDocLayers[idx];break;}};
