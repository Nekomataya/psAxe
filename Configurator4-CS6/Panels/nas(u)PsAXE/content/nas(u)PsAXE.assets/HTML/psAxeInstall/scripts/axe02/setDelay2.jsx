/*(setDelay)
	アニメフレームにフレームで遅延時間を設定する
	モード判定をして、タイムラインモード時は選択されたレイヤに継続時間を設定する様に拡張
 */
app.bringToFront();
if(app.nas){
nas=app.nas;
//+++++++++++++++++++++++++++++++++ここまで共用
var myDelay=2;//フレーム数
var myExcute="";
if(nas.axeVTC.getDuration()){
	var myUndoStr="setDuration";
//=============== コード
//選択アイテムに対して実行
myExcute+='nas.axeCMC.doInSelectedItems( function(){nas.axeVTC.setDuration( '+myDelay+' );})';
}else{
	var myUndoStr="setDelay";
//=============== コード
myExcute+="nas.axeAFC.setDly( "+myDelay/nas.FRATE+" );";
}
//=================================　Execute width Undo
ErrStrs = {}; ErrStrs.USER_CANCELLED=localize("$$$/ScriptingSupport/Error/UserCancelled=User cancelled the operation"); try {
	if(activeDocument.suspendHistory){
		activeDocument.suspendHistory(myUndoStr,myExcute);
	}else{
		eval(myExcute)
	}
} catch(e){if (e.toString().indexOf(ErrStrs.USER_CANCELLED)!=-1) {;} else{alert(localize("$$$/ScriptingSupport/Error/CommandNotAvailable=The command is currently not available"));}}
}