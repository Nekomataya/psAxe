//　作業パスをfillして作業パスを削除する。(前景色・パス閉じる・アンチエリアスoff)
 if((app.activeDocument.pathItems.length)&&(app.activeDocument.pathItems[0].kind==PathKind.WORKPATH)){
var myPathFill="var myPath=app.activeDocument.pathItems[0];";
//作業パスを鉛筆で描画
    myPathFill+="myPath.fillPath(app.foregroundColor,ColorBlendMode.NORMAL,100.0,false,0.0,false,true);";
//作業パスを削除
    myPathFill+="myPath.remove();";
 if(app.activeDocument.suspendHistory){
     app.activeDocument.suspendHistory("パスを塗潰し", myPathFill);
 }else{
     eval(myPathStroke);
 }
}
