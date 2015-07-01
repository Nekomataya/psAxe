/*(afReverse)
	アニメフレームの順序反転
 */
	var nas=app.nas;
//	"アニメフレームを反転";
var myUndoStr=nas.localize(nas.uiMsg["reverseAnimationFrame"]);
var myExcute="";
//=============== コード
myExcute+="nas.axeAFC.reverseAnimationFrames();";
//=================================　Execute width Undo
ErrStrs = {}; ErrStrs.USER_CANCELLED=localize("$$$/ScriptingSupport/Error/UserCancelled=User cancelled the operation"); try {
	if(activeDocument.suspendHistory){
		activeDocument.suspendHistory(myUndoStr,myExcute);
	}else{
		eval(myExcute)
	}
} catch(e){if (e.toString().indexOf(ErrStrs.USER_CANCELLED)!=-1) {;} else{alert(localize("$$$/ScriptingSupport/Error/CommandNotAvailable=The command is currently not available"));}}
