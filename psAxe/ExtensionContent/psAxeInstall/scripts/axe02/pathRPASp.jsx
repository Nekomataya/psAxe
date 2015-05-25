//　作業パスを鉛筆でストロークしてから作業パスを削除する。プレッシャ感知
 if((app.activeDocument.pathItems.length)&&(app.activeDocument.pathItems[0].kind==PathKind.WORKPATH)){
var myPathStroke="var myPath=app.activeDocument.pathItems[0];";
//作業パスを鉛筆で描画
    myPathStroke+="myPath.strokePath(ToolType.PENCIL,true);";
//作業パスを削除
    myPathStroke+="myPath.remove();";
 if(app.activeDocument.suspendHistory){
     app.activeDocument.suspendHistory("パスをストローク", myPathStroke);
 }else{
     eval(myPathStroke);
 }
}
