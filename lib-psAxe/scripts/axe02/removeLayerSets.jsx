/*
	レイヤセットの全削除
	選択したレイヤの含まれるトレーラ内のレイヤセットを解除する
	レイヤセット内のレイヤはレイヤとして処理する。（再帰処理はしない）
*/
exFlag=true;
//そもそもドキュメントがなければ終了
	if(app.documents.length==0){
		exFlag=false;
	}
if(exFlag){
var targetSets=activeDocument.activeLayer.parent.layerSets;var setCount=targetSets.length;
	for (var idx=0;idx<setCount;idx++){
		
		var targetSet=targetSets[0];var myCount=targetSet.layers.length;
		for (var idL=0;idL<myCount;idL++){
			targetSet.layers[0].move(targetSet,ElementPlacement.PLACEBEFORE)
		}
		targetSet.remove();
	}
}else{alert( localize(nas.uiMsg.noDocument));};//"ドキュメントが無いみたいダ"
