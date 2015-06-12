/*
ヘッド位置のアクティブレイヤに不透明度キーフレームを作成
キー補間法は停止で作成する
*/
nas=app.nas;
	if(nas.axeCMC.getSelectedItemId().length==1){
var myTarget=app.activeDocument.activeLayer;
var currentOpacity=myTarget.opacity;
  var desc=nas.axeVTC.switchKeyTrack ("enable");
app.activeDocument.suspendHistory(
"setKeyframeHold",
'myTarget.opacity=(currentOpacity)?0:100;myTarget.opacity=currentOpacity;nas.axeVTC.selectAnimationKeyAt();nas.axeVTC.switchKeyInterp ("hold");'
)
	}
