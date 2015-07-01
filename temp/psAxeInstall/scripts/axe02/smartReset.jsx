/* smartReset.jsx
	スマートオブジェクトをリセット
手順

1.対象レイヤ選択
 （これはユーザによる選択
   アクティブレイヤがスマートオブジェクトでない場合はこの機能自体を中断）
2.「コンテンツの編集」でオリジナルのラスタを別ウインドウで表示
3.全選択・コピーでバッファにとる
4.保存せずにウインドウを閉じてクリア
5.元のドキュメントに戻り対象レイヤをラスタライズ
6.不透明度を0にして
7.レイヤの上にコピーバッファ内容をペースト
8.下のレイヤと結合
*/
	nas=app.nas;
var myUndoStr=nas.uiMsg.resetSmartObj;//"スマートオブジェクトをリセット";
var myExcute="";
//=============== コード
myExcute+="if(app.activeDocument.activeLayer.kind == LayerKind.SMARTOBJECT){";
// =======================================================コンテンツの編集
myExcute+="var id72 = stringIDToTypeID(\"placedLayerEditContents\");var desc12 = new ActionDescriptor();executeAction( id72, desc12, DialogModes.NO );";
// =======================================================レイヤのコピー
myExcute+="app.activeDocument.activeLayer.copy();";
// =======================================================保存せずに閉じる
myExcute+="app.activeDocument.close(SaveOptions.DONOTSAVECHANGES);";
// =======================================================ラスタライズ
myExcute+="app.activeDocument.activeLayer.rasterize(RasterizeType.ENTIRELAYER);";
// =======================================================不透明度0%
myExcute+="app.activeDocument.activeLayer.opacity=0.0;";
// =======================================================ペースト
myExcute+="app.activeDocument.paste();";
// =======================================================マージ
myExcute+="app.activeDocument.activeLayer.merge();}";
ErrStrs = {}; ErrStrs.USER_CANCELLED=localize("$$$/ScriptingSupport/Error/UserCancelled=User cancelled the operation"); try {
	if(activeDocument.suspendHistory){
		activeDocument.suspendHistory(myUndoStr,myExcute);
	}else{
		eval(myExcute)
	}
} catch(e){if (e.toString().indexOf(ErrStrs.USER_CANCELLED)!=-1) {;} else{alert(localize("$$$/ScriptingSupport/Error/CommandNotAvailable=The command is currently not available"));}}

