/*
ヘッド位置のアクティブレイヤの不透明度キーフレームを削除
*/
nas=app.nas;
	if(nas.axeCMC.getSelectedItemId().length==1){
app.activeDocument.suspendHistory(
"removeOpacityKeyframe",
'nas.axeVTC.selectAnimationKeyAt();nas.axeVTC.switchKeyFrame("Dlt ");'
);
	};
