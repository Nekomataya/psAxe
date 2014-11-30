/*
	レイヤトレーラー内のレイヤを逆順(下から順)でソート
	sortLayersByName.jsx
*/
ErrStrs = {};ErrStrs.USER_CANCELLED=localize("$$$/ScriptingSupport/Error/UserCancelled=User cancelled the operation");try {
var myTarget=activeDocument.activeLayer.parent.layers;
if(myTarget.length>1){
	var sortOrder=new Array();
	for (idx=0;idx<myTarget.length;idx++){
		if (myTarget[idx].isBackgroundLayer){
			continue;//レイヤが背景だったら無視
		}else{
			sortOrder.push(myTarget[idx].name);
		}
	}
	sortOrder.sort();//sortOrder.reverse();
	for (idx=1;idx<sortOrder.length;idx++){
		if(sortOrder[idx-1]==sortOrder[idx]){
			alert("同名のレイヤがあります。\n二つ目以降のレイヤは並び替えの対象になりません。");
			break;
		}
	}
	for (idx=0;idx<sortOrder.length;idx++){
		myTarget.getByName(sortOrder[idx]).move(myTarget[0],ElementPlacement.PLACEBEFORE);
	}
 for(var idx=0;idx<myTarget.length;idx++){if(myTarget[idx].visible){app.activeDocument.activeLayer=myTarget[idx];break;}};
}
} catch(e){ if (e.toString().indexOf(ErrStrs.USER_CANCELLED)!=-1) {;} else{alert(localize("$$$/ScriptingSupport/Error/CommandNotAvailable=The command is currently not available"));}};

//sortLayersByName.jsx
