//　作業パスを鉛筆でストロークしてから作業パスを削除する。プレッシャ感知
 if((app.activeDocument.pathItems.length)&&(app.activeDocument.pathItems[0].kind==PathKind.WORKPATH)){
var myPathStroke="var myPath=app.activeDocument.pathItems[0];";
//作業パスを鉛筆で描画
    myPathStroke+="myPath.strokePath(ToolType.BRUSH,true);";
//作業パスを削除
    myPathStroke+="myPath.remove();";
 if(app.activeDocument.suspendHistory){
     app.activeDocument.suspendHistory(localize({en:"stroke path -",ja:"パスをストローク"}), myPathStroke);
 }else{
     eval(myPathStroke);
 }
}
