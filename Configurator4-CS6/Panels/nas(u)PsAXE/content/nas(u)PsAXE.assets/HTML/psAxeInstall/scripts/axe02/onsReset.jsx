/*	onsReset.jsx
	オニオンスキン状態のリセット
	アクティブレイヤのあるレイヤセットの全レイヤの不透明度をリセットする。
*/
ErrStrs = {};ErrStrs.USER_CANCELLED=localize("$$$/ScriptingSupport/Error/UserCancelled=User cancelled the operation");try {
var myDocLayers=app.activeDocument.activeLayer.parent.layers;
for(var idx=0;idx<myDocLayers.length;idx++){
	if(!(myDocLayers[idx].visible)){
		myDocLayers[idx].visible=true;
	}
	if(myDocLayers[idx].opacity<100){
		myDocLayers[idx].opacity=100;
	}
};
} catch(e){ if (e.toString().indexOf(ErrStrs.USER_CANCELLED)!=-1) {;} else{alert(localize("$$$/ScriptingSupport/Error/CommandNotAvailable=The command is currently not available"));}};
//onsReset.jsx
