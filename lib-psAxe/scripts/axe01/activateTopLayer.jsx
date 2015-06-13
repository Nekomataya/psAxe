//トレーラ内の最も上の表示レイヤをアクティブにする
if(app.documents.length){
  if(app.nas){nas=app.nas;}
//	上位レイヤをアクティブ;
  var myUndo=nas.localize(nas.uiMsg["activateUpperLayer"]);
  var myAction="";
	myAction+="nas.axeCMC.focusTop()";
  if(app.activeDocument.suspendHistory){app.activeDocument.suspendHistory(myUndo,myAction)}else{evel(myAction)}
}
